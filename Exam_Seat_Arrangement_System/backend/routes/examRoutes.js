import express from 'express';
import { authenticate } from "../middlewares/authenticate.js";
import { roleCheck } from "../middlewares/authorize.js";
import { createExam, deleteExam, getExamById, getExams, updateExam } from '../controllers/examControllers.js';

const router = express.Router();

router.post('/add', authenticate, roleCheck(['ADMIN']), createExam);
router.get('/all', authenticate, roleCheck(['ADMIN']), getExams);
router.get('/:id', authenticate, roleCheck(['ADMIN']), getExamById);
router.put('/:id', authenticate, roleCheck(['ADMIN']), updateExam);
router.delete('/:id', authenticate, roleCheck(['ADMIN']), deleteExam);


export default router;
