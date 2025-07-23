import prisma from "../utils/db.js";
import { exec } from "child_process";
import path from "path";

// Run Python algorithm and save room assignments
export const runAndSaveRoomAssignments = (req, res) => {
  const scriptPath = path.resolve(process.cwd(), "algorithm", "roomAssignment_algorithm.py");

  exec(`python "${scriptPath}"`, async (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ success: false, message: "Algorithm execution failed", error: error.message });
    }

    if (stderr) console.error("Python stderr:", stderr);

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
      await prisma.roomAssignment.deleteMany();

      const createPromises = assignments.map(({ examId, roomId }) =>
        prisma.roomAssignment.create({
          data: {
            examId: Number(examId),
            roomId: Number(roomId),
            status: "ACTIVE", // from RoomAssignmentStatus enum
          },
        })
      );
      await Promise.all(createPromises);

      const savedAssignments = await prisma.roomAssignment.findMany({
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
              invigilator: { include: { user: true } },
            },
          },
        },
        orderBy: { examId: "asc" },
      });

      const formatted = savedAssignments.map((assignment) => {
        const benches = assignment.room.benches || [];
        return {
          ...assignment,
          room: {
            ...assignment.room,
            totalBench: benches.length,
            totalCapacity: benches.reduce((sum, b) => sum + b.capacity, 0),
            benches: undefined,
          },
        };
      });

      return res.json({
        success: true,
        message: "Room assignments saved and fetched successfully",
        assignments: formatted,
      });
    } catch (dbErr) {
      return res.status(500).json({ success: false, message: "Database error", error: dbErr.message });
    }
  });
};

export const getAllRoomAssignments = async (req, res) => {
  try {
    const assignments = await prisma.roomAssignment.findMany({
      include: {
        room: { include: { benches: true } },
        exam: {
          include: {
            subject: {
              include: {
                semester: { include: { course: true } },
              },
            },
          },
        },
        invigilatorAssignments: {
          include: {
            invigilator: { include: { user: true } },
          },
        },
      },
      orderBy: [{ examId: "asc" }, { roomId: "asc" }],
    });

    const formatted = assignments.map((assignment) => {
      const benches = assignment.room.benches || [];
      return {
        ...assignment,
        room: {
          ...assignment.room,
          totalBench: benches.length,
          totalCapacity: benches.reduce((sum, b) => sum + b.capacity, 0),
          benches: undefined,
        },
      };
    });

    res.json({
      success: true,
      message: "All room assignments retrieved",
      assignments: formatted,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch room assignments", error: err.message });
  }
};

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
                semester: { include: { course: true } },
              },
            },
          },
        },
        invigilatorAssignments: {
          include: {
            invigilator: { include: { user: true } },
          },
        },
      },
    });

    const formatted = assignments.map((assignment) => {
      const benches = assignment.room.benches || [];
      return {
        ...assignment,
        room: {
          ...assignment.room,
          totalBench: benches.length,
          totalCapacity: benches.reduce((sum, b) => sum + b.capacity, 0),
          benches: undefined,
        },
      };
    });

    res.json({
      success: true,
      message: "Room assignments fetched successfully",
      assignments: formatted,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch room assignments", error: error.message });
  }
};

export const updateRoomAssignment = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status, completedAt } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid assignment id" });
    }

    const assignment = await prisma.roomAssignment.update({
      where: { id },
      data: {
        ...(status && { status }), // must be a valid RoomAssignmentStatus
        ...(completedAt !== undefined && {
          completedAt: completedAt ? new Date(completedAt) : null,
        }),
      },
      include: { room: true, exam: true },
    });

    res.json({
      success: true,
      message: "Room assignment updated successfully",
      assignment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update room assignment", error: error.message });
  }
};

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
    res.status(500).json({ success: false, message: "Failed to delete room assignment", error: error.message });
  }
};
