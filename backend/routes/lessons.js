const express = require("express");
const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const auth = require("../middleware/auth");

const router = express.Router();

// إضافة درس جديد (معلم فقط)
router.post("/:courseId", auth, async (req, res) => {
  try {
    // التحقق من الصلاحية
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "الصلاحية فقط للمعلمين أو الإدارة." });
    }

    const { title, content, order } = req.body;
    const courseId = req.params.courseId;

    // تحقق أن الدورة موجودة
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "الدورة غير موجودة." });
    }

    // تحقق أن المعلم هو صاحب الدورة (أو أدمين)
    if (
      course.teacher.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "ليس لديك صلاحية لإضافة درس في هذه الدورة." });
    }

    // إنشاء الدرس
    const lesson = new Lesson({
      title,
      content,
      order,
      course: courseId,
    });

    await lesson.save();

    // أضف الدرس لقائمة الدروس في الدورة
    course.lessons.push(lesson._id);
    await course.save();

    res.status(201).json({ message: "تم إضافة الدرس بنجاح!", lesson });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء إضافة الدرس." });
  }
});

// جلب كل الدروس لدورة
router.get("/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const lessons = await Lesson.find({ course: courseId }).sort("order");
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب الدروس." });
  }
});

// تعديل درس محدد
router.put("/:lessonId", auth, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { title, content, order } = req.body;

    // اجلب الدرس من الداتا بيس
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "الدرس غير موجود." });
    }

    // اجلب الدورة المرتبطة بهذا الدرس
    const course = await Course.findById(lesson.course);

    // تحقق أن المستخدم صاحب الدورة أو أدمين
    if (
      course.teacher.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "ليس لديك صلاحية لتعديل هذا الدرس." });
    }

    // عدّل بيانات الدرس
    if (title) lesson.title = title;
    if (content) lesson.content = content;
    if (order) lesson.order = order;

    await lesson.save();

    res.json({ message: "تم تعديل الدرس بنجاح.", lesson });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء تعديل الدرس." });
  }
});

// حذف درس محدد
router.delete("/:lessonId", auth, async (req, res) => {
  try {
    const { lessonId } = req.params;

    // اجلب الدرس من الداتا بيس
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "الدرس غير موجود." });
    }

    // اجلب الدورة المرتبطة بهذا الدرس
    const course = await Course.findById(lesson.course);

    // تحقق أن المستخدم صاحب الدورة أو أدمين
    if (
      course.teacher.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "ليس لديك صلاحية لحذف هذا الدرس." });
    }

    // احذف الدرس
    await lesson.deleteOne();

    // احذفه أيضًا من مصفوفة الدروس في الدورة
    course.lessons = course.lessons.filter(
      (lId) => lId.toString() !== lessonId
    );
    await course.save();

    res.json({ message: "تم حذف الدرس بنجاح." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء حذف الدرس." });
  }
});

module.exports = router;
