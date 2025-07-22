import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const categories = [
  "عقيدة",
  "فقه",
  "حديث",
  "تفسير",
  "عربي",
  "تجويد",
  "أخلاق",
  "تاريخ",
  "علوم القرآن",
];

export default function AddCourse() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // الحماية: يسمح فقط للمعلم بالدخول
  if (!user || user.role !== "teacher") {
    return (
      <div className="text-center py-16 text-red-600 font-bold text-xl">
        ليس لديك صلاحية دخول هذه الصفحة
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    if (imageFile) formData.append("image", imageFile);

    try {
      await axios.post("http://localhost:5000/api/courses", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("تمت إضافة الدورة بنجاح!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء إضافة الدورة.");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">إضافة دورة جديدة</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded shadow p-6 space-y-4"
      >
        <input
          type="file"
          accept="image/*"
          className="w-full border rounded p-2"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        <input
          className="w-full border rounded p-2"
          placeholder="عنوان الدورة"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full border rounded p-2"
          placeholder="وصف الدورة"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
        />
        <select
          className="w-full border rounded p-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">اختر التصنيف</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {error && <div className="text-red-500 text-center">{error}</div>}
        {success && <div className="text-green-600 text-center">{success}</div>}
        <button
          type="submit"
          className="w-full bg-green-700 text-white p-2 rounded hover:bg-green-800"
        >
          إضافة الدورة
        </button>
      </form>
    </div>
  );
}
