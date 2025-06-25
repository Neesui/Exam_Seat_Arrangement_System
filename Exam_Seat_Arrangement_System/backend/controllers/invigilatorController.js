import bcrypt from "bcrypt";
import prisma from "../utils/db.js";

/**
 * Admin-only: Add a new invigilator (creates a user + profile)
 */
export const addInvigilatorController = async (req, res) => {
  console.log("📥 Incoming request body:", req.body);

  try {
    const { name, email, password, department, phone, address, gender } = req.body;

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    // 2. Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create the user with role INVIGILATOR and linked invigilator profile
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "INVIGILATOR",
        invigilator: {
          create: {
            department,
            phone,
            address,
            gender,
          },
        },
      },
      include: {
        invigilator: true, // include linked profile in the response
      },
    });

    // 4. Success response
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
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get profile (invigilator)
export const getProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { invigilator: true },
    });
    res.json({ 
      success: true,
      message: "Invigilator profile fetch successfully", 
      user 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};
