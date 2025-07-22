const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// إعداد dotenv لقراءة متغيرات البيئة من ملف .env
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // قراءة body بصيغة JSON

// استيراد الراوتات
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const courseRoutes = require("./routes/courses");
app.use("/api/courses", courseRoutes);

const lessonRoutes = require("./routes/lessons");
app.use("/api/lessons", lessonRoutes);

const reviewRoutes = require("./routes/reviews");
app.use("/api/reviews", reviewRoutes);

const enrollmentRoutes = require("./routes/enrollments");
app.use("/api/enrollments", enrollmentRoutes);

const commentRoutes = require("./routes/comments");
app.use("/api/comments", commentRoutes);

// راوت تجريبي للتأكد من السيرفر
app.get("/", (req, res) => {
  res.send("Zadulilm API is running...");
});

// ربط قاعدة البيانات
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected ✅");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
