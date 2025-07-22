const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");

// إعداد dotenv لقراءة متغيرات البيئة من ملف .env
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // قراءة body بصيغة JSON

// استيراد الراوتات
app.use("/api/auth", authRoutes);

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
