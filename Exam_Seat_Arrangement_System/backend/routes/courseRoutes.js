import express from 'express'
import { addCourse, getCourseById, getCourses } from '../controllers/courseControllers.js';
import { authenticate } from "../middlewares/authenticate.js";
import { authorizeRoles } from "../middlewares/authorize.js";

const router = express.Router();
router.post("/add", authenticate, authorizeRoles("ADMIN") , addCourse)
router.post("/all", authenticate, authorizeRoles("ADMIN"), getCourses)
router.get("/:id", authenticate, authorizeRoles("ADMIN"), getCourseById)
router.put("/:id", authenticate, authorizeRoles("ADMIN"), addCourse)
router.delete("/:id", authenticate, authorizeRoles("ADMIN"), addCourse)
export default router;