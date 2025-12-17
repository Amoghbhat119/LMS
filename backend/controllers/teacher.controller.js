const Class = require("../models/Class.model");
const User = require("../models/User.model");
const Attendance = require("../models/Attendance.model");
const Material = require("../models/Material.model");

/* ================= GET ASSIGNED CLASSES ================= */
exports.getAssignedClasses = async (req, res) => {
  try {
    const classes = await Class.find({
      teachers: req.user.id,
    }).populate("subjects");

    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET STUDENTS ================= */
exports.getStudentsByClass = async (req, res) => {
  try {
    const students = await User.find({
      role: "STUDENT",
      class: req.params.classId,
    });

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= MARK ATTENDANCE ================= */
exports.markAttendance = async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
    await attendance.save();
    res.json({ message: "Attendance saved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPLOAD MATERIAL ================= */
exports.uploadMaterial = async (req, res) => {
  try {
    const material = new Material({
      title: req.body.title,
      file: req.file.filename,
      teacher: req.user.id,
    });

    await material.save();
    res.json({ message: "Material uploaded" });
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
};
