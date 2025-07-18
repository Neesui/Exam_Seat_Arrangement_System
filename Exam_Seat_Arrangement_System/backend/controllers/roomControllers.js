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
// Get all Rooms with total capacity from benches
export const getRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      include: { benches: true },
    });

    const roomsWithCapacity = rooms.map((room) => {
      const totalCapacity = room.benches.reduce((sum, bench) => sum + bench.capacity, 0);

      return {
        id: room.id,
        roomNumber: room.roomNumber,
        block: room.block,
        floor: room.floor,
        benches: room.benches,
        capacity: totalCapacity, 
      };
    });

    res.json({
      success: true,
      message: "Rooms retrieved successfully",
      rooms: roomsWithCapacity,
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

  // Delete Room
export const deleteRoom = async (req, res) => {
    try {
      const id = parseInt(req.params.id);
  
      await prisma.room.delete({ where: { id } });
  
      res.json({
        success: true,
        message: "Room deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete room",
        error: error.message,
      });
    }
  };