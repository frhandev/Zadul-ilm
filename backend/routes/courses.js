const express = require("express");
const Course = require("../models/Course");
const auth = require("../middleware/auth");

const router = express.Router();

// إضافة دورة جديدة (معلم فقط)
router.post("/", auth, async (req, res) => {
  try {
    // التحقق من أن المستخدم معلم أو أدمين
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "الصلاحية فقط للمعلمين أو الإدارة." });
    }

    const { title, description, category, image } = req.body;

    const course = new Course({
      title,
      description,
      category,
      image,
      teacher: req.user.userId,
    });

    await course.save();

    res.status(201).json({ message: "تم إنشاء الدورة بنجاح!", course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء إضافة الدورة." });
  }
});

// جلب جميع الدورات
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("teacher", "name email");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب الدورات." });
  }
});

// جلب دورة واحدة بالتفصيل
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("teacher", "name email")
      .populate("lessons")
      .populate("reviews");
    if (!course) return res.status(404).json({ message: "الدورة غير موجودة." });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب الدورة." });
  }
});

module.exports = router;
