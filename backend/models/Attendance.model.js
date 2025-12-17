const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    records: Object,
    date: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
