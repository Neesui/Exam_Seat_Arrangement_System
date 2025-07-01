import express from 'express'
import { addCourse, getCourses } from '../controllers/courseControllers';
import { authenticate } from "../middlewares/authenticate.js";
import { authorizeRoles } from "../middlewares/authorize.js";

const router = express.Router();
router.post("/add", authenticate, authorizeRoles("ADMIN") , addCourse)
router.post("/all", authenticate, authorizeRoles("ADMIN", getCourses)) 