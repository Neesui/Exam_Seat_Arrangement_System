import express from "express";
import {
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/authControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { roleCheck } from "../middlewares/authorize.js";

const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes (Admin/Invigilator only)
router.post("/change-password", authenticate, roleCheck(["ADMIN", "INVIGILATOR"]), changePassword);

export default router;
