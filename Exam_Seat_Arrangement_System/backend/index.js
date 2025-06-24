import express from 'express';
import prisma from './utils/db.js'; 
import authRouter from './routes/authRoutes.js';
import invigilatorRouter from './routes/invigilatorRoutes.js';
import cookieParser from "cookie-parser";



const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());  

// Routes
app.use("/api/auth", authRouter);
app.use("/api/invigilator", invigilatorRouter);

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
