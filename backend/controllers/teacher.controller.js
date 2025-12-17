const Class = require("../models/Class.model");
const Subject = require("../models/Subject.model");
const Attendance = require("../models/Attendance.model");
const Material = require("../models/Material.model");

/* ================= GET ASSIGNED CLASSES ================= */
exports.getAssignedClasses = async (req, res) => {
  try {
    const subjects = await Subject.find({ teacher: req.user.id }).populate("class");

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

    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json(cls.students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= SAVE / UPDATE ATTENDANCE ================= */
exports.markAttendance = async (req, res) => {
  try {
    const { classId, records, date } = req.body;

    if (!classId || !records || typeof records !== "object") {
      return res.status(400).json({ message: "Invalid attendance data" });
    }

    // 🔥 NORMALIZE DATE (critical fix)
    const attendanceDate = new Date(date || Date.now());
    attendanceDate.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOneAndUpdate(
      {
        class: classId,
        date: attendanceDate, // 🔥 same day = same document
      },
      {
        class: classId,
        teacher: req.user.id,
        records,              // 🔥 overwrite with latest state
        date: attendanceDate,
      },
      { upsert: true, new: true }
    );

    res.json(attendance);
  } catch (err) {
    console.error("MARK ATTENDANCE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= VIEW ATTENDANCE ================= */
exports.getAttendanceByDate = async (req, res) => {
  try {
    const { classId, date } = req.query;

    if (!classId || !date) {
      return res.status(400).json({ message: "classId and date required" });
    }

    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const cls = await Class.findById(classId).populate("students", "name");

    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    const attendance = await Attendance.findOne({
      class: classId,
      date: queryDate,
    });

    res.json({
      students: cls.students,
      records: attendance ? attendance.records : {},
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPLOAD MATERIAL ================= */
exports.uploadMaterial = async (req, res) => {
  try {
    const { classId } = req.body;

    if (!req.file || !classId) {
      return res.status(400).json({ message: "File and classId required" });
    }

    const material = await Material.create({
      file: req.file.filename,
      teacher: req.user.id,
      class: classId,
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

    if (!classId) {
      return res.status(400).json({ message: "classId required" });
    }

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
