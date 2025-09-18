import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { roleCheck } from "../middlewares/authorize.js";
import {
  generateSeatingPlan,
  getAllSeatingPlan,
  getActiveSeatingPlan,
  getStudentActiveSeating
} from "../controllers/seatControllers.js";

const router = express.Router();

router.post("/generate/:examId", authenticate, roleCheck(["ADMIN"]), generateSeatingPlan);

router.get("/all", authenticate, roleCheck(["ADMIN", "INVIGILATOR"]), getAllSeatingPlan);
router.get("/active", authenticate, roleCheck(["ADMIN", "INVIGILATOR"]), getActiveSeatingPlan);

router.get("/student/active", getStudentActiveSeating);

export default router;
