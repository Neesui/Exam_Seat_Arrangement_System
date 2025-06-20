import express from 'express';
import prisma from './utils/db.js'; 
import userRouter from './routes/userRoutes.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/user", userRouter);

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
