const Attendance = require("../models/Attendance.model");
const Material = require("../models/Material.model");
const Class = require("../models/Class.model");

exports.myAttendance = async (req, res) => {
  const records = await Attendance.find({
    "records.studentId": req.user.id
  });
  res.json(records);
};

exports.myMaterials = async (req, res) => {
  const cls = await Class.findOne({ students: req.user.id });
  if (!cls) return res.json([]);

  const materials = await Material.find({ classId: cls._id });
  res.json(materials);
};
