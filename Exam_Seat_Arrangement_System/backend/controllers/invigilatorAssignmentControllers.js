import prisma from "../utils/db.js";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const VALID_STATUSES = ["ASSIGNED", "COMPLETED"];

export const runAndSaveInvigilatorAssignments = async (req, res) => {
  const scriptPath = path.resolve(process.cwd(), "algorithm", "invigilatorAssignment_algorithm.py");

  if (!fs.existsSync(scriptPath)) {
    return res.status(500).json({ success: false, message: "Algorithm script not found" });
  }

  try {
    const invCount = await prisma.invigilator.count();
    if (invCount < 2) return res.status(400).json({ success: false, message: "At least 2 invigilators required" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "DB error", error: err.message });
  }

  exec(`python "${scriptPath}"`, async (error, stdout, stderr) => {
    if (error) return res.status(500).json({ success: false, message: "Algorithm failed", error: error.message, stderr });

    if (!stdout) return res.status(500).json({ success: false, message: "No output from Python script" });

    let assignments;
    try {
      assignments = JSON.parse(stdout);
      if (assignments.error) return res.status(400).json({ success: false, message: assignments.error });
      if (!Array.isArray(assignments)) return res.status(500).json({ success: false, message: "Invalid output" });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Invalid JSON", error: err.message });
    }

    try {
      const generationId = uuidv4();
      const createdAssignments = [];

      for (const a of assignments) {
        const roomAssignmentId = Number(a.roomAssignmentId);
        if (!roomAssignmentId) continue;

        const roomExists = await prisma.roomAssignment.findUnique({ where: { id: roomAssignmentId } });
        if (!roomExists) continue;

        const invAssignment = await prisma.invigilatorAssignment.create({
          data: { roomAssignmentId, status: "ASSIGNED", assignedAt: new Date() },
        });

        for (const inv of a.invigilators) {
          await prisma.invigilatorOnAssignment.create({
            data: { invigilatorId: Number(inv.invigilatorId), invigilatorAssignmentId: invAssignment.id },
          });
        }

        const fullAssignment = await prisma.invigilatorAssignment.findUnique({
          where: { id: invAssignment.id },
          include: {
            invigilators: { include: { invigilator: { include: { user: true } } } },
            roomAssignment: { include: { room: true, exam: true } },
          },
        });

        createdAssignments.push(fullAssignment);
      }

      res.json({
        success: true,
        message: "Invigilator assignments generated and saved successfully",
        generationId,
        totalAssignments: createdAssignments.length,
        assignments: createdAssignments,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: "DB save failed", error: err.message });
    }
  });
};
//get all invigilator assignments
// get all invigilator assignments
export const getAllInvigilatorAssignments = async (req, res) => {
  try {
    const allAssignments = await prisma.invigilatorAssignment.findMany({
      include: {
        invigilators: {
          include: {
            invigilator: {
              include: {
                user: true,
              },
            },
          },
        },
        roomAssignment: {
          include: {
            room: true,
            exam: {
              include: {
                subject: true, 
              },
            },
          },
        },
      },
      orderBy: {
        assignedAt: "asc",
      },
    });

    // Transform JSON response to add subjectName directly
    const transformed = allAssignments.map((assignment) => ({
      ...assignment,
      roomAssignment: {
        ...assignment.roomAssignment,
        exam: {
          ...assignment.roomAssignment.exam,
          subjectName: assignment.roomAssignment.exam?.subject?.subjectName || "N/A", 
        },
      },
    }));

    res.json({
      success: true,
      message: "All Invigilator assignments fetched successfully",
      assignments: transformed,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Fetch failed",
      error: err.message,
    });
  }
};

// Get only current active assignments
export const getFilteredInvigilatorAssignments = async (req, res) => {
  try {
    const assignments = await prisma.invigilatorAssignment.findMany({
      include: {
        invigilators: {
          include: {
            invigilator: {
              include: {
                user: {   
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        roomAssignment: {
          include: {
            room: true,
            exam: {
              include: {
                subject: {
                  select: {
                    subjectName: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        assignedAt: "asc",
      },
    });

    res.status(200).json({
      success: true,
      message: "Filtered Invigilator assignments fetched successfully",
      assignments,
    });
  } catch (error) {
    console.error("Error fetching current assignments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch current invigilator assignments",
      error: error.message,
    });
  }
};

export const getInvigilatorAssignmentsById = async (req, res) => {
  const { assignmentId } = req.params;
  const id = Number(assignmentId);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Invalid assignmentId" });
  }

  try {
    const assignment = await prisma.invigilatorAssignment.findUnique({
      where: { id },
      include: {
        // Include multiple invigilators
        invigilators: {
          include: {
            invigilator: {
              include: {
                user: true,
              },
            },
          },
        },
        // Room assignment with room and exam
        roomAssignment: {
          include: {
            room: {
              select: {
                roomNumber: true,
                block: true,
                floor: true,
                totalBench: true,
                totalCapacity: true,
              },
            },
            exam: {
              include: {
                subject: true,
                seatingPlans: {
                  include: {
                    seats: {
                      include: {
                        student: {
                          select: {
                            id: true,
                            studentName: true,
                            college: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    let students = [];
    assignment.roomAssignment.exam.seatingPlans.forEach(plan => {
      plan.seats.forEach(seat => {
        if (seat.student) students.push(seat.student);
      });
    });

    const response = {
      ...assignment,
      roomAssignment: {
        ...assignment.roomAssignment,
        exam: {
          ...assignment.roomAssignment.exam,
          students,
        },
      },
    };

    res.status(200).json({
      success: true,
      message: "Invigilator assignment fetched successfully",
      assignment: response,
    });
  } catch (err) {
    console.error("Error fetching assignment by ID:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch assignment",
      error: err.message,
    });
  }
};


//update invigilator assignment status
export const updateInvigilatorAssignmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!VALID_STATUSES.includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });

  try {
    const updated = await prisma.invigilatorAssignment.update({
      where: { id: Number(id) },
      data: { status, completedAt: status === "COMPLETED" ? new Date() : null },
      include: { invigilators: { include: { invigilator: { include: { user: true } } } }, 
      roomAssignment: { include: { room: true, exam: true } } },
    });
    res.json({ success: true, message: "Assignment status updated", assignment: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed", error: err.message });
  }
};

//delete invigilator assignment
export const deleteInvigilatorAssignment = async (req, res) => {
  const { id } = req.params;
  const assignmentId = Number(id);

  if (!Number.isInteger(assignmentId) || assignmentId <= 0) {
    return res.status(400).json({ success: false, message: "Invalid assignment id" });
  }

  try {
    // Delete all related invigilatorOnAssignment records first
    await prisma.invigilatorOnAssignment.deleteMany({
      where: { invigilatorAssignmentId: assignmentId },
    });

    // Now delete the invigilator assignment
    await prisma.invigilatorAssignment.delete({
      where: { id: assignmentId },
    });

    res.json({ success: true, message: "Assignment deleted successfully" });
  } catch (err) {
    console.error("Delete failed:", err);
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: err.message,
    });
  }
};

