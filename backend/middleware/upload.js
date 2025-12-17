const multer = require("multer");
const fs = require("fs");
const path = require("path");

/* ================= ABSOLUTE ROOT PATH ================= */
const ROOT_DIR = process.cwd(); // 🔥 THIS IS THE KEY
const uploadDir = path.join(ROOT_DIR, "backend", "uploads");

/* ================= ENSURE FOLDER EXISTS ================= */
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ================= STORAGE ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // 🔒 ABSOLUTE, ROOT-BASED
  },
  filename: (req, file, cb) => {
    const unique =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

/* ================= FILE FILTER ================= */
const allowed = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "video/mp4",
];

const fileFilter = (req, file, cb) => {
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});
