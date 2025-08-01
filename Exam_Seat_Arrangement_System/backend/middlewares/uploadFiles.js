import multer from 'multer';
import path from 'path';

const fileStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/file/');
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, XLSX, and XLS files are allowed'), false);
  }
};

export const uploadFile = multer({
  storage: fileStorage,
  fileFilter,
});
