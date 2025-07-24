// routes/uploadRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Set storage location
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/file"); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST /api/upload/file
router.post('/file', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  res.json({
    success: true,
    url: `/uploads/file/${req.file.filename}`,
  });
});

export default router;
