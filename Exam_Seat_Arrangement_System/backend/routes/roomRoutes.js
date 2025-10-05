import express from "express";

import { authenticate } from "../middlewares/authenticate.js";
import { roleCheck } from "../middlewares/authorize.js";
import { createRoom, deleteRoom, getRoomById, getRooms, updateRoom } from "../controllers/roomCOntrollers.js";

const router = express.Router();

router.post("/add", authenticate, roleCheck(["ADMIN"]), createRoom);
router.get("/get", authenticate, roleCheck(["ADMIN"]), getRooms);
router.get("/:id", authenticate, roleCheck(["ADMIN"]), getRoomById);
router.put("/:id", authenticate, roleCheck(["ADMIN"]), updateRoom);
router.delete("/:id", authenticate, roleCheck(["ADMIN"]), deleteRoom);





export default router;
