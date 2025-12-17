const User = require("../models/User.model");
const Class = require("../models/Class.model");
const Subject = require("../models/Subject.model");

/* ================= CREATE USER (TEACHER / STUDENT) ================= */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate role
    if (!["TEACHER", "STUDENT"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Validate password
    if (!password || typeof password !== "string") {
      return res.status(400).json({ message: "Password is required" });
    }

    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // IMPORTANT:
    // Pass plain password — hashing is handled in User.model.js
    await User.create({
      name,
      email,
      password: password.trim(),
      role,
    });

    res.json({ message: "User created successfully" });
  } catch (error) {
    console.error("CREATE USER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= CREATE CLASS ================= */
exports.createClass = async (req, res) => {
  try {
    const cls = await Class.create({
      name: req.body.name,
    });

    res.json(cls);
  } catch (error) {
    console.error("CREATE CLASS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= ASSIGN STUDENT TO CLASS ================= */
exports.assignStudentToClass = async (req, res) => {
  try {
    const { classId, studentId } = req.body;

    await Class.findByIdAndUpdate(classId, {
      $addToSet: { students: studentId },
    });

    res.json({ message: "Student assigned to class" });
  } catch (error) {
    console.error("ASSIGN STUDENT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= CREATE SUBJECT ================= */
exports.createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    res.json(subject);
  } catch (error) {
    console.error("CREATE SUBJECT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
