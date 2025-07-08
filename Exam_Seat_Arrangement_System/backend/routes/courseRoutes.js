import express from 'express'
import { addCourse, deleteCourse, getCourseById, getCourses, updateCourse, createCourseFull } from '../controllers/courseControllers.js';
import { authenticate } from "../middlewares/authenticate.js";
import { roleCheck } from "../middlewares/authorize.js";

const router = express.Router();
// router.post("/add", authenticate, roleCheck(["ADMIN"]) , addCourse)
router.post('/full', authenticate, roleCheck(['ADMIN']), createCourseFull);
router.get("/all", authenticate, roleCheck(["ADMIN"]), getCourses)
router.get("/:id", authenticate, roleCheck(["ADMIN"]), getCourseById)
router.put("/:id", authenticate, roleCheck(["ADMIN"]), updateCourse)
router.delete("/:id", authenticate, roleCheck(["ADMIN"]), deleteCourse)
export default router;