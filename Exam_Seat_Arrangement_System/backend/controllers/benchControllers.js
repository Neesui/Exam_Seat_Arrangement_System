import prisma from "../utils/db.js";

export const createBench = async (req, res) => {
  try {
    const { roomId, benchNo, row, column, capacity } = req.body;

    const bench = await prisma.bench.create({
      data: {
        roomId: Number(roomId),
        benchNo: Number(benchNo),
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
    res.status(500).json({ success: false, message: "Failed to create bench", error: error.message });
  }
};

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

export const updateBench = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { roomId, benchNo, row, column, capacity } = req.body;

    const bench = await prisma.bench.update({
      where: { id },
      data: {
        roomId: Number(roomId),
        benchNo: Number(benchNo),
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
