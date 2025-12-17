const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const Class = require("../models/Class.model");
const User = require("../models/User.model");
const Subject = require("../models/Subject.model");

/* ===================== CLASSES ===================== */

/* CREATE CLASS */
router.post("/class", async (req, res) => {
  try {
    const cls = await Class.create({ name: req.body.name });
    res.status(201).json(cls);
  } catch (err) {
    res.status(500).json({ message: "Failed to create class" });
  }
});

/* ✅ GET ALL CLASSES (FULLY POPULATED — FIXED) */
router.get("/classes", async (req, res) => {
  try {
    const classes = await Class.find()
      .populate({
        path: "subjects",
        populate: {
          path: "teacher",
          select: "name email",
        },
      })
      .populate("students", "name email");

    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch classes" });
  }
});

/* ===================== SUBJECTS ===================== */

/* CREATE SUBJECT */
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
  } catch (err) {
    res.status(500).json({ message: "Failed to create subject" });
  }
});

/* GET ALL SUBJECTS */
router.get("/subjects", async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate("class", "name")
      .populate("teacher", "name email");

    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch subjects" });
  }
});

/* ===================== TEACHERS ===================== */

/* CREATE TEACHER + ASSIGN SUBJECTS */
router.post("/teacher", async (req, res) => {
  try {
    const { name, email, password, classId, subjectIds } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "TEACHER",
    });

    /* Assign teacher to selected subjects */
    if (subjectIds && subjectIds.length > 0) {
      await Subject.updateMany(
        { _id: { $in: subjectIds } },
        { teacher: teacher._id }
      );
    }

    res.status(201).json({ message: "Teacher created and assigned" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create teacher" });
  }
});

/* GET ALL TEACHERS */
router.get("/teachers", async (req, res) => {
  try {
    const teachers = await User.find({ role: "TEACHER" }).select("-password");
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
});

/* ===================== STUDENTS ===================== */

/* CREATE STUDENT + ASSIGN TO CLASS */
router.post("/student", async (req, res) => {
  try {
    const { name, email, password, classId } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "STUDENT",
    });

    await Class.findByIdAndUpdate(classId, {
      $addToSet: { students: student._id },
    });

    res.status(201).json({ message: "Student created and assigned" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create student" });
  }
});

/* GET ALL STUDENTS */
router.get("/students", async (req, res) => {
  try {
    const students = await User.find({ role: "STUDENT" }).select("-password");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch students" });
  }
});

module.exports = router;
