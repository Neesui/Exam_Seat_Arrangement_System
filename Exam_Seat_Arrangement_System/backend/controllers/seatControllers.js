import prisma from "../utils/db.js";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// For __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateSeatingPlan = async (req, res) => {
  const { examId } = req.params;

  try {
    const exam = await prisma.exam.findUnique({
      where: { id: Number(examId) },
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
    });

    if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });

    const students = await prisma.student.findMany({
      where: {
        courseId: exam.subject.semester.courseId,
        semesterId: exam.subject.semesterId,
      },
    });

    const roomAssignments = await prisma.roomAssignment.findMany({
      where: { examId: Number(examId) },
      include: {
        room: {
          include: {
            benches: true,
          },
        },
      },
    });

    const inputPayload = {
      examId: exam.id,
      students,
      roomAssignments,
    };

    const pythonPath = path.join(__dirname, "../algorithm/seating_algorithm.py");
    const python = spawn("python", [pythonPath]);

    let result = "";

    python.stdin.write(JSON.stringify(inputPayload));
    python.stdin.end();

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error("Python error:", data.toString());
    });

    python.on("close", async () => {
      try {
        const parsedSeats = JSON.parse(result);

        const seatingPlan = await prisma.seatingPlan.create({
          data: {
            examId: Number(examId),
            isActive: true,
          },
        });

        const seatsData = parsedSeats.map((seat) => ({
          studentId: seat.studentId,
          benchId: seat.benchId,
          position: seat.position,
          seatingPlanId: seatingPlan.id,
        }));

        await prisma.seat.createMany({ data: seatsData });

        res.json({
          success: true,
          message: "Seating plan generated successfully",
          seatingPlanId: seatingPlan.id,
        });
      } catch (err) {
        console.error("Seating Plan Error:", err);
        res.status(500).json({ success: false, message: "Failed to generate seating plan" });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all seating plans
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
            student: true,
            bench: {
              include: {
                room: true,
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
