// index.js (ES Module version)
import express from 'express';

const app = express();
app.use(express.json());

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
