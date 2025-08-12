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
    if (invCount < 2) {
      return res.status(400).json({
        success: false,
        message: "Not enough invigilators to assign. At least 2 required.",
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: "DB error", error: err.message });
  }

  exec(`python "${scriptPath}"`, async (error, stdout) => {
    if (error) {
      return res.status(500).json({ success: false, message: "Algorithm execution failed", error: error.message });
    }

    if (!stdout) {
      return res.status(500).json({ success: false, message: "No output from Python script" });
    }

    let assignments;
    try {
      assignments = JSON.parse(stdout);
      if (assignments.error) {
        return res.status(400).json({ success: false, message: assignments.error });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: "Invalid Python output", error: err.message });
    }

    try {
      const generationId = uuidv4();
      const validAssignments = assignments.filter(
        (a) => a.invigilatorId && a.roomAssignmentId && VALID_STATUSES.includes(a.status)
      );

      await Promise.all(
        validAssignments.map((a) => {
          let assignedAtDate = new Date(a.assignedAt || Date.now());
          if (isNaN(assignedAtDate.getTime())) assignedAtDate = new Date();

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
      res.status(500).json({ success: false, message: "DB save failed", error: err.message });
    }
  });
};

// UPDATED: Return both all assignments and current assignments
export const getAllInvigilatorAssignments = async (req, res) => {
  try {
    // Get latest generationId
    const latest = await prisma.invigilatorAssignment.findFirst({
      orderBy: { assignedAt: "desc" },
      select: { generationId: true },
    });

    // Fetch all assignments
    const allAssignments = await prisma.invigilatorAssignment.findMany({
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

    // Fetch only current/latest assignments
    let currentAssignments = [];
    if (latest) {
      currentAssignments = await prisma.invigilatorAssignment.findMany({
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
    }

    res.json({
      success: true,
      allAssignments,
      currentAssignments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch assignments", error: error.message });
  }
};

export const getFilteredInvigilatorAssignments = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.roomAssignment = {
        exam: {
          date: {},
        },
      };
      if (startDate) where.roomAssignment.exam.date.gte = new Date(startDate);
      if (endDate) where.roomAssignment.exam.date.lte = new Date(endDate);
    }

    if (where.roomAssignment?.exam?.date && Object.keys(where.roomAssignment.exam.date).length === 0) {
      delete where.roomAssignment;
    }

    const assignments = await prisma.invigilatorAssignment.findMany({
      where,
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

    res.json({ success: true, assignments });
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
    return res.status(400).json({ success: false, message: "Invalid roomAssignmentId parameter" });
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
    res.status(500).json({ success: false, message: "Failed to fetch assignments", error: error.message });
  }
};

export const updateInvigilatorAssignmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  try {
    const updateData = { status };
    if (status === "COMPLETED") {
      updateData.completedAt = new Date();
    } else if (status === "ASSIGNED") {
      updateData.completedAt = null;
    }

    const updated = await prisma.invigilatorAssignment.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        invigilator: { include: { user: true } },
        roomAssignment: true,
      },
    });

    res.json({
      success: true,
      message: "Assignment status updated",
      assignment: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update failed", error: error.message });
  }
};

export const deleteInvigilatorAssignment = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.invigilatorAssignment.delete({
      where: { id: Number(id) },
    });

    res.json({
      success: true,
      message: "Invigilator assignment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete assignment",
      error: error.message,
    });
  }
};
