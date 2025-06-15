import jwt from "jsonwebtoken";
import prisma from "../utils/db.js";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 2. Validate user
    if (!user || user.password !== password) {
      return res.status(400).json({
        success: false,
        message: "User not found or incorrect password",
      });
    }

    // 3. Check role
    if (user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: "Only admins can login here",
      });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );

    // 5. Return token and user info
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
