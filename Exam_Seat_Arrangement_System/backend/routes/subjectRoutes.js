import express from 'express';
import { authenticate } from "../middlewares/authenticate.js";
import { roleCheck } from "../middlewares/authorize.js";
import {} from "../controllers/subjectController.js";
import { addSubject } from '../controllers/subjectController.js';

const router = express.Router();

router.post("/add", authenticate, roleCheck(["ADMIN"]), addSubject);
router.get("/all", authenticate, roleCheck(["ADMIN"]), getSubjects);
router.get("/:id", authenticate, roleCheck(["ADMIN"]), getSubjectById);
router.put("/:id", authenticate, roleCheck(["ADMIN"]), updateSubject);
router.delete("/:id", authenticate, roleCheck(["ADMIN"]), deleteSubject);

export default router;
