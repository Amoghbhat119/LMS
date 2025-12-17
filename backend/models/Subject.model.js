const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", subjectSchema);
