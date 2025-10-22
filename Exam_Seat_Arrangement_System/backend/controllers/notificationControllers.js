import prisma from "../utils/db.js";
import { sendEmail } from "../utils/emailService.js";

export const sendBulkNotification = async (req, res) => {
  try {
    const { target, title, message } = req.body;
    const io = req.app.get("io");

    if (!target || !message) {
      return res.status(400).json({ error: "Target and message are required." });
    }

    let students = [];
    let users = [];

    if (target === "students" || target === "both") {
      students = await prisma.student.findMany({
        select: { id: true, email: true, studentName: true },
      });
    }

    if (target === "invigilators" || target === "both") {
      users = await prisma.user.findMany({
        where: { role: "INVIGILATOR" },
        select: { id: true, email: true, name: true },
      });
    }

    // Send to students
    for (const student of students) {
      const note = await prisma.notification.create({
        data: { title, message, studentId: student.id },
      });
      io?.to(`student-${student.id}`).emit("studentNotification", note);
    }

    // Send to invigilators
    for (const user of users) {
      const note = await prisma.notification.create({
        data: { title, message, userId: user.id },
      });
      io?.to(`user-${user.id}`).emit("invigilatorNotification", note);

      if (user.email) {
        try {
          await sendEmail(
            user.email,
            title || "Room Assignment Notification",
            `<h3>Hello ${user.name},</h3>
             <p>${message}</p>
             <p>Best regards,<br/>Exam Committee</p>`
          );
        } catch (err) {
          console.error(`Email failed for ${user.email}:`, err.message);
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Notifications sent successfully.",
      count: { students: students.length, invigilators: users.length },
    });
  } catch (err) {
    console.error("sendBulkNotification error:", err);
    res.status(500).json({ error: "Failed to send notifications." });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const authUserId = req.user.id; // user from JWT

    // ensure invigilator can only access their own notifications
    if (userId !== authUserId) {
      return res.status(403).json({ error: "Unauthorized access to notifications." });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json({ notifications });
  } catch (err) {
    console.error("getUserNotifications error:", err.message);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

export const getStudentNotifications = async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);
    const notifications = await prisma.notification.findMany({
      where: { studentId },
      orderBy: { createdAt: "desc" },
    });
    res.json({ notifications });
  } catch (err) {
    console.error("getStudentNotifications error:", err.message);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    res.json({ success: true, notification });
  } catch (err) {
    console.error("markNotificationAsRead error:", err.message);
    res.status(500).json({ error: "Failed to mark notification as read." });
  }
};
