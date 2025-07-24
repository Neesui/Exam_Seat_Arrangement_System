import prisma from "../utils/db.js";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Only valid enum values based on your Prisma schema
const VALID_STATUSES = ["ASSIGNED", "COMPLETED"];

/**
 * Run the Python scheduling algorithm and save the results in the database
 */
export const runAndSaveInvigilatorAssignments = (req, res) => {
  const scriptPath = path.resolve(process.cwd(), "algorithm", "invigilatorAssignment_algorithm.py");

  if (!fs.existsSync(scriptPath)) {
    return res.status(500).json({ success: false, message: "Algorithm script not found" });
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
      if (assignments.error) {
        return res.status(500).json({
          success: false,
          message: "Python error",
          error: assignments.error,
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
      const generationId = uuidv4(); // unique batch for tracking

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
            assignedAtDate = new Date(); // fallback
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

/**
 * Fetch all latest invigilator assignments (based on most recent generationId)
 */
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

/**
 * Fetch invigilator assignments by specific RoomAssignment ID
 */
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
