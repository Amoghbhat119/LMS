const Sclass = require("../models/sclassSchema");
const Student = require("../models/studentSchema");

const fail500 = (res, tag, err) => {
  console.error(`💥 ${tag}:`, err);
  return res
    .status(500)
    .json({ message: err?.message || "Internal Server Error" });
};

// POST /SclassCreate
// body: { sclassName, numericName, school }  // school = Admin _id
const sclassCreate = async (req, res) => {
  try {
    const { sclassName, numericName = "", school } = req.body;
    if (!sclassName || !school)
      return res.status(400).json({ message: "sclassName and school are required" });

    // unique per school
    const exists = await Sclass.findOne({
      school,
      sclassName: sclassName.trim(),
    });
    if (exists) return res.status(409).json({ message: "Class name already exists" });

    const doc = await Sclass.create({
      sclassName: sclassName.trim(),
      numericName: (numericName || "").trim(),
      school,
    });
    return res.status(201).json(doc);
  } catch (err) {
    return fail500(res, "SclassCreate ERROR", err);
  }
};
const sclassList = async (req, res) => {
  try {
    console.log('🟢 /SclassList -> schoolId:', req.params.id);
    const list = await Sclass.find({ school: req.params.id })
      .select('_id sclassName numericName school')
      .sort({ createdAt: 1 });
    return res.status(200).json(list);
  } catch (err) {
    console.error('💥 SclassList ERROR:', err);
    return res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};


// GET /Sclass/:id
const getSclassDetail = async (req, res) => {
  try {
    const doc = await Sclass.findById(req.params.id)
      .select("_id sclassName numericName school");
    if (!doc) return res.status(404).json({ message: "Class not found" });
    return res.status(200).json(doc);
  } catch (err) {
    return fail500(res, "GetSclassDetail ERROR", err);
  }
};

// GET /Sclass/Students/:id  (id = class _id)
const getSclassStudents = async (req, res) => {
  try {
    const classId = req.params.id;
    const students = await Student.find({ sclassName: classId })
      .select("_id name rollNum sclassName");
    return res.status(200).json(students);
  } catch (err) {
    return fail500(res, "GetSclassStudents ERROR", err);
  }
};

// (Optional) DELETE endpoints — implement or return a safe message
const deleteSclass = async (req, res) => {
  try {
    await Sclass.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Class deleted" });
  } catch (err) {
    return fail500(res, "DeleteSclass ERROR", err);
  }
};

const deleteSclasses = async (req, res) => {
  try {
    const schoolId = req.params.id;
    await Sclass.deleteMany({ school: schoolId });
    return res.status(200).json({ message: "All classes deleted for this school" });
  } catch (err) {
    return fail500(res, "DeleteSclasses ERROR", err);
  }
};

module.exports = {
  sclassCreate,
  sclassList,
  getSclassDetail,
  getSclassStudents,
  deleteSclass,
  deleteSclasses,
};
