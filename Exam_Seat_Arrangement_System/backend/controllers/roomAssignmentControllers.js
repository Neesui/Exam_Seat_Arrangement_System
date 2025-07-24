import prisma from "../utils/db.js";
import { exec } from "child_process";
import path from "path";

const allowedStatuses = ["ACTIVE", "COMPLETED", "CANCELED"];

export const runAndSaveRoomAssignments = (req, res) => {
  const scriptPath = path.resolve(process.cwd(), "algorithm", "roomAssignment_algorithm.py");

  exec(`python "${scriptPath}"`, async (error, stdout, stderr) => {
    if (error) {
      console.error("Python script error:", error);
      return res.status(500).json({ success: false, message: "Algorithm execution failed", error: error.message });
    }

    if (stderr) console.error("Python stderr:", stderr);

    let assignments;
    try {
      assignments = JSON.parse(stdout);
      if (assignments.error) {
        return res.status(500).json({ success: false, message: "Algorithm error", error: assignments.error });
      }
      if (!Array.isArray(assignments)) {
        return res.status(500).json({ success: false, message: "Algorithm output should be an array" });
      }
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      return res.status(500).json({ success: false, message: "Invalid output from Python", error: parseErr.message });
    }

    try {
      // Cancel old ACTIVE assignments (to keep history)
      await prisma.roomAssignment.updateMany({
        where: { status: "ACTIVE" },
        data: { status: "CANCELED", updatedAt: new Date() },
      });

      // Insert new assignments with assignedAt = now and status ACTIVE
      const createPromises = assignments.map(({ examId, roomId }) => {
        if (typeof examId !== "number" || typeof roomId !== "number") {
          throw new Error("Invalid examId or roomId in assignment");
        }
        return prisma.roomAssignment.create({
          data: {
            examId,
            roomId,
            status: "ACTIVE",
            assignedAt: new Date(),
          },
        });
      });

      await Promise.all(createPromises);

      // Fetch saved assignments with related data
      const savedAssignments = await prisma.roomAssignment.findMany({
        include: {
          room: { include: { benches: true } },
          exam: {
            include: {
              subject: { include: { semester: { include: { course: true } } } },
            },
          },
          invigilatorAssignments: {
            include: { invigilator: { include: { user: true } } },
          },
        },
        orderBy: { examId: "asc" },
      });

      // Format assignments: add totalBench and totalCapacity, exclude benches array for payload size
      const formatted = savedAssignments.map((assignment) => {
        const benches = assignment.room.benches || [];
        return {
          ...assignment,
          room: {
            ...assignment.room,
            totalBench: benches.length,
            totalCapacity: benches.reduce((sum, b) => sum + b.capacity, 0),
            benches: undefined, // exclude benches array
          },
        };
      });

      res.json({
        success: true,
        message: "Room assignments saved and fetched successfully",
        assignments: formatted,
      });
    } catch (dbErr) {
      console.error("Database error:", dbErr);
      res.status(500).json({ success: false, message: "Database error", error: dbErr.message });
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
            subject: { include: { semester: { include: { course: true } } } },
          },
        },
        invigilatorAssignments: {
          include: { invigilator: { include: { user: true } } },
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
    console.error("Fetch all assignments error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch room assignments", error: err.message });
  }
};

export const getRoomAssignmentsByExam = async (req, res) => {
  try {
    const examId = Number(req.params.examId);
    if (isNaN(examId)) {
      return res.status(400).json({ success: false, message: "Invalid exam ID" });
    }

    const assignments = await prisma.roomAssignment.findMany({
      where: { examId },
      include: {
        room: { include: { benches: true } },
        exam: {
          include: {
            subject: { include: { semester: { include: { course: true } } } },
          },
        },
        invigilatorAssignments: {
          include: { invigilator: { include: { user: true } } },
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
    console.error("Fetch assignments by exam error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch room assignments", error: error.message });
  }
};

export const updateRoomAssignment = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid assignment id" });
    }

    const { status, completedAt } = req.body;

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const updateData = {
      updatedAt: new Date(),
    };

    if (status) {
      updateData.status = status;

      if (status === "COMPLETED") {
        updateData.completedAt = completedAt ? new Date(completedAt) : new Date();
      } else {
        updateData.completedAt = null;
      }
    } else if (completedAt !== undefined) {
      updateData.completedAt = completedAt ? new Date(completedAt) : null;
    }

    const assignment = await prisma.roomAssignment.update({
      where: { id },
      data: updateData,
      include: { room: true, exam: true },
    });

    res.json({
      success: true,
      message: "Room assignment updated successfully",
      assignment,
    });
  } catch (error) {
    console.error("Update room assignment error:", error);
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
    console.error("Delete room assignment error:", error);
    res.status(500).json({ success: false, message: "Failed to delete room assignment", error: error.message });
  }
};
