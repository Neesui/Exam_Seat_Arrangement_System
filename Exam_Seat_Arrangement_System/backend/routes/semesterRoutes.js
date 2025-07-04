import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { roleCheck } from "../middlewares/authorize.js";
import { addSemester, deleteSemester, getSemesters, updateSemester } from "../controllers/semesterControllers.js";
const router = express.Router();

router.post("/add", authenticate, roleCheck(["ADMIN"]), addSemester);
router.get("/all", authenticate, roleCheck(["ADMIN"]), getSemesters);
router.put("/:id", authenticate, roleCheck(["ADMIN"]), updateSemester);
router.delete("/:id", authenticate, roleCheck(["ADMIN"]), deleteSemester);



export default router;