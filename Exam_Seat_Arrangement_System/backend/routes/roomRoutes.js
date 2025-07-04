import express from "express";

import { authenticate } from "../middlewares/authenticate.js";
import { authorizeRoles } from "../middlewares/authorize.js";
import { createRoom, deleteRoom, getRoomById, getRooms, updateRoom } from "../controllers/roomCOntrollers.js";

const router = express.Router();

router.post("/", authenticate, authorizeRoles("ADMIN"), createRoom);
router.get("/get", authenticate, authorizeRoles("ADMIN", "INVIGILATOR"), getRooms);
router.get("/:id", authenticate, authorizeRoles("ADMIN", "INVIGILATOR"), getRoomById);
router.put("/:id", authenticate, authorizeRoles("ADMIN"), updateRoom);
router.delete("/:id", authenticate, authorizeRoles("ADMIN"), deleteRoom);





export default router;
