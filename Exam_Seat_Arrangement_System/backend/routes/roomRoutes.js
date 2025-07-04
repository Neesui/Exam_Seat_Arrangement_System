import express from "express";

import { authenticate } from "../middlewares/authenticate.js";
import { authorizeRoles } from "../middlewares/authorize.js";
import { createRoom, getRoomById, getRooms } from "../controllers/roomCOntrollers.js";

const router = express.Router();

router.post("/", authenticate, authorizeRoles("ADMIN"), createRoom);
router.get("/get", authenticate, authorizeRoles("ADMIN", "INVIGILATOR"), getRooms);
router.get("/:id", authenticate, authorizeRoles("ADMIN", "INVIGILATOR"), getRoomById);



export default router;
