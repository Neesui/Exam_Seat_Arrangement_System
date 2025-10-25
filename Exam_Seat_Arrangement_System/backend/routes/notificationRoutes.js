import express from "express";
import {
  sendBulkNotification,
  getStudentNotifications,
  getInvigilatorNotifications,
  markNotificationAsRead,
} from "../controllers/notificationControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { roleCheck } from "../middlewares/authorize.js";

const router = express.Router();

// Admin sends bulk notifications
router.post("/bulk", authenticate, roleCheck(["ADMIN"]), sendBulkNotification);

// nvigilator gets only their notifications
router.get("/invigilator/notifications", authenticate, roleCheck(["INVIGILATOR"]), getInvigilatorNotifications);

// Student gets only their notifications
router.get("/student/notifications", authenticate, getStudentNotifications);

// Mark as read
router.patch("/:id/read", authenticate, markNotificationAsRead);

export default router;
