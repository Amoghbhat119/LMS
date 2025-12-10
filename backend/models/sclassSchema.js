const mongoose = require("mongoose");

const sclassSchema = new mongoose.Schema(
  {
    sclassName: { type: String, required: true, trim: true },
    numericName: { type: String, default: "", trim: true },
    // Each class belongs to an Admin (school)
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",           // must match your Admin model name
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("sclass", sclassSchema);
