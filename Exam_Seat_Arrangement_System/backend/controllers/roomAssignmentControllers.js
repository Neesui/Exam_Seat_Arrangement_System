import prisma from "../utils/db.js";
import { exec } from "child_process";
import path from "path";

// AUTO-GENERATE ROOM ASSIGNMENTS — call Python script and save to DB     
export const runAndSaveRoomAssignments = (req, res) => {
  const scriptPath = path.resolve(process.cwd(), "algorithm", "roomAssignment_algorithm.py");

  exec(`python "${scriptPath}"`, async (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ success: false, message: "Algorithm execution failed", error: error.message });
    }

    if (stderr) console.error("Python script stderr:", stderr);

    let assignments;
    try {
      assignments = JSON.parse(stdout);
      if (assignments.error) {
        return res.status(500).json({ success: false, message: "Algorithm error", error: assignments.error });
      }
    } catch (parseErr) {
      return res.status(500).json({ success: false, message: "Invalid output from Python", error: parseErr.message });
    }

    try {
      // Delete all old assignments
      await prisma.roomAssignment.deleteMany();

      // Insert new assignments
      const createPromises = assignments.map(({ examId, roomId }) =>
        prisma.roomAssignment.create({
          data: {
            examId: Number(examId),
            roomId: Number(roomId),
            isActive: true,
            isCompleted: false,
          },
        })
      );

      await Promise.all(createPromises);

      // Fetch newly created assignments with benches included
      const savedAssignments = await prisma.roomAssignment.findMany({
        include: {
          room: { include: { benches: true } },  // include benches here
          exam: {
            include: {
              subject: {
                include: {
                  semester: {
                    include: {
                      course: true,
                    },
                  },
                },
              },
            },
          },
          invigilatorAssignments: { include: { invigilator: { include: { user: true } } } },
        },
        orderBy: { examId: "asc" },
      });

      // Add totalBench and totalCapacity
      const assignmentsWithCapacity = savedAssignments.map((assignment) => {
        const benches = assignment.room.benches || [];
        return {
          ...assignment,
          room: {
            ...assignment.room,
            totalBench: benches.length,
            totalCapacity: benches.reduce((sum, bench) => sum + bench.capacity, 0),
            benches: undefined, // omit benches to reduce response size
          },
        };
      });

      return res.json({
        success: true,
        message: "Room assignments saved and fetched successfully",
        assignments: assignmentsWithCapacity,
      });
    } catch (dbErr) {
      return res.status(500).json({ success: false, message: "Database error", error: dbErr.message });
    }
  });
};

// GET ALL ROOM ASSIGNMENTS                              
export const getAllRoomAssignments = async (req, res) => {
  try {
    const assignments = await prisma.roomAssignment.findMany({
      include: {
        room: { include: { benches: true } },
        exam: {
          include: {
            subject: {
              include: {
                semester: {
                  include: {
                    course: true,
                  },
                },
              },
            },
          },
        },
        invigilatorAssignments: {
          include: {
            invigilator: {
              include: { user: true },
            },
          },
        },
      },
      orderBy: [{ examId: "asc" }, { roomId: "asc" }],
    });

    const assignmentsWithCapacity = assignments.map((assignment) => {
      const benches = assignment.room.benches || [];
      return {
        ...assignment,
        room: {
          ...assignment.room,
          totalBench: benches.length,
          totalCapacity: benches.reduce((sum, bench) => sum + bench.capacity, 0),
          benches: undefined,
        },
      };
    });

    res.json({ success: true, message: "All room assignments retrieved", assignments: assignmentsWithCapacity });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch room assignments", error: err.message });
  }
};

// GET ROOM ASSIGNMENTS BY EXAM                                           
export const getRoomAssignmentsByExam = async (req, res) => {
  try {
    const examId = Number(req.params.examId);

    const assignments = await prisma.roomAssignment.findMany({
      where: { examId },
      include: {
        room: { include: { benches: true } },
        exam: {
          include: {
            subject: {
              include: {
                semester: {
                  include: { course: true },
                },
              },
            },
          },
        },
        invigilatorAssignments: {
          include: {
            invigilator: {
              include: { user: true },
            },
          },
        },
      },
    });

    const assignmentsWithCapacity = assignments.map((assignment) => {
      const benches = assignment.room.benches || [];
      return {
        ...assignment,
        room: {
          ...assignment.room,
          totalBench: benches.length,
          totalCapacity: benches.reduce((sum, bench) => sum + bench.capacity, 0),
          benches: undefined,
        },
      };
    });

    res.json({
      success: true,
      message: "Room assignments fetched successfully",
      assignments: assignmentsWithCapacity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch room assignments",
      error: error.message,
    });
  }
};

// UPDATE ROOM ASSIGNMENT
export const updateRoomAssignment = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { isActive, isCompleted, completedAt } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid assignment id" });
    }

    const assignment = await prisma.roomAssignment.update({
      where: { id },
      data: {
        ...(isActive !== undefined && { isActive }),
        ...(isCompleted !== undefined && { isCompleted }),
        ...(completedAt !== undefined && { completedAt: completedAt ? new Date(completedAt) : null }),
      },
      include: { room: true, exam: true },
    });

    res.json({
      success: true,
      message: "Room assignment updated successfully",
      assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update room assignment",
      error: error.message,
    });
  }
};

// DELETE ROOM ASSIGNMENT
export const deleteRoomAssignment = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid assignment id" });
    }

    await prisma.roomAssignment.delete({ where: { id } });

    res.json({
      success: true,
      message: "Room assignment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete room assignment",
      error: error.message,
    });
  }
};
