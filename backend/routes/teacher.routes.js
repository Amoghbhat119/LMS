const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const upload = require("../middleware/upload");

const teacherController = require("../controllers/teacher.controller");

router.get("/classes", auth, role(["TEACHER"]), teacherController.getAssignedClasses);

router.get("/students/:classId", auth, role(["TEACHER"]), teacherController.getStudentsByClass);

router.post("/attendance", auth, role(["TEACHER"]), teacherController.markAttendance);

router.get("/attendance", auth, role(["TEACHER"]), teacherController.getAttendanceByDate);

router.post(
  "/material",
  auth,
  role(["TEACHER"]),
  upload.single("file"),
  teacherController.uploadMaterial
);

router.get(
  "/materials",
  auth,
  role(["TEACHER"]),
  teacherController.getMaterialsByClass
);

module.exports = router;
