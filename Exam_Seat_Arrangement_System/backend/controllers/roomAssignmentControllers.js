// roomAssignmentControllers.js
import { PrismaClient } from "@prisma/client";
import { spawn, spawnSync } from "child_process";
import path from "path";

const prisma = new PrismaClient();

function getPythonCommand() {
  const py3 = spawnSync("python3", ["--version"]);
  if (py3.status === 0) return "python3";

  const py = spawnSync("python", ["--version"]);
  if (py.status === 0) return "python";

  throw new Error("Python is not installed or not in PATH");
}

function statusAllowsReassignment(existing) {
  return existing.status === "CANCELED" || existing.status === "COMPLETED";
}

export const runAndSaveRoomAssignments = async (req, res) => {
  try {
    const { examId } = req.body;

    if (!examId || isNaN(examId)) {
      return res.status(400).json({ success: false, message: "Valid examId is required" });
    }

    const exam = await prisma.exam.findUnique({
      where: { id: Number(examId) },
      include: {
        subject: {
          include: {
            semester: { include: { course: true } }
          }
        }
      }
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    const students = await prisma.student.findMany({
      where: {
        semesterId: exam.subject.semesterId,
        courseId: exam.subject.semester.courseId
      }
    });

    if (students.length === 0) {
      return res.status(200).json({ success: true, message: "No students to assign" });
    }

    const rooms = await prisma.room.findMany({
      include: { benches: true }
    });

    const input = {
      exams: [{
        id: exam.id,
        startTime: exam.startTime?.toISOString(),
        endTime: exam.endTime?.toISOString(),
        students: students.map((s) => ({
          id: s.id,
          name: s.studentName,
          symbolNumber: s.symbolNumber,
          college: s.college
        }))
      }],
      rooms: rooms.map((room) => ({
        id: room.id,
        roomNumber: room.roomNumber,
        benches: room.benches.map((bench) => ({
          id: bench.id,
          capacity: bench.capacity
        }))
      }))
    };

    const pythonCmd = getPythonCommand();
    const pythonProcess = spawn(pythonCmd, [
      path.join("algorithm", "roomAssignment_algorithm.py")
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
          error: errorOutput || `Exited with code ${code}`
        });
      }

      let assignments;
      try {
        assignments = JSON.parse(result);
        if (!Array.isArray(assignments)) throw new Error("Invalid script output");
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: "Error parsing Python output",
          error: err.message
        });
      }

      // Create day range for same-day checks WITHOUT mutating exam.startTime
      const examStartDay = new Date(exam.startTime);
      examStartDay.setHours(0, 0, 0, 0);
      const examEndDay = new Date(exam.startTime);
      examEndDay.setHours(23, 59, 59, 999);

      // Basic conflict checks for each assignment
      for (const a of assignments) {
        const existing = await prisma.roomAssignment.findFirst({
          where: {
            examId: Number(a.examId),
            roomId: Number(a.roomId),
            assignedAt: {
              gte: examStartDay,
              lt: examEndDay
            }
          }
        });

        // If there is already an active assignment for this room that day, block it.
        if (existing && existing.status === "ACTIVE") {
          return res.status(400).json({
            success: false,
            message: `Room ${a.roomId} is already assigned and active for the same day.`
          });
        }

        // You can add more checks here, e.g. allow reassignment only if existing.status in allowed list
      }

      // Cancel existing active assignments for this exam
      await prisma.roomAssignment.updateMany({
        where: { examId: Number(examId), status: "ACTIVE" },
        data: { status: "CANCELED" }
      });

      // Save new room assignments
      const savedAssignments = [];
      for (const a of assignments) {
        const saved = await prisma.roomAssignment.create({
          data: {
            examId: Number(a.examId),
            roomId: Number(a.roomId),
            status: "ACTIVE",
            assignedAt: new Date(a.assignedAt),
            completedAt: a.completedAt ? new Date(a.completedAt) : null
          }
        });
        savedAssignments.push(saved);
      }

      return res.status(200).json({
        success: true,
        message: "Room assignments completed successfully",
        assignments: savedAssignments
      });
    });
  } catch (error) {
    console.error("Room assignment error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while generating assignments",
      error: error.message
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
          include: {
            // include the join table entries so we can fetch the invigilator + user
            invigilators: {
              include: {
                invigilator: { include: { user: true } }
              }
            }
          }
        },
      },
      orderBy: [{ examId: "asc" }, { roomId: "asc" }],
    });

    // Format & flatten the shape so frontend can read `invigilatorAssignments[].invigilator.user`
    const formatted = assignments.map((a) => {
      const benches = a.room?.benches || [];
      // transform invigilatorAssignments: each invigilatorAssignment can contain multiple invigilators (join rows)
      const flattenedInvigilatorAssignments = (a.invigilatorAssignments || []).flatMap((ia) =>
        (ia.invigilators || []).map((joinRow) => {
          return {
            id: ia.id,
            status: ia.status,
            assignedAt: ia.assignedAt,
            completedAt: ia.completedAt,
            // put the invigilator directly here (frontend expects inv.invigilator)
            invigilator: joinRow.invigilator ? {
              id: joinRow.invigilator.id,
              phone: joinRow.invigilator.phone,
              course: joinRow.invigilator.course,
              user: joinRow.invigilator.user || null
            } : null
          };
        })
      );

      return {
        ...a,
        room: {
          ...a.room,
          totalBench: benches.length,
          totalCapacity: benches.reduce((sum, b) => sum + b.capacity, 0),
          benches: undefined,
        },
        invigilatorAssignments: flattenedInvigilatorAssignments
      };
    });

    res.json({
      success: true,
      message: "Room assignments fetched",
      assignments: formatted,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, message: "Error fetching assignments", error: error.message });
  }
};

// Get room assignments for a specific exam
export const getRoomAssignmentsByExam = async (req, res) => {
  try {
    const examId = Number(req.params.examId);
    if (isNaN(examId)) {
      return res.status(400).json({ success: false, message: "Invalid exam ID" });
    }

    // Fetch room assignments with exam and seating plans
    const assignments = await prisma.roomAssignment.findMany({
      where: { examId },
      include: {
        room: { include: { benches: true } },
        exam: {
          include: {
            subject: { include: { semester: { include: { course: true } } } },
            seatingPlans: {
              where: { isActive: true },
              include: {
                seats: { include: { student: true, bench: true } },
              },
            },
          },
        },
      },
    });

    if (!assignments || assignments.length === 0) {
      return res.json({ success: true, message: "Room assignments fetched successfully", assignments: [] });
    }

    // Get all room assignment IDs
    const assignmentIds = assignments.map(a => a.id);

    // Fetch invigilators for these room assignments
    const invAssignments = await prisma.invigilatorAssignment.findMany({
      where: { roomAssignmentId: { in: assignmentIds } },
      include: {
        invigilators: {
          include: { invigilator: { include: { user: true } } },
        },
      },
    });

    // Create a map of invigilators by roomAssignmentId
    const invMap = {};
    invAssignments.forEach(inv => {
      invMap[inv.roomAssignmentId] = (inv.invigilators || []).map(i => ({
        name: i.invigilator?.user?.name || null,
        email: i.invigilator?.user?.email || null,
        phone: i.invigilator?.phone || null, 
        status: inv.status,
        assignedAt: inv.assignedAt,
        completedAt: inv.completedAt,
      }));
    });

    // Format assignments for response
    const formatted = assignments.map(a => {
      const benches = a.room?.benches || [];
      const allSeats = (a.exam?.seatingPlans || []).flatMap(sp => sp.seats || []);
      const seatsInRoom = allSeats.filter(seat => seat.bench?.roomId === a.room.id);

      const uniqueColleges = [...new Set(seatsInRoom.map(s => s.student?.college).filter(Boolean))];

      return {
        ...a,
        room: {
          ...a.room,
          totalBench: benches.length,
          totalCapacity: benches.reduce((sum, b) => sum + b.capacity, 0),
          benches: undefined, 
          assignedColleges: uniqueColleges,
        },
        invigilatorAssignments: invMap[a.id] || [],
      };
    });

    res.json({ success: true, message: "Room assignments fetched successfully", assignments: formatted });

  } catch (error) {
    console.error("Error fetching room assignments:", error);
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
