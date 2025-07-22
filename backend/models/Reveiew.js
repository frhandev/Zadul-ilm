const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
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
    const Course = require("../models/Course");
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

module.exports = mongoose.model("Review", reviewSchema);
