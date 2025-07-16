import prisma from "../utils/db.js";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

// 📌 Auto-generate Invigilator Assignments using Python script
export const runAndSaveInvigilatorAssignments = (req, res) => {
  const scriptPath = path.resolve(process.cwd(), "algorithm", "invigilatorAssignment_algorithm.py");

  // Optional: Check if script exists
  if (!fs.existsSync(scriptPath)) {
    return res.status(500).json({ success: false, message: "Algorithm script not found" });
  }

  exec(`python "${scriptPath}"`, async (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ success: false, message: "Algorithm execution failed", error: error.message });
    }

    if (stderr) console.error("Python stderr:", stderr);

    if (!stdout) {
      return res.status(500).json({ success: false, message: "No output from Python script" });
    }

    let assignments;
    try {
      assignments = JSON.parse(stdout);
      if (assignments.error) {
        return res.status(500).json({ success: false, message: "Python error", error: assignments.error });
      }
    } catch (parseErr) {
      return res.status(500).json({ success: false, message: "Invalid Python output", error: parseErr.message });
    }

    try {
      // Delete previous assignments (you can add a filter for isActive if you want)
      await prisma.invigilatorAssignment.deleteMany();

      // Filter valid assignments: invigilatorId should be number or string (not null or undefined)
      const validAssignments = assignments.filter(a => a.invigilatorId != null);

      await Promise.all(
        validAssignments.map((a) => {
          // Safely parse assignedAt date or fallback to current date
          let assignedAtDate = new Date(a.assignedAt);
          if (isNaN(assignedAtDate.getTime())) {
            assignedAtDate = new Date();
          }

          return prisma.invigilatorAssignment.create({
            data: {
              invigilatorId: a.invigilatorId,
              roomAssignmentId: a.roomAssignmentId,
              status: a.status,
              assignedAt: assignedAtDate,
              completedAt: null,
            },
          });
        })
      );

      res.json({
        success: true,
        message: "Invigilator assignments generated and saved",
        totalAssigned: validAssignments.length,
        totalSkipped: assignments.length - validAssignments.length,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: "DB save failed", error: err.message });
    }
  });
};

// 📥 Get all invigilator assignments
export const getAllInvigilatorAssignments = async (req, res) => {
  try {
    const data = await prisma.invigilatorAssignment.findMany({
      include: {
        invigilator: { include: { user: true } },
        roomAssignment: {
          include: {
            room: true,
            exam: {
              include: {
                subject: {
                  include: {
                    semester: { include: { course: true } }
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { assignedAt: "asc" }
    });
    res.json({ success: true, assignments: data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch invigilator assignments", error: error.message });
  }
};

// 📥 Get assignments by roomAssignmentId
export const getInvigilatorAssignmentsByRoom = async (req, res) => {
  const roomAssignmentId = Number(req.params.roomAssignmentId);

  if (isNaN(roomAssignmentId)) {
    return res.status(400).json({ success: false, message: "Invalid roomAssignmentId parameter" });
  }

  try {
    const data = await prisma.invigilatorAssignment.findMany({
      where: { roomAssignmentId },
      include: {
        invigilator: { include: { user: true } },
        roomAssignment: true,
      }
    });
    res.json({ success: true, assignments: data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch invigilator assignments for the room", error: error.message });
  }
};
