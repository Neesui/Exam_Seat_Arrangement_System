import prisma from "../utils/db.js";

export const createBench = async (req, res) => {
  try {
    const { roomId, row, column, capacity } = req.body;

    const existingBench = await prisma.bench.findUnique({
      where: {
        roomId_row_column: { roomId: Number(roomId), row: Number(row), column: Number(column) },
      },
    });

    if (existingBench) {
      return res.status(400).json({
        success: false,
        message: "A bench already exists at this row and column in the room.",
      });
    }

    const lastBench = await prisma.bench.findFirst({
      where: { roomId: Number(roomId) },
      orderBy: { benchNo: "desc" },
    });

    const nextBenchNo = lastBench ? lastBench.benchNo + 1 : 1;

    const bench = await prisma.bench.create({
      data: {
        roomId: Number(roomId),
        benchNo: nextBenchNo,
        row: Number(row),
        column: Number(column),
        capacity: Number(capacity),
      },
    });

    res.status(201).json({
      success: true,
      message: "Bench created successfully",
      bench,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create bench",
      error: error.message,
    });
  }
};

// Get all benches
export const getBenches = async (req, res) => {
  try {
    const benches = await prisma.bench.findMany({
      include: { room: true },
      orderBy: [{ roomId: "asc" }, { row: "asc" }, { column: "asc" }],
    });

    res.json({
      success: true,
      message: "Benches retrieved successfully",
      benches,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch benches", error: error.message });
  }
};

// Get bench by ID
export const getBenchById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const bench = await prisma.bench.findUnique({
      where: { id },
      include: { room: true, seats: true },
    });

    if (!bench) {
      return res.status(404).json({ success: false, message: "Bench not found" });
    }

    res.json({
      success: true,
      message: "Bench retrieved successfully",
      bench,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch bench", error: error.message });
  }
};

// Get benches by roomId
export const getBenchesByRoom = async (req, res) => {
  try {
    const roomId = parseInt(req.params.roomId);

    const benches = await prisma.bench.findMany({
      where: { roomId },
      orderBy: [{ row: "asc" }, { column: "asc" }],
      select: {
        id: true,
        benchNo: true,
        row: true,
        column: true,
        capacity: true,
      },
    });

    res.json({
      success: true,
      message: `Benches for room ${roomId} retrieved successfully`,
      benches,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch benches by room", error: error.message });
  }
};

// Update bench 
export const updateBench = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { row, column, capacity } = req.body;

    const bench = await prisma.bench.update({
      where: { id },
      data: {
        row: Number(row),
        column: Number(column),
        capacity: Number(capacity),
      },
    });

    res.json({
      success: true,
      message: "Bench updated successfully",
      bench,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update bench", error: error.message });
  }
};

// Delete bench
export const deleteBench = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.bench.delete({ where: { id } });

    res.json({
      success: true,
      message: "Bench deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete bench", error: error.message });
  }
};
