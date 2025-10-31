import { PrismaClient } from "@prisma/client";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { startOfDay, endOfDay, addDays,isAfter  } from "date-fns";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to Python script
const PY_SCRIPT_PATH = path.resolve(__dirname, "../algorithm/seating_algorithm.py");
const pythonCmd = process.platform === "win32" ? "python" : "python3";

// Run Python script
const runPythonScript = (scriptPath, inputJson, timeoutMs = 60_000) =>
  new Promise((resolve, reject) => {
    const py = spawn(pythonCmd, [scriptPath], { stdio: ["pipe", "pipe", "pipe"] });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      py.kill();
    }, timeoutMs);

    py.stdin.write(inputJson);
    py.stdin.end();

    py.stdout.on("data", (data) => { stdout += data.toString(); });
    py.stderr.on("data", (data) => { stderr += data.toString(); });

    py.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });

    py.on("close", (code) => {
      clearTimeout(timer);
      if (timedOut) reject(new Error("Python process timed out"));
      else resolve({ stdout, stderr, code });
    });
  });

export const generateSeatingPlan = async (req, res) => {
  try {
    const { examId } = req.params;
    const examIdInt = parseInt(examId, 10);

    if (isNaN(examIdInt))
      return res.status(400).json({ success: false, message: "Invalid examId" });

    await prisma.exam.updateMany({ where: { isActive: true }, data: { isActive: false } });

    const exam = await prisma.exam.update({
      where: { id: examIdInt },
      data: { isActive: true },
      include: { subject: { include: { semester: { include: { students: true } } } } },
    });

    if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });

    const students = exam.subject.semester.students.map((s) => ({
      id: s.id,
      symbolNumber: s.symbolNumber,
      college: s.college,
      studentName: s.studentName,
    }));

    const rooms = await prisma.room.findMany({ include: { benches: true } });
    const input = JSON.stringify({ students, rooms });

    let result;
    try {
      result = await runPythonScript(PY_SCRIPT_PATH, input);
    } catch (err) {
      console.error("Failed to run Python script:", err);
      return res.status(500).json({ success: false, message: "Failed to execute seating algorithm", error: err.message });
    }

    if (result.stderr && result.stderr.trim()) {
      console.error("Python stderr:", result.stderr);
      return res.status(500).json({ success: false, message: "Seating algorithm reported an error", error: result.stderr });
    }

    const rawOutput = (result.stdout || "").trim();
    if (!rawOutput) return res.status(500).json({ success: false, message: "Seating algorithm returned no output" });

    let seatingPlanData;
    try {
      seatingPlanData = JSON.parse(rawOutput);
    } catch (err) {
      console.error("Failed to parse Python output:", err, "rawOutput:", rawOutput);
      return res.status(500).json({ success: false, message: "Failed to parse seating algorithm output", error: err.message });
    }

    const seatsToInsert = [];
    for (const [roomIdKey, benches] of Object.entries(seatingPlanData)) {
      for (const bench of benches) {
        if (!bench || !Array.isArray(bench.students)) continue;
        for (const student of bench.students) {
          if (!student?.id) continue;
          seatsToInsert.push({
            benchId: bench.benchId,
            studentId: student.id,
            seatingPlanId: 0, 
            position: student.position,
          });
        }
      }
    }

    const createdSeatingPlan = await prisma.$transaction(async (tx) => {
      const sp = await tx.seatingPlan.create({ data: { examId: examIdInt } });
      if (seatsToInsert.length > 0) {
        const seatsDataWithPlanId = seatsToInsert.map((s) => ({ ...s, seatingPlanId: sp.id }));
        await tx.seat.createMany({ data: seatsDataWithPlanId, skipDuplicates: true });
      }
      return sp;
    });

    res.json({ success: true, message: "Seating plan generated successfully", seatingPlanId: createdSeatingPlan.id });
  } catch (error) {
    console.error("generateSeatingPlan error:", error);
    res.status(500).json({ success: false, message: "Seating plan generation failed", error: error.message });
  }
};

export const getActiveSeatingPlan = async (req, res) => {
  try {
    const today = new Date();
    const tomorrow = addDays(today, 1);

    // Fetch all active seating plans
    const seatingPlans = await prisma.seatingPlan.findMany({
      where: {
        exam: { date: { gte: startOfDay(today), lte: endOfDay(tomorrow) } },
      },
      include: {
        exam: { include: { subject: { include: { semester: { include: { course: true } } } } } },
        seats: {
          include: {
            student: { select: { id: true, symbolNumber: true, college: true, studentName: true } },
            bench: { include: { room: { select: { id: true, roomNumber: true, block: true, floor: true } } } },
          },
        },
      },
      orderBy: { id: "desc" },
    });

    if (!seatingPlans || seatingPlans.length === 0)
      return res.json({ success: true, message: "No active exam found", data: [] });

    // Fetch all benches (so we can include empty ones)
    const allBenches = await prisma.bench.findMany({
      include: {
        room: { select: { id: true, roomNumber: true, block: true, floor: true } },
      },
    });

    // Map each seating plan to include all benches
    const seatingPlansWithAllBenches = seatingPlans.map(plan => {
      // Bench IDs that already have seats
      const benchIdsWithSeats = plan.seats.map(seat => seat.benchId);

      // Find benches with no seats assigned
      const emptyBenches = allBenches
        .filter(b => !benchIdsWithSeats.includes(b.id))
        .map(b => ({ bench: b, student: null })); // student is null for empty benches

      return {
        ...plan,
        seats: [...plan.seats, ...emptyBenches], // combine assigned and empty benches
      };
    });

    res.json({
      success: true,
      message: "Active seating plan retrieved with all benches",
      data: seatingPlansWithAllBenches,
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



export const getStudentSeating = async (req, res) => {
  let { symbolNumber, college } = req.body;

  if (!symbolNumber || !college) {
    return res.status(400).json({
      success: false,
      message: "symbolNumber and college are required",
    });
  }

  symbolNumber = symbolNumber.trim();
  college = college.trim();

  try {
    const today = new Date();

    const allStudentSeats = await prisma.seat.findMany({
      where: {
        student: {
          symbolNumber,
          college: { equals: college, mode: "insensitive" },
        },
        seatingPlan: {
          exam: {
            date: { gte: today },
          },
        },
      },
      include: {
        student: true,
        bench: {
          include: {
            room: {
              include: {
                benches: true, 
              },
            },
          },
        },
        seatingPlan: {
          include: {
            exam: {
              include: {
                subject: { include: { semester: { include: { course: true } } } },
              },
            },
          },
        },
      },
      orderBy: {
        seatingPlan: { exam: { date: "asc" } },
      },
    });

    if (!allStudentSeats.length) {
      return res.json({
        success: true,
        message: "No upcoming exam seat plan found",
        data: [],
      });
    }

    const roomsMap = new Map();

    for (const seat of allStudentSeats) {
      const roomId = seat.bench.room.id;
      const examId = seat.seatingPlan.exam.id;
      const key = `${examId}-${roomId}`;

      if (!roomsMap.has(key)) {
        roomsMap.set(key, {
          exam: seat.seatingPlan.exam,
          room: {
            ...seat.bench.room,
            benches: seat.bench.room.benches.map((b) => ({
              id: b.id,
              benchNo: b.benchNo,
              row: b.row,
              column: b.column,
              capacity: b.capacity,
            })),
          },
          seats: [],
        });
      }

      roomsMap.get(key).seats.push({
        id: seat.id,
        benchId: seat.benchId,
        position: seat.position,
        student: seat.student,
        bench: seat.bench,
      });
    }

    const roomPlans = Array.from(roomsMap.values());

    return res.json({
      success: true,
      message: "Upcoming student seating info retrieved successfully",
      data: roomPlans,
    });
  } catch (error) {
    console.error("Error fetching student seating:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch seating info",
      error: error.message,
    });
  }
};


export const getAllSeatingPlan = async (req, res) => { 
  try { const seatingPlans = await prisma.seatingPlan.findMany({ 
    include: { 
      exam: { 
        include: { 
          subject: { 
            include: { 
              semester: { 
                include: { 
                  course: true } } } } } }, 
                  seats: { 
                    include: { 
                      student: { 
                        select: { id: true, symbolNumber: true, college: true, studentName: true } }, 
                        bench: { include: { room: { select: { id: true, roomNumber: true, block: true, floor: true } } } }, }, }, }, 
                        orderBy: { id: "desc" }, }); 
                        res.json({ success: true, 
                          message: "Seating plans retrieved successfully", 
                          data: seatingPlans }); } 
                        catch (error) { console.error("Error fetching seating plans:", error); 
                          res.status(500).json({ success: false, 
                            message: "Failed to fetch seating plans", 
                            error: error.message }); 
                    }
   };


export const getInvigilatorSeatingPlans = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const seatingPlans = await prisma.seatingPlan.findMany({
      include: {
        exam: { include: { subject: { include: { semester: { include: { course: true } } } } } },
        seats: {
          include: {
            student: { select: { id: true, symbolNumber: true, college: true, studentName: true } },
            bench: { include: { room: { select: { id: true, roomNumber: true, block: true, floor: true } } } },
          },
        },
      },
      orderBy: { id: "desc" },
    });

    const processed = seatingPlans.map((sp) => {
      const examDate = new Date(sp.exam.date);
      examDate.setHours(0, 0, 0, 0);
      return { ...sp, isHistory: examDate < today };
    });

    res.json({ success: true, message: "Invigilator seating plans retrieved", data: processed });
  } catch (err) {
    console.error("Error fetching invigilator seating plans:", err);
    res.status(500).json({ success: false, message: "Failed to fetch invigilator seating plans", error: err.message });
  }
};