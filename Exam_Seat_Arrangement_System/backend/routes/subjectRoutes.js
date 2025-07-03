import express from 'express';
import {authenticate} from '../middlewares/authenticate.js';
import {authorizeRoles} from '../middlewares/authorizeRoles.js';
import { addSubject, getSubjectById, getSubjects } from '../controllers/subjectControllers';

const router = express.Router();

router.post("/add", authenticate, authorizeRoles("ADMIN", addSubject))
router.get("/all", authenticate, authorizeRoles("ADMIN", getSubjects))
router.get("/:id", authenticate, authorizeRoles("ADMIN", getSubjectById))


export default router;
