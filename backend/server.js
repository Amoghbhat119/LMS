const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

// Load env variables
dotenv.config();

// Initialize app
const app = express();
const path = require("path");

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);


// Connect DB
connectDB();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= ROUTES ================= */
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/teacher", require("./routes/teacher.routes"));
app.use("/api/student", require("./routes/student.routes"));

/* ================= HEALTH CHECK ================= */
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "LMS backend running" });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
