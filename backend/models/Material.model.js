const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    file: String,
    type: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Material", materialSchema);
