import prisma from "../utils/db.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const login = async (req, res) => {
  try {
      const { name, email, password } = req.body;

      // Find user by name or email
      const user = await prisma.user.findFirst({
          where: {
              OR: [
                  { name: name },
                  { email: email }
              ]
          }
      });

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: "Invalid password" });
      }

      // Create JWT
      const token = jwt.sign(
          {
              id: user.id,
              role: user.role,
          },
          process.env.JWT_SECRET,
          {
              expiresIn: process.env.JWT_EXPIRY || '1d',
          }
      );

      // Send token as cookie
      res.cookie('jwt', token, {
          httpOnly: true,
          secure: false,
          sameSite: 'Strict',
          maxAge: 24 * 60 * 60 * 1000,
      });

      // Send response
      res.status(200).json({
          message: 'Login Successful',
          token,
          user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
          },
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({
          success: false,
          message: 'Server error. Please try again.',
          error: error.message,
      });
  }
};

//logout
export const logout = async (req, res) => {
  res.clearCookie("jwt");
  return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
}