import React, { useState } from "react";
import axios from "axios";

export default function AddLessonForm({ courseId, onSuccess, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [order, setOrder] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!title || !content || !videoUrl) {
      setError("يرجى تعبئة جميع الحقول المطلوبة");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `https://zadul-ilm-1.onrender.com/api/${courseId}`,
        {
          title,
          content,
          order,
          videoUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTitle("");
      setContent("");
      setOrder("");
      setVideoUrl("");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء إضافة الدرس.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded mb-5">
      <h2 className="font-bold mb-2">إضافة درس جديد</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <input
        className="w-full mb-2 border rounded p-2"
        placeholder="عنوان الدرس"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="w-full mb-2 border rounded p-2"
        placeholder="محتوى الدرس"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        className="w-full mb-2 border rounded p-2"
        placeholder="ترتيب الدرس (اختياري)"
        type="number"
        value={order}
        onChange={(e) => setOrder(e.target.value)}
      />
      <input
        className="w-full mb-2 border rounded p-2"
        placeholder="رابط فيديو يوتيوب (مثال: https://www.youtube.com/watch?v=...)"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        required
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 text-white px-4 py-2 rounded"
        >
          {loading ? "جاري الإضافة..." : "إضافة الدرس"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}
