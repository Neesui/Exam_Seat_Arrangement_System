import prisma from "../utils/db.js"; 

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkUser = await prisma.user.findFirst({
      where: { email, password }, // 
    });

    if (!checkUser) {
      return res.status(400).json({
        success: false,
        message: "User not found or incorrect password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: checkUser,
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
