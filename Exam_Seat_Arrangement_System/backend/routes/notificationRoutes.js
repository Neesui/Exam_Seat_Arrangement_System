import express from "express";
import {
  sendBulkNotification,
  getStudentNotifications,
  getUserNotifications,
} from "../controllers/notificationControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { roleCheck } from "../middlewares/authorize.js";

const router = express.Router();

router.post("/bulk", authenticate, roleCheck(["ADMIN"]), sendBulkNotification);

router.get("/student/:id", authenticate, roleCheck(["ADMIN", "INVIGILATOR"]), getStudentNotifications);

router.get("/user/:id", authenticate, roleCheck(["ADMIN", "INVIGILATOR"]), getUserNotifications);

export default router;
