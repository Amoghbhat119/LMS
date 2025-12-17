const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User.model");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to DB");

    const user = await User.findOne({ email: "admin@gmail.com" });

    if (!user) {
      console.log("❌ Admin not found");
      process.exit();
    }

    console.log("Stored hash:", user.password);

    const isMatch = await bcrypt.compare("admin123", user.password);

    console.log("Password match result:", isMatch);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
})();
