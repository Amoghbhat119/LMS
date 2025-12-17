const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const studentController = require("../controllers/student.controller");

router.get(
  "/attendance",
  auth,
  role(["STUDENT"]),
  studentController.getMyAttendance
);

router.get(
  "/materials",
  auth,
  role(["STUDENT"]),
  studentController.getMaterials
);

module.exports = router;
