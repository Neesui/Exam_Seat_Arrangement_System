import prisma from "../utils/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/emailService.js";

// Helper: generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

//login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Only Admin or Invigilator allowed
    if (!["ADMIN", "INVIGILATOR"].includes(user.role))
      return res.status(403).json({ message: "Access denied" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("jwt", token, { httpOnly: true, secure: false, sameSite: "Strict", maxAge: 24 * 60 * 60 * 1000 });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//logout
export const logout = async (req, res) => {
  res.clearCookie("jwt");
  return res.status(200).json({ success: true, message: "Logged out successfully" });
};

//forget password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !["ADMIN", "INVIGILATOR"].includes(user.role))
      return res.status(404).json({ message: "No Admin/Invigilator found with this email" });

    const resetOtp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any previous OTP for the same email & purpose
    await prisma.oTPVerification.deleteMany({ where: { email, purpose: "RESET" } });

    await prisma.oTPVerification.create({ data: { email, otp: resetOtp, purpose: "RESET", expiresAt } });

    await sendEmail(email, "Password Reset OTP", `<p>Your password reset OTP is <b>${resetOtp}</b>. It will expire in 10 minutes.</p>`);

    res.status(200).json({ message: "Password reset OTP sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "Email, OTP, and new password are required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !["ADMIN", "INVIGILATOR"].includes(user.role))
      return res.status(404).json({ message: "No Admin/Invigilator found with this email" });

    const otpRecord = await prisma.oTPVerification.findFirst({
      where: { email, otp, purpose: "RESET", expiresAt: { gt: new Date() } },
    });

    if (!otpRecord) return res.status(400).json({ message: "Invalid or expired OTP" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { email }, data: { password: hashedPassword } });

    await prisma.oTPVerification.delete({ where: { id: otpRecord.id } });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// change password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!oldPassword || !newPassword || !userId)
      return res.status(400).json({ message: "Invalid request" });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !["ADMIN", "INVIGILATOR"].includes(user.role))
      return res.status(403).json({ message: "Access denied" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
