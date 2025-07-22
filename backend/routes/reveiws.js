const express = require("express");
const Review = require("../models/Review");
const Course = require("../models/Course");
const auth = require("../middleware/auth");

const router = express.Router();

// إضافة تقييم جديد لدورة (طالب فقط)
router.post("/:courseId", auth, async (req, res) => {
  try {
    // التحقق من أن المستخدم طالب
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "فقط الطلاب يمكنهم إضافة تقييم." });
    }

    const { rating, comment } = req.body;
    const courseId = req.params.courseId;

    // تحقق أن الدورة موجودة
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "الدورة غير موجودة." });
    }

    // تحقق أن الطالب لم يقيّم الدورة سابقًا
    const existingReview = await Review.findOne({
      course: courseId,
      student: req.user.userId,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "لقد قمت بتقييم هذه الدورة بالفعل." });
    }

    // إضافة التقييم
    const review = new Review({
      course: courseId,
      student: req.user.userId,
      rating,
      comment,
    });

    await review.save();

    // ربط التقييم بالدورة
    course.reviews.push(review._id);
    await course.save();

    res.status(201).json({ message: "تم إضافة التقييم بنجاح!", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء إضافة التقييم." });
  }
});

// جلب كل التقييمات لدورة
router.get("/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const reviews = await Review.find({ course: courseId }).populate(
      "student",
      "name"
    );
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب التقييمات." });
  }
});

module.exports = router;
