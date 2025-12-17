const Class = require("../models/Class.model");
const Subject = require("../models/Subject.model");
const Attendance = require("../models/Attendance.model");
const Material = require("../models/Material.model");

/* ================= GET ASSIGNED CLASSES ================= */
exports.getAssignedClasses = async (req, res) => {
  try {
    const subjects = await Subject.find({ teacher: req.user.id })
      .populate("class");

    const uniqueClasses = {};
    subjects.forEach(s => {
      if (s.class) uniqueClasses[s.class._id] = s.class;
    });

    res.json(Object.values(uniqueClasses));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET STUDENTS ================= */
exports.getStudentsByClass = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.classId)
      .populate("students", "name email");

    if (!cls) return res.status(404).json({ message: "Class not found" });

    res.json(cls.students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= SAVE / UPDATE ATTENDANCE ================= */
exports.markAttendance = async (req, res) => {
  try {
    const { classId, records, date } = req.body;

    const attendanceDate = date ? new Date(date) : new Date();
    if (isNaN(attendanceDate)) {
      return res.status(400).json({ message: "Invalid date" });
    }

    const attendance = await Attendance.findOneAndUpdate(
      {
        class: classId,
        teacher: req.user.id,
        date: attendanceDate,
      },
      {
        class: classId,
        teacher: req.user.id,
        records,
        date: attendanceDate,
      },
      { upsert: true, new: true }
    );

    res.json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= VIEW ATTENDANCE ================= */
exports.getAttendanceByDate = async (req, res) => {
  try {
    const { classId, date } = req.query;
    const queryDate = new Date(date);

    if (isNaN(queryDate)) {
      return res.status(400).json({ message: "Invalid date" });
    }

    const cls = await Class.findById(classId)
      .populate("students", "name");

    const attendance = await Attendance.findOne({
      class: classId,
      teacher: req.user.id,
      date: queryDate,
    });

    res.json({
      students: cls.students,
      records: attendance ? attendance.records : {},
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPLOAD MATERIAL ================= */
exports.uploadMaterial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File missing" });
    }

    const material = await Material.create({
      file: req.file.filename,
      teacher: req.user.id,
      class: req.body.classId,
    });

    res.json(material);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};

/* ================= VIEW UPLOADED FILES ================= */
exports.getMaterialsByClass = async (req, res) => {
  try {
    const { classId } = req.query;

    const materials = await Material.find({
      class: classId,
      teacher: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(materials);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
