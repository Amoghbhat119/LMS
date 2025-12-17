const express = require("express");
const router = express.Router();

const Class = require("../models/Class.model");
const User = require("../models/User.model");
const Subject = require("../models/Subject.model");

/* ===================== CLASSES ===================== */

// CREATE CLASS
router.post("/class", async (req, res) => {
  try {
    const cls = await Class.create({ name: req.body.name });
    res.status(201).json(cls);
  } catch (err) {
    res.status(500).json({ message: "Failed to create class" });
  }
});

// GET ALL CLASSES (POPULATED)
router.get("/classes", async (req, res) => {
  try {
    const classes = await Class.find()
      .populate({
        path: "subjects",
        populate: { path: "teacher", select: "name email" },
      })
      .populate("students", "name email");

    res.json(classes);
  } catch {
    res.status(500).json({ message: "Failed to fetch classes" });
  }
});

/* ===================== SUBJECTS ===================== */

// CREATE SUBJECT
router.post("/subject", async (req, res) => {
  try {
    const { name, classId } = req.body;

    const subject = await Subject.create({
      name,
      class: classId,
    });

    await Class.findByIdAndUpdate(classId, {
      $addToSet: { subjects: subject._id },
    });

    res.status(201).json(subject);
  } catch {
    res.status(500).json({ message: "Failed to create subject" });
  }
});

// GET ALL SUBJECTS
router.get("/subjects", async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate("class", "name")
      .populate("teacher", "name email");

    res.json(subjects);
  } catch {
    res.status(500).json({ message: "Failed to fetch subjects" });
  }
});

/* ===================== TEACHERS ===================== */

// CREATE TEACHER
router.post("/teacher", async (req, res) => {
  try {
    const { name, email, password, subjectIds } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const teacher = await User.create({
      name,
      email,
      password: password.trim(),
      role: "TEACHER",
    });

    if (subjectIds?.length) {
      await Subject.updateMany(
        { _id: { $in: subjectIds } },
        { teacher: teacher._id }
      );
    }

    res.status(201).json({ message: "Teacher created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create teacher" });
  }
});

// GET ALL TEACHERS
router.get("/teachers", async (req, res) => {
  try {
    const teachers = await User.find({ role: "TEACHER" }).select("-password");
    res.json(teachers);
  } catch {
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
});

/* ===================== STUDENTS ===================== */

// CREATE STUDENT  ✅ FIXED
router.post("/student", async (req, res) => {
  try {
    const { name, email, password, classId } = req.body;

    if (!name || !email || !password || !classId) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const student = await User.create({
      name,
      email,
      password: password.trim(),
      role: "STUDENT",
      class: classId, // ✅ THIS IS THE ONLY REQUIRED FIX
    });

    await Class.findByIdAndUpdate(classId, {
      $addToSet: { students: student._id },
    });

    res.status(201).json({ message: "Student created successfully" });
  } catch {
    res.status(500).json({ message: "Failed to create student" });
  }
});

// GET ALL STUDENTS
router.get("/students", async (req, res) => {
  try {
    const students = await User.find({ role: "STUDENT" }).select("-password");
    res.json(students);
  } catch {
    res.status(500).json({ message: "Failed to fetch students" });
  }
});

module.exports = router;
