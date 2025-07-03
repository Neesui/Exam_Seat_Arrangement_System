import express from 'express';
import {authenticate} from '../middlewares/authenticate.js';
import {authorizeRoles} from '../middlewares/authorizeRoles.js';
import { addSubject, getSubjects } from '../controllers/subjectControllers';

const router = express.Router();

router.post("/add", authenticate, authorizeRoles("ADMIN", addSubject))
router.get("/all", authenticate, authorizeRoles("ADMIN", getSubjects))


export default router;
