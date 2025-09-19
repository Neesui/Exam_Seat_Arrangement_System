import express from "express";
import {
  addInvigilatorController,
  getAllInvigilator,
  getProfile,
  updateProfile,
  getInvigilatorExamMetaSummary,
  getInvigilatorById,
} from "../controllers/invigilatorController.js";

import {
  runAndSaveInvigilatorAssignments,
  getAllInvigilatorAssignments,
  getInvigilatorAssignmentsByRoom,
  updateInvigilatorAssignmentStatus,
  getFilteredInvigilatorAssignments,
  deleteInvigilatorAssignment,
} from "../controllers/invigilatorAssignmentControllers.js";

import { authenticate } from "../middlewares/authenticate.js";
import { roleCheck } from "../middlewares/authorize.js";
import upload from "../middlewares/uploadImages.js";

const router = express.Router();

//  Admin routes
router.post("/add",authenticate,roleCheck(["ADMIN"]), upload.single("image"), addInvigilatorController);
router.get("/all", authenticate, roleCheck(["ADMIN"]), getAllInvigilator);
router.get("/:id", authenticate, roleCheck(["ADMIN"]), getInvigilatorById);
router.post("/generate", authenticate, roleCheck(["ADMIN"]), runAndSaveInvigilatorAssignments);
router.put("/assignments/:id", authenticate, roleCheck(["ADMIN"]), updateInvigilatorAssignmentStatus);
router.delete("/delete/:id", authenticate, roleCheck(["ADMIN"]), deleteInvigilatorAssignment);


// Invigilator-only routes
router.get("/profile", authenticate, roleCheck(["INVIGILATOR"]), getProfile);
router.put("/update-profile", authenticate, roleCheck(["INVIGILATOR"]), updateProfile);
router.get("/meta-summary", authenticate, roleCheck(["INVIGILATOR"]), getInvigilatorExamMetaSummary);

// Shared by ADMIN & INVIGILATOR
router.get("/assignments/all", authenticate, roleCheck(["ADMIN", "INVIGILATOR"]), getAllInvigilatorAssignments);
router.get("/room/:roomAssignmentId", authenticate, roleCheck("ADMIN", "INVIGILATOR"), getInvigilatorAssignmentsByRoom);
router.get("/assignments/current", authenticate, roleCheck(["ADMIN", "INVIGILATOR"]), getFilteredInvigilatorAssignments);

export default router;
