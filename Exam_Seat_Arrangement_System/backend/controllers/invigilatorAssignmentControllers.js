import prisma from "../utils/db.js";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Only valid enum values based on your Prisma schema
const VALID_STATUSES = ["ASSIGNED", "COMPLETED"];


export const runAndSaveInvigilatorAssignments = async (req, res) => {
  const scriptPath = path.resolve(process.cwd(), "algorithm", "invigilatorAssignment_algorithm.py");

  if (!fs.existsSync(scriptPath)) {
    return res.status(500).json({ success: false, message: "Algorithm script not found" });
  }

  // Pre-check: count invigilators before running Python script
  try {
    const invCount = await prisma.invigilator.count();
    if (invCount < 2) {
      return res.status(400).json({
        success: false,
        message: "Not enough invigilators to assign. At least 2 required.",
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: "DB error", error: err.message });
  }

  exec(`python "${scriptPath}"`, async (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Algorithm execution failed",
        error: error.message,
      });
    }

    if (!stdout) {
      return res.status(500).json({ success: false, message: "No output from Python script" });
    }

    let assignments;
    try {
      assignments = JSON.parse(stdout);

      // Handle error returned from Python
      if (assignments.error) {
        return res.status(400).json({
          success: false,
          message: assignments.error,
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Invalid Python output",
        error: err.message,
      });
    }

    try {
      const generationId = uuidv4(); 

      const validAssignments = assignments.filter(
        (a) =>
          a.invigilatorId &&
          a.roomAssignmentId &&
          VALID_STATUSES.includes(a.status)
      );

      await Promise.all(
        validAssignments.map((a) => {
          let assignedAtDate = new Date(a.assignedAt || Date.now());
          if (isNaN(assignedAtDate.getTime())) {
            assignedAtDate = new Date(); // fallback to current date
          }

          return prisma.invigilatorAssignment.create({
            data: {
              invigilatorId: a.invigilatorId,
              roomAssignmentId: a.roomAssignmentId,
              status: a.status,
              assignedAt: assignedAtDate,
              completedAt: null,
              generationId,
            },
          });
        })
      );

      res.json({
        success: true,
        message: "Invigilator assignments generated and saved successfully",
        generationId,
        totalAssigned: validAssignments.length,
        totalSkipped: assignments.length - validAssignments.length,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "DB save failed",
        error: err.message,
      });
    }
  });
};

export const getAllInvigilatorAssignments = async (req, res) => {
  try {
    const latest = await prisma.invigilatorAssignment.findFirst({
      orderBy: { assignedAt: "desc" },
      select: { generationId: true },
    });

    if (!latest) {
      return res.json({ success: true, assignments: [] });
    }

    const data = await prisma.invigilatorAssignment.findMany({
      where: { generationId: latest.generationId },
      include: {
        invigilator: { include: { user: true } },
        roomAssignment: {
          include: {
            room: true,
            exam: {
              include: {
                subject: {
                  include: {
                    semester: { include: { course: true } },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { assignedAt: "asc" },
    });

    res.json({ success: true, assignments: data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch invigilator assignments",
      error: error.message,
    });
  }
};


export const getInvigilatorAssignmentsByRoom = async (req, res) => {
  const roomAssignmentId = Number(req.params.roomAssignmentId);

  if (isNaN(roomAssignmentId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid roomAssignmentId parameter" });
  }

  try {
    const data = await prisma.invigilatorAssignment.findMany({
      where: { roomAssignmentId },
      include: {
        invigilator: { include: { user: true } },
        roomAssignment: {
          include: {
            room: true,
            exam: {
              include: {
                subject: {
                  include: {
                    semester: { include: { course: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    res.json({ success: true, assignments: data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch invigilator assignments for the room",
      error: error.message,
    });
  }
};
