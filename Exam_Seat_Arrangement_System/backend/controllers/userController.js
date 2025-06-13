import prisma from "../utils/db";

export const loginController = (req, res) => {
  try {
    const { email, password } = req.body;
    const checkUser = prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!checkUser) {
      res.status(400).json({
        success: false,
        message: "üser not found",
      });
    }
  } catch (error) {}
};
