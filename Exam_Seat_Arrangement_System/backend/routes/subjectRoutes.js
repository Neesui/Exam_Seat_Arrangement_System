import express from 'express';
import {authenticate} from '../middlewares/authenticate.js';
import {authorizeRoles} from '../middlewares/authorizeRoles.js';
import { addSubject, deleteSubject, getSubjectById, getSubjects, updateSubject } from '../controllers/subjectControllers';

const router = express.Router();

router.post("/add", authenticate, authorizeRoles("ADMIN", addSubject))
router.get("/all", authenticate, authorizeRoles("ADMIN", getSubjects))
router.get("/:id", authenticate, authorizeRoles("ADMIN", getSubjectById))
router.put("/:id", authenticate, authorizeRoles("ADMIN", updateSubject))
router.delete("/:id", authenticate, authorizeRoles("ADMIN", deleteSubject))


export default router;
