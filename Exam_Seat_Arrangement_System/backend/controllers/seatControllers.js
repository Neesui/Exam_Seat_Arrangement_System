import { PrismaClient } from "@prisma/client";
import { spawn } from "child_process";

const prisma = new PrismaClient();

export const generateSeatingPlan = async (req, res) => {
  try {
    const { examId } = req.params;
    const examIdInt = parseInt(examId);

    if (isNaN(examIdInt)) {
      return res.status(400).json({ error: "Invalid examId" });
    }

    // Step 1: Mark all previous exams inactive
    await prisma.exam.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Step 2: Mark current exam as active
    await prisma.exam.update({
      where: { id: examIdInt },
      data: { isActive: true },
    });

    // Step 3: Fetch students + rooms + benches
    const students = await prisma.student.findMany({
      where: { examId: examIdInt },
      select: { id: true, rollNumber: true, college: true },
    });

    const rooms = await prisma.room.findMany({
      include: { benches: true },
    });

    // Step 4: Run Python script
    const py = spawn("python3", ["./backend/algorithm/seating_algorithm.py"]);
    const input = JSON.stringify({ students, rooms });
    py.stdin.write(input);
    py.stdin.end();

    let output = "";
    py.stdout.on("data", (data) => {
      output += data.toString();
    });

    py.stderr.on("data", (err) => {
      console.error("Python error:", err.toString());
    });

    py.on("close", async () => {
      try {
        const seatingPlan = JSON.parse(output);

        // Step 5: Save seating plan in DB
        for (const [roomId, benches] of Object.entries(seatingPlan)) {
          for (const bench of benches) {
            for (const student of bench.students) {
              await prisma.seatingPlan.create({
                data: {
                  examId: examIdInt,
                  roomId: parseInt(roomId),
                  benchId: bench.benchId,
                  studentId: student.id,
                },
              });
            }
          }
        }

        res.json({
          message: "Seating plan generated successfully",
          seatingPlan,
        });
      } catch (err) {
        console.error("Parsing error:", err);
        res.status(500).json({ error: "Failed to process seating plan" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Seating plan generation failed" });
  }
};


export const getAllSeatingPlan = async (req, res) => {
  try {
    const seatingPlans = await prisma.seatingPlan.findMany({
      include: {
        exam: {
          include: {
            subject: {
              include: {
                semester: {
                  include: {
                    course: true,
                  },
                },
              },
            },
          },
        },
        seats: {
          include: {
            student: {
              select: {
                id: true,
                college: true,
                symbolNumber: true,
              },
            },
            bench: {
              include: {
                room: {
                  select: {
                    id: true,
                    roomNumber: true,
                    block: true,
                    floor: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    res.json({
      success: true,
      message: "Seating plans retrieved successfully",
      data: seatingPlans,
    });
  } catch (error) {
    console.error("Error fetching seating plans:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch seating plans",
      error: error.message,
    });
  }
};

export const getActiveSeatingPlan = async (req, res) => {
  try {
    const activeExam = await prisma.exam.findFirst({
      where: { isActive: true },
      orderBy: { date: "desc" }, 
    });

    if (!activeExam) {
      return res.json({
        success: true,
        message: "No active exam found",
        data: [],
      });
    }

    const seatingPlans = await prisma.seatingPlan.findMany({
      where: { examId: activeExam.id },
      include: {
        exam: {
          include: {
            subject: {
              include: {
                semester: { include: { course: true } },
              },
            },
          },
        },
        seats: {
          include: {
            student: {
              select: { id: true, college: true, symbolNumber: true },
            },
            bench: {
              include: {
                room: {
                  select: { id: true, roomNumber: true, block: true, floor: true },
                },
              },
            },
          },
        },
      },
      orderBy: { id: "desc" },
    });

    res.json({
      success: true,
      message: "Active seating plan retrieved successfully",
      data: seatingPlans,
    });
  } catch (error) {
    console.error("Error fetching active seating plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch active seating plan",
      error: error.message,
    });
  }
};

export const getStudentActiveSeating = async (req, res) => {
  const { symbolNumber, college } = req.query;

  if (!symbolNumber || !college) {
    return res.status(400).json({
      success: false,
      message: "symbolNumber and college are required",
    });
  }

  try {
    // Find active exam
    const activeExam = await prisma.exam.findFirst({
      where: { isActive: true },
      orderBy: { date: "desc" },
    });

    if (!activeExam) {
      return res.json({
        success: true,
        message: "No active exam found",
        data: [],
      });
    }

    // Find seating for the student
    const seating = await prisma.seat.findMany({
      where: {
        seatingPlan: { examId: activeExam.id },
        student: { symbolNumber, college },
      },
      include: {
        student: { select: { id: true, symbolNumber: true, college: true } },
        bench: { include: { room: { select: { roomNumber: true, block: true, floor: true } } } },
        seatingPlan: true,
      },
    });

    if (!seating || seating.length === 0) {
      return res.json({
        success: true,
        message: "No seating assigned for this student in active exam",
        data: [],
      });
    }

    res.json({
      success: true,
      message: "Seating info retrieved successfully",
      data: seating,
    });
  } catch (err) {
    console.error("Error fetching student seating:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch seating info",
    });
  }
};

