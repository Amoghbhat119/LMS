const User = require("../models/User.model");
const Class = require("../models/Class.model");
const Subject = require("../models/Subject.model");

exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!["TEACHER", "STUDENT"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });

  await User.create({ name, email, password, role });
  res.json({ message: "User created successfully" });
};

exports.createClass = async (req, res) => {
  const cls = await Class.create({ name: req.body.name });
  res.json(cls);
};

exports.assignStudentToClass = async (req, res) => {
  const { classId, studentId } = req.body;
  await Class.findByIdAndUpdate(classId, {
    $addToSet: { students: studentId }
  });
  res.json({ message: "Student assigned to class" });
};

exports.createSubject = async (req, res) => {
  const subject = await Subject.create(req.body);
  res.json(subject);
};
