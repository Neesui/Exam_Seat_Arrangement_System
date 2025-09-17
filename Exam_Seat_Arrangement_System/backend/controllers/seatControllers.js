import { PrismaClient } from "@prisma/client";
import { spawn } from "child_process";

const prisma = new PrismaClient();

export const generateSeatingPlan = async (req, res) => {
  try {
    const { examId } = req.body;

    // Fetch students + rooms + benches
    const students = await prisma.student.findMany({
      where: { examId },
      select: { id: true, rollNumber: true, college: true }
    });

    const rooms = await prisma.room.findMany({
      include: { benches: true }
    });

    // Run Python script
    const py = spawn("python3", ["./backend/algorithm/room_seating_algorithm.py"]);

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
      const seatingPlan = JSON.parse(output);

      // Save seating plan in DB
      for (const [roomId, benches] of Object.entries(seatingPlan)) {
        for (const bench of benches) {
          for (const student of bench.students) {
            await prisma.seatingPlan.create({
              data: {
                examId,
                roomId: parseInt(roomId),
                benchId: bench.benchId,
                studentId: student.id
              }
            });
          }
        }
      }

      res.json({ message: "Seating plan generated successfully", seatingPlan });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Seating plan generation failed" });
  }
};
