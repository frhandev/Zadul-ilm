const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true }, // نص أو شرح مكتوب
  videoUrl: { type: String, default: "" }, // رابط فيديو (يوتيوب/فيميو أو رابط ملف mp4)
  attachments: [{ type: String }], // روابط ملفات إضافية (PDF, DOCX, ZIP...)
  order: { type: Number, default: 0 },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Lesson", lessonSchema);
