const express = require("express");
const Course = require("../models/Course");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Lesson = require("../models/Lesson");
const Review = require("../models/Review");

const router = express.Router();

const uploadPath = "uploads/course-images";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// إضافة دورة جديدة (معلم فقط)
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    // التحقق من أن المستخدم معلم أو أدمين
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "الصلاحية فقط للمعلمين أو الإدارة." });
    }

    const { title, description, category } = req.body;
    let image = "";
    if (req.file) {
      image = `/uploads/course-images/${req.file.filename}`;
    }

    const course = new Course({
      title,
      description,
      category,
      image,
      teacher: req.user.userId,
    });
    await course.save();

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء إضافة الدورة." });
  }
});

router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category && category !== "الكل") {
      query.category = category;
    }

    const courses = await Course.find(query).populate("teacher", "name email");
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

// عدّل/أنشئ route update course
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "الدورة غير موجودة" });

    // فقط المعلم صاحب الدورة أو الأدمين
    if (
      course.teacher.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "ليس لديك صلاحية التعديل" });
    }

    // تحديث البيانات
    const { title, description, category } = req.body;
    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;

    if (req.file) {
      course.image = `/uploads/course-images/${req.file.filename}`;
    }

    await course.save();
    res.json({ message: "تم تعديل الدورة بنجاح", course });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء التعديل" });
  }
});

// حذف دورة
router.delete("/:courseId", auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "الدورة غير موجودة." });

    // فقط الأدمن أو معلم الدورة له الصلاحية
    if (
      req.user.role !== "admin" &&
      course.teacher.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: "ليس لديك صلاحية الحذف." });
    }

    // احذف الدروس والتقييمات المرتبطة (اختياري/حسب احتياجك)
    await Lesson.deleteMany({ course: course._id });
    await Review.deleteMany({ course: course._id });

    // احذف الدورة نفسها
    await course.deleteOne();
    res.json({ message: "تم حذف الدورة بنجاح." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء حذف الدورة." });
  }
});

module.exports = router;
