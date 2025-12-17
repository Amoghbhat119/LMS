const router = require("express").Router();
const protect = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const student = require("../controllers/student.controller");

router.get("/attendance", protect, role(["STUDENT"]), student.myAttendance);
router.get("/materials", protect, role(["STUDENT"]), student.myMaterials);

module.exports = router;
