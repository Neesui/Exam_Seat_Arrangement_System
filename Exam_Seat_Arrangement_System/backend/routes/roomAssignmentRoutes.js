import express from "express";

import { authenticate } from "../middlewares/authenticate.js";
import { roleCheck } from "../middlewares/authorize.js";
import { assignRoomToExam, deleteRoomAssignment, getRoomAssignmentsByExam, runAndSaveRoomAssignments, updateRoomAssignment } from "../controllers/roomAssignmentControllers.js";

const router = express.Router();

router.post("/add", authenticate, roleCheck(["ADMIN"]), assignRoomToExam);
router.get("/all/:examId", authenticate, roleCheck(["ADMIN", "INVIGILATOR"]), getRoomAssignmentsByExam );
router.put("/:id", authenticate, roleCheck(["ADMIN"]), updateRoomAssignment );
router.delete("/:id", authenticate, roleCheck(["ADMIN"]), deleteRoomAssignment );

router.post("/generate", authenticate, roleCheck(["ADMIN"]), runAndSaveRoomAssignments);






export default router;
