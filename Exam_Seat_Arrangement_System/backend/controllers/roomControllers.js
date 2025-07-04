import prisma from "../utils/db.js";

// Create Room
export const createRoom = async (req, res) => {
  try {
    const { roomNumber, block, floor } = req.body;

    const room = await prisma.room.create({
      data: { roomNumber, block, floor },
    });

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create room",
      error: error.message,
    });
  }
};