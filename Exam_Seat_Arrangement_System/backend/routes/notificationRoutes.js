import express from "express";
import {
  sendBulkNotification,
  getStudentNotifications,
  getUserNotifications,
  markNotificationAsRead,
} from "../controllers/notificationControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { roleCheck } from "../middlewares/authorize.js";

const router = express.Router();

router.post("/bulk", authenticate, roleCheck(["ADMIN"]), sendBulkNotification);

router.get("/user/:id", authenticate, roleCheck(["ADMIN", "INVIGILATOR"]), getUserNotifications);

router.get("/student/:id", authenticate, roleCheck(["ADMIN", "INVIGILATOR", "STUDENT"]), getStudentNotifications);

router.patch("/:id/read", authenticate, markNotificationAsRead);

export default router;
