import express from "express";
import { addInvigilatorController, getProfile, updateProfile } from "../controllers/invigilatorController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorizeRoles } from "../middlewares/authorize.js";
const router = express.Router();

// Only ADMIN can add invigilator
router.post("/add", authenticate, authorizeRoles("ADMIN"), addInvigilatorController);
router.get("/profile", authenticate, authorizeRoles("INVIGILATOR"), getProfile);
router.put("/update-profile", authenticate, authorizeRoles("INVIGILATOR"), updateProfile);


export default router;
