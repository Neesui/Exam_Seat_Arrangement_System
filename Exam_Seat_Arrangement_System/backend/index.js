import express from 'express';
import prisma from './utils/db.js'; 

const app = express();
app.use(express.json());

const port = 3000;

// Start server first
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);

  // Try to connect to the database after server starts
  try {
    await prisma.$connect();
    console.log('Database Connection Successfully');
  } catch (err) {
    console.err('Database Connection Failed:', err);
  }
});
