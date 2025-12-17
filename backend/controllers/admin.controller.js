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

    // Password hashing handled in User.model.js
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

    if (!classId || !studentId) {
      return res.status(400).json({
        message: "classId and studentId are required",
      });
    }

    // Validate class
    const cls = await Class.findById(classId);
    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Validate student
    const student = await User.findById(studentId);
    if (!student || student.role !== "STUDENT") {
      return res.status(404).json({ message: "Student not found" });
    }

    // Add student to class if not already present
    if (!cls.students.includes(studentId)) {
      cls.students.push(studentId);
      await cls.save();
    }

    // 🔥 CRITICAL FIX: assign class to student automatically
    student.class = classId;
    await student.save();

    res.json({ message: "Student assigned to class successfully" });
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
