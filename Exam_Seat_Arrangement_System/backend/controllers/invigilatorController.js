import prisma from "../utils/db.js";

export const addInvigilator = async (req, res) => {
  try {
    const { name, email, password, department, phone, address, gender } = req.body;

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // 2. Create user with role INVIGILATOR
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: "INVIGILATOR", // Make sure this matches your enum
      },
    });

    // 3. Create invigilator profile and link to user
    const newInvigilator = await prisma.invigilator.create({
      data: {
        department,
        phone,
        address,
        gender,
        userId: newUser.id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Invigilator registered successfully",
      user: newUser,
      invigilator: newInvigilator,
    });

  } catch (error) {
    console.error("Register Invigilator Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
