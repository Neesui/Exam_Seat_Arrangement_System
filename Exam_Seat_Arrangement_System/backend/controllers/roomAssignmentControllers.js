import { PrismaClient } from "@prisma/client";
import { spawn, spawnSync } from "child_process";
import path from "path";

const prisma = new PrismaClient();

/**
 * Detects the Python executable to use.
 * Tries "python3" first, then "python".
 * Throws an error if neither found.
 */
function getPythonCommand() {
  let res = spawnSync("python3", ["--version"]);
  if (res.status === 0) return "python3";

  res = spawnSync("python", ["--version"]);
  if (res.status === 0) return "python";

  throw new Error("Python executable not found. Please install Python and ensure it's in your PATH.");
}

export const runAndSaveRoomAssignments = async (req, res) => {
  try {
    const { examId } = req.body;
    if (!examId || isNaN(examId)) {
      return res.status(400).json({ success: false, message: "Valid examId is required in request body" });
    }

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        subject: {
          include: {
            semester: { include: { course: true } },
          },
        },
      },
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    const students = await prisma.student.findMany({
      where: {
        semesterId: exam.subject.semester.id,
        courseId: exam.subject.semester.courseId,
      },
    });

    if (!students.length) {
      return res.status(200).json({ success: true, message: "No students found for this exam" });
    }

    const rooms = await prisma.room.findMany({
      include: { benches: true },
    });

    // Prepare input JSON for Python script
    const input = {
      exams: [
        {
          id: exam.id,
          startTime: exam.startTime?.toISOString(),
          endTime: exam.endTime?.toISOString(),
          students: students.map((s) => ({
            id: s.id,
            name: s.studentName,
            symbolNumber: s.symbolNumber,
            college: s.college,
          })),
        },
      ],
      rooms: rooms.map((room) => ({
        id: room.id,
        roomNumber: room.roomNumber,
        benches: room.benches.map((bench) => ({
          id: bench.id,
          capacity: bench.capacity,
        })),
      })),
    };

    const pythonCmd = getPythonCommand();

    const pythonProcess = spawn(pythonCmd, [
      path.join("algorithm", "roomAssignment_algorithm.py"),
    ]);

    let result = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.stdin.write(JSON.stringify(input));
    pythonProcess.stdin.end();

    pythonProcess.on("close", async (code) => {
      if (code !== 0 || errorOutput) {
        return res.status(500).json({
          success: false,
          message: "Python script error",
          error: errorOutput || `Exited with code ${code}`,
        });
      }

      let assignments;
      try {
        assignments = JSON.parse(result);
        if (!Array.isArray(assignments)) throw new Error("Invalid Python output format");
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to parse Python output",
          error: err.message,
        });
      }

      // Cancel any active assignments for this exam
      await prisma.roomAssignment.updateMany({
        where: { examId, status: "ACTIVE" },
        data: { status: "CANCELED" },
      });

      // Save new assignments
      const savedAssignments = [];
      for (const assignment of assignments) {
        const saved = await prisma.roomAssignment.create({
          data: {
            examId,
            roomId: assignment.roomId,
            status: "ACTIVE",
            assignedAt: new Date(assignment.assignedAt),
            completedAt: assignment.completedAt ? new Date(assignment.completedAt) : null,
          },
        });
        savedAssignments.push(saved);
      }

      return res.status(200).json({
        success: true,
        message: "Room assignments saved successfully",
        assignments: savedAssignments,
      });
    });
  } catch (error) {
    console.error("Error in runAndSaveRoomAssignments:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
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
    const allowedStatuses = ["ACTIVE", "COMPLETED", "CANCELED"];

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
