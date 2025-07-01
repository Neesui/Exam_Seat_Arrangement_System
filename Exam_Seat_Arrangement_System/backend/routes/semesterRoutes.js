import express from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";
import { addSemester, updateSemester } from "../controllers/semesterControllers";
const router = express.Router();

router.post("/add", authenticate, authorizeRoles("ADMIN"), addSemester);
router.get("/all", authenticate, authorizeRoles("ADMIN"), getSelection);
router.update("/:id", authenticate, authorizeRoles("ADMIN"), updateSemester);


export default router;