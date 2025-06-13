import express from "express";
import { loginController } from "../controllers/userController.js";

const router = express.Router()

router.post("/login",loginController)

export default router
