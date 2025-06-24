import bcrypt from "bcrypt";
import prisma from "../utils/db.js";
import jwt from "jsonwebtoken";

//admin login
export const loginController = async (req, res) => {
  try {
    // 1. Get email and password from request body
    const { email, password } = req.body;
    // 2.  user lai find garxa database ma by using email
    const user = await prisma.user.findUnique({ where: { email } });
    // 3. user vetena vane, return error garxa
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    // 4. Compare input password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Incorrect password" });
    }
    // 5. Check if the user is an admin (role check garxa)
    if (user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Only admins can login here" });
    }
    // 6. If login is valid, create JWT token with user info (id, email, role)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET, // yesle Secret key stored .env ma garxa
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    // 7. Send token as HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // 8. Remove password from the user object before sending response
    const { password: _, ...userWithoutPassword } = user;

    // 9. Send success response with user data (without password)
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (error) {
    // Catch any server errors
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//Admin logout (Clears the token cookie)
export const logoutController = (req, res) => {
  // Deletes the token from cookies
  res.clearCookie("token"); 
  res.status(200).json({ success: true, message: "Logged out successfully" });
};