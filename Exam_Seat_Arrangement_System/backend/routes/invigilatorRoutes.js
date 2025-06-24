import express from "express";
import { addInvigilatorController } from "../controllers/invigilatorController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorizeRoles } from "../middlewares/authorize.js";
const router = express.Router();

// Only ADMIN can add invigilator
router.post("/add", authenticate, authorizeRoles("ADMIN"), addInvigilatorController);

export default router;
