import express from "express";
import {
  addInvigilatorController,
  getAllInvigilator,
  getProfile,
  updateProfile,
  getInvigilatorById,
} from "../controllers/invigilatorController.js";

import {
  runAndSaveInvigilatorAssignments,
  getAllInvigilatorAssignments,
  getInvigilatorAssignmentsById,
  updateInvigilatorAssignmentStatus,
  getFilteredInvigilatorAssignments,
  deleteInvigilatorAssignment,
} from "../controllers/invigilatorAssignmentControllers.js";

import { authenticate } from "../middlewares/authenticate.js";
import { roleCheck } from "../middlewares/authorize.js";
import upload from "../middlewares/uploadImages.js";

const router = express.Router();

router.get("/profile", authenticate, roleCheck(["INVIGILATOR"]), getProfile);


// Admin routes
router.post("/add", authenticate, roleCheck(["ADMIN"]), upload.single("image"), addInvigilatorController);
router.get("/all", authenticate, roleCheck(["ADMIN"]), getAllInvigilator);
router.get("/:id", authenticate, roleCheck(["ADMIN"]), getInvigilatorById);
router.post("/generate", authenticate, roleCheck(["ADMIN"]), runAndSaveInvigilatorAssignments);
router.put("/assignments/:id", authenticate, roleCheck(["ADMIN"]), updateInvigilatorAssignmentStatus);
router.delete("/delete/:id", authenticate, roleCheck(["ADMIN"]), deleteInvigilatorAssignment);

// Invigilator-only routes
router.put("/update-profile", authenticate, roleCheck(["INVIGILATOR"]), updateProfile);
// router.get("/my/assignments", authenticate, roleCheck(["INVIGILATOR"]), getMyAssignments);

// Shared routes
router.get("/assignments/all", authenticate, roleCheck(["ADMIN"]), getAllInvigilatorAssignments);
router.get("/assignments/:assignmentId", authenticate, roleCheck(["ADMIN", "INVIGILATOR"]), getInvigilatorAssignmentsById);
router.get("/assignments/current", authenticate, roleCheck(["ADMIN", "INVIGILATOR"]), getFilteredInvigilatorAssignments);

export default router;
