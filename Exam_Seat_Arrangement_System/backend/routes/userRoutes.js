import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

// Protected route: only accessible with a valid JWT
router.get("/all", authenticate, getAllUsers);

export default router;
