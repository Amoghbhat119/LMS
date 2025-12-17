const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    /* ================= GET TOKEN ================= */
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    /* ================= VERIFY TOKEN ================= */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* ================= ATTACH USER ================= */
    req.user = decoded; // { id, role }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
