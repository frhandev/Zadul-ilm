const express = require("express");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const auth = require("../middleware/auth");

const router = express.Router();

// اشتراك طالب في دورة
router.post("/:courseId", auth, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "فقط الطلاب يمكنهم الاشتراك في الدورات." });
    }

    const courseId = req.params.courseId;

    // تحقق أن الدورة موجودة
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "الدورة غير موجودة." });
    }

    // تحقق إذا الطالب مشترك من قبل
    const existing = await Enrollment.findOne({
      course: courseId,
      student: req.user.userId,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "أنت مشترك بالفعل في هذه الدورة." });
    }

    // أنشئ الاشتراك
    const enrollment = new Enrollment({
      course: courseId,
      student: req.user.userId,
    });
    await enrollment.save();

    res
      .status(201)
      .json({ message: "تم الاشتراك في الدورة بنجاح!", enrollment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء الاشتراك في الدورة." });
  }
});

// جلب كل الدورات المشترك بها طالب (الطالب نفسه فقط)
router.get("/my-courses", auth, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "فقط الطلاب يمكنهم مشاهدة الدورات المشتركة." });
    }

    const enrollments = await Enrollment.find({
      student: req.user.userId,
    }).populate("course");

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب الدورات المشتركة." });
  }
});

// جلب كل الطلاب المشتركين في دورة (فقط المدرّس صاحب الدورة أو الأدمن)
router.get("/course/:courseId", auth, async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "الدورة غير موجودة." });
    }

    // فقط المدرّس صاحب الدورة أو أدمين
    if (
      course.teacher.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "ليس لديك صلاحية لمشاهدة المشتركين." });
    }

    const enrollments = await Enrollment.find({ course: courseId }).populate(
      "student",
      "name email"
    );
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب الطلاب المشتركين." });
  }
});

module.exports = router;
