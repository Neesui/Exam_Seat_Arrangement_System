import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { roleCheck } from "../middlewares/authorize.js";
import {
  generateSeatingPlan,
  getAllSeatingPlan,
  getActiveSeatingPlan,
  getStudentSeating,
  getInvigilatorSeatingPlans
} from "../controllers/seatControllers.js";

const router = express.Router();

// Admin generate new seating plan
router.post("/generate/:examId", authenticate, roleCheck(["ADMIN"]), generateSeatingPlan);

// Admin/Invigilator view all seating plans
router.get("/all", authenticate, roleCheck(["ADMIN", "INVIGILATOR"]), getAllSeatingPlan);

// Admin/Invigilator view active seating plan
router.get("/active", authenticate, roleCheck(["ADMIN", "INVIGILATOR"]), getActiveSeatingPlan);

// Student find their seating info
router.post("/student/find", getStudentSeating);

// Invigilator view today's + history seating plans
router.get("/invigilator/history", authenticate, roleCheck(["INVIGILATOR"]), getInvigilatorSeatingPlans);

export default router;
