import express from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";
import { addSemester } from "../controllers/semesterControllers";
const router = express.Router();

router.post("/add", authenticate, authorizeRoles("ADMIN"), addSemester);

export default router;