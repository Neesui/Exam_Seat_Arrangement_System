import express from 'express';
import prisma from './utils/db.js'; 
import cookieParser from "cookie-parser";
import authRouter from './routes/authRoutes.js';
import userROuter from './routes/userRoutes.js';
import invigilatorRouter from './routes/invigilatorRoutes.js';
import courseRouter from './routes/courseRoutes.js'
import semesterRouter from './routes/semesterRoutes.js'
import roomRoutes from "./routes/roomRoutes.js";

const app = express();

// Middleware
app.use(express.json());
// app.use(cookieParser());  

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userROuter)
app.use("/api/invigilator", invigilatorRouter);
app.use("/api/course", courseRouter)
app.use("/api/semester", semesterRouter)
app.use("/api/rooms", roomRoutes);


// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Port
const port = 3000;

// Start server first
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);

  // Try to connect to the database after server starts
  try {
    await prisma.$connect();
    console.log('Database Connection Successfully');
  } catch (err) {
    console.error('Database Connection Failed:', err);

  }
});
