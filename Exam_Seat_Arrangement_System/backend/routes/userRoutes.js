import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { roleCheck } from "../middlewares/authorize.js";

const router = express.Router();

router.get("/all", authenticate, roleCheck(["ADMIN"]), getAllUsers);

export default router;
