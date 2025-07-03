import express from 'express';
import {authenticate} from '../middlewares/authenticate.js';
import {authorizeRoles} from '../middlewares/authorizeRoles.js';
import { addSubject } from '../controllers/subjectControllers';

const router = express.Router();

router.post("/add", authenticate, authorizeRoles("ADMIN", addSubject))

export default router;
