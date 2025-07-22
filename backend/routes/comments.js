const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const auth = require("../middleware/auth");

// إضافة تعليق
router.post("/:lessonId", auth, async (req, res) => {
  try {
    const comment = new Comment({
      lesson: req.params.lessonId,
      user: req.user.userId,
      text: req.body.text,
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء إضافة التعليق." });
  }
});

// جلب التعليقات لدرس معين
router.get("/:lessonId", async (req, res) => {
  try {
    const comments = await Comment.find({ lesson: req.params.lessonId })
      .populate("user", "name")
      .sort("-createdAt");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب التعليقات." });
  }
});

module.exports = router;
