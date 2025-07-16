import express from "express";
import { generateSeatingPlan } from "../controllers/seatControllers.js";

const router = express.Router();

// Generate seating plan for a given exam
router.post("/generate/:examId", generateSeatingPlan);

export default router;
