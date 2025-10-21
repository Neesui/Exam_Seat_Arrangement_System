import prisma from "../utils/db.js";
import { sendEmail } from "../utils/emailService.js";

// Admin sends bulk notifications
export const sendBulkNotification = async (req, res) => {
  try {
    const { target, title, message, sendEmail: sendMail = true } = req.body;
    const io = req.app.get("io");

    if (!target || !message) {
      return res.status(400).json({ error: "Target and message are required." });
    }

    let students = [];
    let users = [];

    // Fetch recipients
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

    if (students.length === 0 && users.length === 0) {
      return res.status(404).json({ error: "No recipients found." });
    }

    // Notification creation promises
    const notificationPromises = [];

    // Students
    for (const student of students) {
      const note = await prisma.notification.create({
        data: { title, message, studentId: student.id },
      });

      // Realtime emit
      io?.to(`student-${student.id}`).emit("studentNotification", note);

      // Email via Mailtrap
      if (sendMail && student.email) {
        try {
          await sendEmail(
            student.email,
            title || "Exam Update",
            `<h3>Hello ${student.studentName},</h3>
            <p>${message}</p>
            <p>Best regards,<br/>Exam Committee</p>`
          );
        } catch (err) {
          console.error(`Failed to email ${student.email}:`, err.message);
        }
      }

      notificationPromises.push(note);
    }

    // Invigilators
    for (const user of users) {
      const note = await prisma.notification.create({
        data: { title, message, userId: user.id },
      });

      io?.to(`user-${user.id}`).emit("invigilatorNotification", note);

      if (sendMail && user.email) {
        try {
          await sendEmail(
            user.email,
            title || "Room Assignment Update",
            `<h3>Hello ${user.name},</h3>
            <p>${message}</p>
            <p>Best regards,<br/>Exam Committee</p>`
          );
        } catch (err) {
          console.error(`Failed to email ${user.email}:`, err.message);
        }
      }

      notificationPromises.push(note);
    }

    res.status(200).json({
      success: true,
      message: `Notifications sent to ${
        students.length + users.length
      } recipients.`,
      count: { students: students.length, invigilators: users.length },
    });
  } catch (err) {
    console.error("sendBulkNotification error:", err);
    res.status(500).json({ error: "Failed to send bulk notifications." });
  }
};

// Get notifications for Student
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

// Get notifications for Invigilator
export const getUserNotifications = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
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
