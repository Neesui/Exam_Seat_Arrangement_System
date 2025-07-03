import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorizeRoles } from "../middlewares/authorize.js";
import { addSemester, deleteSemester, getSemesters, updateSemester } from "../controllers/semesterControllers.js";
const router = express.Router();

router.post("/add", authenticate, authorizeRoles("ADMIN"), addSemester);
router.get("/all", authenticate, authorizeRoles("ADMIN"), getSemesters);
router.put("/:id", authenticate, authorizeRoles("ADMIN"), updateSemester);
router.delete("/:id", authenticate, authorizeRoles("ADMIN"), deleteSemester);



export default router;