const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    console.log("LOGIN EMAIL:", email);
    console.log("LOGIN PASSWORD RAW:", password);
    console.log("PASSWORD TYPE:", typeof password);

    if (!email || password === undefined || password === null) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 🔒 FORCE PASSWORD TO STRING
    password = String(password);

    const user = await User.findOne({ email });
    console.log("USER FOUND:", !!user);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("HASH IN DB:", user.password);

    // ✅ USE MODEL METHOD ONLY
    const isMatch = await user.matchPassword(password);
    console.log("PASSWORD MATCH RESULT:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
