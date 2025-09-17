import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { roleCheck } from "../middlewares/authorize.js";
import { generateSeatingPlan, getAllSeatingPlan } from "../controllers/seatControllers.js";

const router = express.Router();

// Generate seating plan for a given exam
router.post("/generate/:examId", authenticate, roleCheck(['ADMIN']), generateSeatingPlan);
router.get('/all', authenticate, roleCheck(['ADMIN']), getAllSeatingPlan);


export default router;
