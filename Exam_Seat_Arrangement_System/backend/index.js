import express from 'express';
import prisma from './utils/db.js'; 
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import invigilatorRouter from './routes/invigilatorRoutes.js';
import courseRouter from './routes/courseRoutes.js';
import semesterRouter from './routes/semesterRoutes.js';
import roomRoutes from "./routes/roomRoutes.js";

const app = express();
const port = 3000;

// ✅ CORS Middleware BEFORE your routes
app.use(cors({
  origin: "http://localhost:5173",  // Your frontend origin
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true, // Allows cookies to be sent
}));

// ✅ Other Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/invigilator", invigilatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/semester", semesterRouter);
app.use("/api/rooms", roomRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ✅ Start Server and Connect DB
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  try {
    await prisma.$connect();
    console.log('Database Connection Successfully');
  } catch (err) {
    console.error('Database Connection Failed:', err);
  }
});
