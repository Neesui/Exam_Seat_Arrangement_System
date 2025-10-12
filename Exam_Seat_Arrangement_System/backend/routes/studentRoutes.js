import express from "express";
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  importStudents,
  getStudentsByCollege,
} from "../controllers/studentControllers.js";

import { authenticate } from "../middlewares/authenticate.js";
import { roleCheck } from "../middlewares/authorize.js";
import { uploadFile } from "../middlewares/uploadFiles.js";

const router = express.Router();

router.post("/add", authenticate, roleCheck(["ADMIN"]), createStudent);
router.get("/all", authenticate, roleCheck(["ADMIN"]), getStudents);
router.get("/:id", authenticate, roleCheck(["ADMIN"]), getStudentById);
router.put("/:id", authenticate, roleCheck(["ADMIN"]), updateStudent);
router.delete("/:id", authenticate, roleCheck(["ADMIN"]), deleteStudent);

router.post("/import", authenticate, roleCheck(["ADMIN"]), uploadFile.single("file"), importStudents);

export default router;
