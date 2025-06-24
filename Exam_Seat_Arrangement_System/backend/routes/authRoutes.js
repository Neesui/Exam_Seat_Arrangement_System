import express from "express";
import { adminLogin, invigilatorLogin, logoutController } from "../controllers/authCOntrollers.js";

const router = express.Router();

router.post("/admin-login", adminLogin);
router.post("/invigilator-login", invigilatorLogin);
router.get("/logout", logoutController);

export default router;
