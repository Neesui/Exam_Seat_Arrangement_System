import express from "express";
import { addInvigilatorController, getProfile, updateProfile } from "../controllers/invigilatorController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { roleCheck } from "../middlewares/authorize.js";
const router = express.Router();

// Only ADMIN can add invigilator
router.post("/add", authenticate, roleCheck(["ADMIN"]), addInvigilatorController);
router.get("/profile", authenticate, roleCheck(["INVIGILATOR"]), getProfile);
router.put("/update-profile", authenticate, roleCheck(["INVIGILATOR"]), updateProfile);


export default router;
