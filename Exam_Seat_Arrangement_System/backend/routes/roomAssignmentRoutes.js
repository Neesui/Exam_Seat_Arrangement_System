import express from "express";
import {
  runAndSaveRoomAssignments,
  getAllRoomAssignments,
  getRoomAssignmentsByExam,
  updateRoomAssignment,
  deleteRoomAssignment,
} from "../controllers/roomAssignmentControllers.js";

import { authenticate } from "../middlewares/authenticate.js";
import { roleCheck } from "../middlewares/authorize.js";

const router = express.Router();

router.post("/generate", authenticate, roleCheck(["ADMIN"]), runAndSaveRoomAssignments);
router.get("/all", authenticate, roleCheck(["ADMIN", "INVIGILATOR"]), getAllRoomAssignments);
router.get("/all/:examId", authenticate, roleCheck(["ADMIN", "INVIGILATOR"]), getRoomAssignmentsByExam);
router.put("/:id", authenticate, roleCheck(["ADMIN"]), updateRoomAssignment);
router.delete("/:id", authenticate, roleCheck(["ADMIN"]), deleteRoomAssignment);

export default router;
