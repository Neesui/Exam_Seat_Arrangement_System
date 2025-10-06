import bcrypt from "bcrypt";
import prisma from "../utils/db.js";

// Add Invigilator (with image upload support)
export const addInvigilatorController = async (req, res) => {
  try {
    const { name, email, password, course, phone, address, gender } = req.body;

    // Check if email exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Image path if uploaded
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Create user and invigilator
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "INVIGILATOR",
        invigilator: {
          create: {
            course,
            phone,
            address,
            gender,
            imageUrl: imagePath,
          },
        },
      },
      include: { invigilator: true },
    });

    res.status(201).json({
      success: true,
      message: "Invigilator added successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        invigilator: newUser.invigilator,
      },
    });

  } catch (error) {
    console.error("Error adding invigilator:", error);
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

// Get all invigilators
export const getAllInvigilator = async (req, res) => {
  try {
    const invigilators = await prisma.user.findMany({
      where: { role: "INVIGILATOR" },
      include: { 
        invigilator: {
          include: {
            assignments: {
              include: {
                invigilatorAssignment: true, // include assignment info
              },
              where: { invigilatorAssignment: { status: "ASSIGNED" } },
              orderBy: { invigilatorAssignment: { assignedAt: "desc" } },
              take: 1, // only latest assignment
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = invigilators.map((user) => {
      const assignment = user.invigilator?.assignments[0]?.invigilatorAssignment;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        course: user.invigilator?.course || '',
        phone: user.invigilator?.phone || '',
        address: user.invigilator?.address || '',
        gender: user.invigilator?.gender || '',
        image: user.invigilator?.imageUrl
          ? `${process.env.BASE_URL || "http://localhost:3000"}${user.invigilator.imageUrl}`
          : null,
        assignedStatus: assignment ? assignment.status : "NOT ASSIGNED",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });

    res.json({
      success: true,
      message: "All invigilators fetched successfully",
      invigilators: formatted,
    });

  } catch (error) {
    console.error("Error fetching invigilators:", error);
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};



// Get single invigilator by user id
export const getInvigilatorById = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: "Invalid invigilator ID" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { invigilator: true },
    });

    if (!user || user.role !== "INVIGILATOR") {
      return res.status(404).json({ success: false, message: "Invigilator not found" });
    }

    const result = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      course: user.invigilator?.course || '',
      phone: user.invigilator?.phone || '',
      address: user.invigilator?.address || '',
      gender: user.invigilator?.gender || '',
      image: user.invigilator?.imageUrl
        ? `${process.env.BASE_URL || "http://localhost:3000"}${user.invigilator.imageUrl}`
        : null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json({
      success: true,
      message: "Invigilator fetched successfully",
      invigilator: result,
    });
  } catch (error) {
    console.error("Error fetching invigilator by ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get profile of logged-in invigilator
export const getProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { invigilator: true },
    });

    res.json({
      success: true,
      message: "Invigilator profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};

// Update invigilator profile
export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, email, password, course, phone, address, gender } = req.body;

  try {
    const userData = {};
    if (name) userData.name = name;
    if (email) userData.email = email;
    if (password) {
      userData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(userData).length > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: userData,
      });
    }

    const invigData = { course, phone, address, gender };
    Object.keys(invigData).forEach((key) => invigData[key] === undefined && delete invigData[key]);

    if (Object.keys(invigData).length > 0) {
      await prisma.invigilator.update({
        where: { userId },
        data: invigData,
      });
    }

    res.json({ success: true, message: "Profile updated successfully" });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};
