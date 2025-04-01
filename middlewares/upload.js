const multer = require("multer");
const path = require("path");

// File Filter Function
const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG, JPEG, and PNG files are allowed! GIF is not allowed."), false);
  }
};

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
});

module.exports = upload;
