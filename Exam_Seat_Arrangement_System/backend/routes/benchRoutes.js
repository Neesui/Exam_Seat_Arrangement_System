import express from "express";
import {
  createBench,
  getBenches,
  getBenchById,
  updateBench,
  deleteBench,
  getBenchesByRoom,
} from "../controllers/benchControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { roleCheck } from "../middlewares/authorize.js";

const router = express.Router();

router.post("/add", authenticate, roleCheck("ADMIN"), createBench);
router.get("/get", authenticate, roleCheck("ADMIN", "INVIGILATOR"), getBenches);
router.get("/:id", authenticate, roleCheck("ADMIN", "INVIGILATOR"), getBenchById);
router.get("/get-by-room/:roomId", authenticate, roleCheck("ADMIN"), getBenchesByRoom);
router.put("/:id", authenticate, roleCheck("ADMIN"), updateBench);
router.delete("/:id", authenticate, roleCheck("ADMIN"), deleteBench);

export default router;
