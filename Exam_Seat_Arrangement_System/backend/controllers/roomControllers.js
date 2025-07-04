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

// Get all Rooms
export const getRooms = async (req, res) => {
    try {
      const rooms = await prisma.room.findMany({
        include: { benches: true },
      });
  
      res.json({
        success: true,
        message: "Rooms retrieved successfully",
        rooms,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch rooms",
        error: error.message,
      });
    }
  };

  // Get Room by ID
export const getRoomById = async (req, res) => {
    try {
      const id = parseInt(req.params.id);
  
      const room = await prisma.room.findUnique({
        where: { id },
        include: { benches: true },
      });
  
      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found",
        });
      }
  
      res.json({
        success: true,
        message: "Room retrieved successfully",
        room,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch room",
        error: error.message,
      });
    }
  };

  // Update Room
export const updateRoom = async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { roomNumber, block, floor } = req.body;
  
      const room = await prisma.room.update({
        where: { id },
        data: { roomNumber, block, floor },
      });
  
      res.json({
        success: true,
        message: "Room updated successfully",
        room,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update room",
        error: error.message,
      });
    }
  };