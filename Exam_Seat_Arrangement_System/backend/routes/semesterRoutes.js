import express from "express";
import {
  addSemesterWithSubjects,
  getSemesters,
  getSemesterById,
  updateSemester,
  deleteSemester
} from "../controllers/semesterControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { roleCheck } from "../middlewares/authorize.js";

const router = express.Router();

router.post("/add-with-subjects", authenticate, roleCheck(["ADMIN"]), addSemesterWithSubjects);
router.get("/all", authenticate, roleCheck(["ADMIN"]), getSemesters);
router.get("/:id", authenticate, roleCheck(["ADMIN"]), getSemesterById);
router.put("/:id", authenticate, roleCheck(["ADMIN"]), updateSemester);
router.delete("/:id", authenticate, roleCheck(["ADMIN"]), deleteSemester);

export default router;
