import prisma from "../utils/db.js";
import { exec } from "child_process";
import path from "path";

// Assign a room to an exam
export const assignRoomToExam = async (req, res) => {
  try {
    const { roomId, examId } = req.body;

    if (!roomId || !examId) {
      return res.status(400).json({ success: false, message: "roomId and examId are required" });
    }

    const roomExists = await prisma.room.findUnique({ where: { id: Number(roomId) } });
    if (!roomExists) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    const examExists = await prisma.exam.findUnique({ where: { id: Number(examId) } });
    if (!examExists) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    const existing = await prisma.roomAssignment.findFirst({
      where: { roomId: Number(roomId), examId: Number(examId), isActive: true },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Room is already assigned to this exam (active assignment)",
      });
    }

    const assignment = await prisma.roomAssignment.create({
      data: {
        roomId: Number(roomId),
        examId: Number(examId),
        isActive: true,
        isCompleted: false,
      },
      include: { room: true, exam: true },
    });

    res.status(201).json({
      success: true,
      message: "Room assigned to exam successfully",
      assignment,
    });
  } catch (error) {
    console.error("Error in assignRoomToExam:", error);
    res.status(500).json({
      success: false,
      message: "Failed to assign room to exam",
      error: error.message,
    });
  }
};

// Get all room assignments for an exam
export const getRoomAssignmentsByExam = async (req, res) => {
  try {
    const examId = Number(req.params.examId);
    if (isNaN(examId)) {
      return res.status(400).json({ success: false, message: "Invalid examId parameter" });
    }

    const assignments = await prisma.roomAssignment.findMany({
      where: { examId },
      include: {
        room: true,
        invigilatorAssignments: {
          include: {
            invigilator: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Room assignments retrieved successfully",
      assignments,
    });
  } catch (error) {
    console.error("Error in getRoomAssignmentsByExam:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch room assignments",
      error: error.message,
    });
  }
};

// Update a room assignment
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
    console.error("Error in updateRoomAssignment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update room assignment",
      error: error.message,
    });
  }
};

// Delete a room assignment
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
    console.error("Error in deleteRoomAssignment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete room assignment",
      error: error.message,
    });
  }
};

// Run Python room assignment algorithm and save results
export const runAndSaveRoomAssignments = (req, res) => {
  const scriptPath = path.resolve(process.cwd(), "algorithm", "roomAssignment_algorithm.py");

  console.log("Running Python script at:", scriptPath);

  exec(`python "${scriptPath}"`, async (error, stdout, stderr) => {
    console.log("Python exec error:", error);
    console.log("Python stdout:", stdout);
    console.log("Python stderr:", stderr);

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Algorithm execution failed",
        error: error.message,
      });
    }

    if (stderr) {
      // You can decide whether to treat stderr as an error or just log
      console.error("Python script stderr:", stderr);
    }

    let assignments;
    try {
      assignments = JSON.parse(stdout);
      if (assignments.error) {
        return res.status(500).json({
          success: false,
          message: "Algorithm error",
          error: assignments.error,
        });
      }
    } catch (parseError) {
      console.error("Failed to parse JSON output from Python:", parseError);
      return res.status(500).json({
        success: false,
        message: "Invalid algorithm output format",
      });
    }

    try {
      // Delete old assignments
      await prisma.roomAssignment.deleteMany();

      // Create new assignments
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

      return res.json({
        success: true,
        message: "Room assignments saved successfully",
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return res.status(500).json({
        success: false,
        message: "Database error",
        error: dbError.message,
      });
    }
  });
};
