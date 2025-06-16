import express from "express";
import { addInvigilator } from "../controllers/invigilatorController.js";

const router = express.Router();

router.post("/register", addInvigilator);

export default router;
