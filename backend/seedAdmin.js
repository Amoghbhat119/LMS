const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User.model");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminExists = await User.findOne({ role: "ADMIN" });
    if (adminExists) {
      console.log("❌ Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
    });

    await admin.save();

    console.log("✅ Admin seeded successfully");
    console.log("📧 Email: admin@gmail.com");
    console.log("🔑 Password: admin123");

    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedAdmin();
