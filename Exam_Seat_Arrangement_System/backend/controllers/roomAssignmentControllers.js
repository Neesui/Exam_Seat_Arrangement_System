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

    // Fetch exam with all necessary relations
    const exam = await prisma.exam.findUnique({
      where: { id: Number(examId) },
      include: {
        subject: { include: { semester: { include: { course: true } } } },
      },
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    // 🛑 1. Check if this exam already has active room assignments
    const existingActiveAssignments = await prisma.roomAssignment.findMany({
      where: { examId: Number(examId), status: "ACTIVE" },
      include: { room: true },
    });

    if (existingActiveAssignments.length > 0) {
      const assignedRooms = existingActiveAssignments.map(a => a.room?.roomNumber).join(", ");
      return res.status(400).json({
        success: false,
        message: `This exam already has an active room assignment in room(s): ${assignedRooms}.`,
      });
    }

    // Fetch students related to exam course/semester
    const students = await prisma.student.findMany({
      where: {
        semesterId: exam.subject.semesterId,
        courseId: exam.subject.semester.courseId,
      },
    });

    if (students.length === 0) {
      return res.status(200).json({ success: true, message: "No students to assign" });
    }

    // Fetch all rooms
    const rooms = await prisma.room.findMany({ include: { benches: true } });
    if (rooms.length === 0) {
      return res.status(400).json({ success: false, message: "No rooms available in the system." });
    }

    // Check for overlapping ACTIVE exams and mark those rooms as occupied
    const examStart = new Date(exam.startTime);
    const examEnd = new Date(exam.endTime);

    const overlappingActiveAssignments = await prisma.roomAssignment.findMany({
      where: {
        status: "ACTIVE",
        exam: {
          startTime: { lt: examEnd },
          endTime: { gt: examStart },
        },
      },
      include: { room: true },
    });

    const occupiedRoomIds = overlappingActiveAssignments.map(a => a.roomId);
    const availableRooms = rooms.filter(r => !occupiedRoomIds.includes(r.id));

    // 🛑 2. If all rooms are occupied, show message
    if (availableRooms.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No available rooms for this exam.",
      });
    }

    // ✅ Prepare data for Python algorithm
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
      rooms: availableRooms.map((room) => ({
        id: room.id,
        roomNumber: room.roomNumber,
        benches: room.benches.map((bench) => ({
          id: bench.id,
          capacity: bench.capacity,
        })),
      })),
    };

    const pythonCmd = getPythonCommand();
    const pythonProcess = spawn(pythonCmd, [path.join("algorithm", "roomAssignment_algorithm.py")]);

    let result = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => (result += data.toString()));
    pythonProcess.stderr.on("data", (data) => (errorOutput += data.toString()));

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
        if (!Array.isArray(assignments)) throw new Error("Invalid script output");
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: "Error parsing Python output",
          error: err.message,
        });
      }

      if (assignments.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No available rooms for this exam.",
        });
      }

      // Final safety check for conflicts
      const conflictingRooms = [];
      for (const a of assignments) {
        const conflict = await prisma.roomAssignment.findFirst({
          where: {
            roomId: Number(a.roomId),
            status: "ACTIVE",
            exam: {
              startTime: { lt: examEnd },
              endTime: { gt: examStart },
            },
          },
          include: { room: true },
        });

        if (conflict) conflictingRooms.push(conflict.room.roomNumber);
      }

      if (conflictingRooms.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Room(s) ${conflictingRooms.join(", ")} already assigned for another exam at this time.`,
        });
      }

      // Save new assignments
      const savedAssignments = [];
      for (const a of assignments) {
        const saved = await prisma.roomAssignment.create({
          data: {
            examId: Number(a.examId),
            roomId: Number(a.roomId),
            status: "ACTIVE",
            assignedAt: new Date(a.assignedAt),
            completedAt: a.completedAt ? new Date(a.completedAt) : null,
          },
        });
        savedAssignments.push(saved);
      }

      return res.status(200).json({
        success: true,
        message: "Room assignments completed successfully",
        assignments: savedAssignments,
      });
    });
  } catch (error) {
    console.error("Room assignment error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while generating assignments",
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
          include: {
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

    const formatted = assignments.map((a) => {
      const benches = a.room?.benches || [];
      const flattenedInvigilatorAssignments = (a.invigilatorAssignments || []).flatMap((ia) =>
        (ia.invigilators || []).map((joinRow) => {
          return {
            id: ia.id,
            status: ia.status,
            assignedAt: ia.assignedAt,
            completedAt: ia.completedAt,
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

    const assignmentIds = assignments.map(a => a.id);

    const invAssignments = await prisma.invigilatorAssignment.findMany({
      where: { roomAssignmentId: { in: assignmentIds } },
      include: {
        invigilators: {
          include: { invigilator: { include: { user: true } } },
        },
      },
    });

    const invMap = {};
    invAssignments.forEach(inv => {
      invMap[inv.roomAssignmentId] = (inv.invigilators || []).map(i => ({
        id: inv.id,
        status: inv.status,
        assignedAt: inv.assignedAt,
        completedAt: inv.completedAt,
        invigilator: i.invigilator ? {
          id: i.invigilator.id,
          phone: i.invigilator.phone,
          course: i.invigilator.course,
          user: i.invigilator.user ? {
            id: i.invigilator.user.id,
            name: i.invigilator.user.name,
            email: i.invigilator.user.email
          } : null
        } : null
      }));
    });

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

export const getInvigilatorRoomAssignments = async (req, res) => {
  try {
    const userId = req.user?.id; 

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const invigilator = await prisma.invigilator.findUnique({
      where: { userId },
    });

    if (!invigilator) {
      return res
        .status(404)
        .json({ success: false, message: "Invigilator not found" });
    }

    const invigilatorId = invigilator.id;

    const assignments = await prisma.roomAssignment.findMany({
      where: {
        invigilatorAssignments: {
          some: {
            invigilators: {
              some: { invigilatorId },
            },
          },
        },
      },
      select: {
        id: true,
        examId: true, 
        status: true,
        room: {
          select: {
            roomNumber: true,
            block: true,
            floor: true,
          },
        },
        exam: {
          select: {
            date: true, 
            subject: {
              select: {
                subjectName: true,
              },
            },
          },
        },
      },
      orderBy: [{ examId: "asc" }, { roomId: "asc" }],
    });

    const formatted = assignments.map((a) => ({
      id: a.id,
      examId: a.examId, 
      roomNumber: a.room?.roomNumber || "N/A",
      block: a.room?.block || "N/A",
      floor: a.room?.floor || "N/A",
      subject: a.exam?.subject?.subjectName || "N/A",
      examDate: a.exam?.date ? new Date(a.exam.date).toLocaleDateString() : "N/A",
      assignmentStatus: a.status || "N/A",
    }));

    return res.json({
      success: true,
      message: "Room assignments fetched successfully",
      assignments: formatted,
    });
  } catch (error) {
    console.error("Invigilator fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch assignments",
      error: error.message,
    });
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
