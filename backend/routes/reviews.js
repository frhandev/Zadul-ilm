const express = require("express");
const Review = require("../models/Review");
const Course = require("../models/Course");
const auth = require("../middleware/auth");

const router = express.Router();

// إضافة تقييم
router.post("/course/:courseId", auth, async (req, res) => {
  try {
    // فقط الطالب يضيف تقييم
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "فقط الطلاب يمكنهم إضافة تقييم." });
    }
    const { comment, rating } = req.body;
    if (!comment || !rating) {
      return res.status(400).json({ message: "يرجى إدخال جميع الحقول." });
    }
    // تحقق أن الطالب لم يقيّم من قبل نفس الدورة (مرة واحدة فقط)
    const exists = await Review.findOne({
      course: req.params.courseId,
      user: req.user.userId,
    });
    if (exists) {
      return res
        .status(400)
        .json({ message: "لقد أضفت تقييمًا مسبقًا لهذه الدورة." });
    }
    const review = new Review({
      course: req.params.courseId,
      user: req.user.userId,
      comment,
      rating,
    });
    await review.save();
    await review.populate("user", "name");
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء إضافة التقييم." });
  }
});

// routes/reviews.js
router.get("/course/:courseId", auth, async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.courseId })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "تعذر جلب التقييمات." });
  }
});

router.delete("/:reviewId", auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "التعليق غير موجود" });

    // فقط صاحب التعليق أو الأدمن
    if (
      review.user.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "ليس لديك صلاحية حذف التعليق" });
    }

    await review.deleteOne();
    res.json({ message: "تم حذف التعليق بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء الحذف" });
  }
});

router.put("/:reviewId", auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "التعليق غير موجود" });

    // فقط صاحب التعليق أو الأدمن
    if (
      review.user.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "ليس لديك صلاحية التعديل" });
    }

    const { comment, rating } = req.body;
    if (comment) review.comment = comment;
    if (rating) review.rating = rating;
    await review.save();

    res.json({ message: "تم تعديل التعليق بنجاح", review });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء التعديل" });
  }
});

module.exports = router;
