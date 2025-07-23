import express from "express";
import {
  addInvigilatorController,
  getAllInvigilator,
  getProfile,
  updateProfile,
  getInvigilatorExamMetaSummary,
} from "../controllers/invigilatorController.js";

import {
  runAndSaveInvigilatorAssignments,
  getAllInvigilatorAssignments,
  getInvigilatorAssignmentsByRoom,
} from "../controllers/invigilatorAssignmentControllers.js";

import { authenticate } from "../middlewares/authenticate.js";
import { roleCheck } from "../middlewares/authorize.js";

const router = express.Router();

//  Admin routes
router.post("/add", authenticate, roleCheck(["ADMIN"]), addInvigilatorController);
router.get("/all", authenticate, roleCheck(["ADMIN"]), getAllInvigilator);
router.post("/generate", authenticate, roleCheck(["ADMIN"]), runAndSaveInvigilatorAssignments);

// Invigilator-only routes
router.get("/profile", authenticate, roleCheck(["INVIGILATOR"]), getProfile);
router.put("/update-profile", authenticate, roleCheck(["INVIGILATOR"]), updateProfile);
router.get("/meta-summary", authenticate, roleCheck(["INVIGILATOR"]), getInvigilatorExamMetaSummary);

// Shared by ADMIN & INVIGILATOR
router.get("/assignments/all", authenticate, roleCheck(["ADMIN", "INVIGILATOR"]), getAllInvigilatorAssignments);
router.get("/room/:roomAssignmentId", authenticate, roleCheck("ADMIN"), getInvigilatorAssignmentsByRoom);

export default router;
