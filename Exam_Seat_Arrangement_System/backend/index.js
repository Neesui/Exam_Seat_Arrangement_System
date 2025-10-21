import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import prisma from "./utils/db.js";

// Routes
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import invigilatorRouter from "./routes/invigilatorRoutes.js";
import courseRouter from "./routes/courseRoutes.js";
import semesterRouter from "./routes/semesterRoutes.js";
import subjectRouter from "./routes/subjectRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import benchRouter from "./routes/benchRoutes.js";
import examRouter from "./routes/examRoutes.js";
import studentRouter from "./routes/studentRoutes.js";
import roomAssignmentRouter from "./routes/roomAssignmentRoutes.js";
import seatingRouter from "./routes/seatRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Create HTTP + Socket server
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

// Store io instance globally
app.set("io", io);

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`Client joined room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/upload", uploadRouter);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/invigilator", invigilatorRouter);
app.use("/api/student", studentRouter);
app.use("/api/course", courseRouter);
app.use("/api/semester", semesterRouter);
app.use("/api/subject", subjectRouter);
app.use("/api/rooms", roomRoutes);
app.use("/api/bench", benchRouter);
app.use("/api/exam", examRouter);
app.use("/api/room-assignments", roomAssignmentRouter);
app.use("/api/seating", seatingRouter);
app.use("/api/notification", notificationRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Start server
server.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
});
