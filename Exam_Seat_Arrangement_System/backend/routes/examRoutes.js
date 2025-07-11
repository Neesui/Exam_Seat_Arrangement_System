import express from 'express';
import { authenticate } from "../middlewares/authenticate.js";
import { roleCheck } from "../middlewares/authorize.js";
import { createExam, getExams } from '../controllers/examControllers.js';

const router = express.Router();

router.post('/add', authenticate, roleCheck(['ADMIN']), createExam);
router.get('/all', authenticate, roleCheck(['ADMIN']), getExams);

export default router;
