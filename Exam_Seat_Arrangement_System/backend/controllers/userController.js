import prisma from "../utils/db.js";

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email first
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return res.status(400).json({
        success: false,
        message: "User not found or incorrect password",
      });
    }

    if (user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: "Only admins can login here",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
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
