import React, { useState } from "react";
import axios from "axios";

export default function EditCourseForm({ course, onSuccess, onCancel }) {
  const [title, setTitle] = useState(course.title || "");
  const [description, setDescription] = useState(course.description || "");
  const [category, setCategory] = useState(course.category || "");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    if (imageFile) formData.append("image", imageFile);

    try {
      await axios.put(
        `https://zadul-ilm-1.onrender.com/courses/${course._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء تعديل الدورة.");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded shadow p-6 space-y-4"
    >
      <h2 className="font-bold text-lg mb-3">تعديل بيانات الدورة</h2>
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
        rows={4}
        required
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
      <input
        type="file"
        accept="image/*"
        className="w-full border rounded p-2"
        onChange={(e) => setImageFile(e.target.files[0])}
      />
      {course.image && (
        <img
          src={`https://zadul-ilm-1.onrender.com/api${course.image}`}
          alt="صورة الدورة الحالية"
          className="h-32 mb-2 rounded"
        />
      )}
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-yellow-600 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "جارٍ الحفظ..." : "حفظ التعديلات"}
        </button>
        {onCancel && (
          <button
            type="button"
            className="bg-gray-400 text-white p-2 rounded"
            onClick={onCancel}
            disabled={loading}
          >
            إلغاء
          </button>
        )}
      </div>
    </form>
  );
}
