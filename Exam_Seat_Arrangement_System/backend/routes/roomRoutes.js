import express from "express";

import { authenticate } from "../middlewares/authenticate.js";
import { authorizeRoles } from "../middlewares/authorize.js";
import { createRoom } from "../controllers/roomCOntrollers.js";

const router = express.Router();

router.post("/", authenticate, authorizeRoles("ADMIN"), createRoom);

export default router;
