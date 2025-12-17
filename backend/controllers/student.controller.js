const Attendance = require("../models/Attendance.model");
const Material = require("../models/Material.model");
const User = require("../models/User.model");

/* ================= VIEW MY ATTENDANCE ================= */
exports.getMyAttendance = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: "From and To dates required" });
    }

    const student = await User.findById(req.user.id);
    if (!student || !student.class) {
      return res.status(400).json({ message: "Student class not assigned" });
    }

    const records = await Attendance.find({
      class: student.class,
      date: {
        $gte: new Date(from),
        $lte: new Date(to),
      },
    }).sort({ date: 1 });

    const result = records.map((r) => ({
      date: r.date,
      present: r.records?.[req.user.id] === true,
    }));

    res.json(result);
  } catch (err) {
    console.error("STUDENT ATTENDANCE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= VIEW CLASS MATERIALS ================= */
exports.getMaterials = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    if (!student || !student.class) {
      return res.status(400).json({ message: "Student class not assigned" });
    }

    const materials = await Material.find({
      class: student.class,
    }).sort({ createdAt: -1 });

    res.json(materials);
  } catch (err) {
    console.error("STUDENT MATERIAL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
