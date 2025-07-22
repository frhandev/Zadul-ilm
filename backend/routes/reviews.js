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

// تعديل تقييم موجود
router.put("/:reviewId", auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    // جلب التقييم
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "التقييم غير موجود." });
    }

    // تحقق أن الطالب هو صاحب التقييم أو أنه أدمين
    if (
      review.student.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "ليس لديك صلاحية لتعديل هذا التقييم." });
    }

    // عدل البيانات المطلوبة
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    res.json({ message: "تم تعديل التقييم بنجاح.", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء تعديل التقييم." });
  }
});

// حذف تقييم موجود
router.delete("/:reviewId", auth, async (req, res) => {
  try {
    const { reviewId } = req.params;

    // جلب التقييم
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "التقييم غير موجود." });
    }

    // تحقق أن الطالب هو صاحب التقييم أو أنه أدمين
    if (
      review.student.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "ليس لديك صلاحية لحذف هذا التقييم." });
    }

    // حذف التقييم من Array الدورة أيضًا
    const Course = require("./Course");
    const course = await Course.findById(review.course);
    if (course) {
      course.reviews = course.reviews.filter(
        (rId) => rId.toString() !== reviewId
      );
      await course.save();
    }

    // حذف التقييم نفسه
    await review.deleteOne();

    res.json({ message: "تم حذف التقييم بنجاح." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء حذف التقييم." });
  }
});

module.exports = router;
