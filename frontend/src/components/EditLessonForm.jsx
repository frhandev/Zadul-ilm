import React, { useState } from "react";
import axios from "axios";

export default function EditLessonForm({ lesson, onSuccess, onCancel }) {
  const [title, setTitle] = useState(lesson.title || "");
  const [content, setContent] = useState(lesson.content || "");
  const [order, setOrder] = useState(lesson.order || "");
  const [videoUrl, setVideoUrl] = useState(lesson.videoUrl || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.put(
        `http://localhost:5000/api/lessons/${lesson._id}`,
        { title, content, order, videoUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLoading(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message ||
          "حدث خطأ أثناء تعديل الدرس. تأكد من البيانات أو الصلاحية."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-yellow-50 p-4 rounded shadow space-y-3 mb-6"
    >
      <h3 className="font-bold mb-2">تعديل الدرس</h3>
      <input
        className="w-full border rounded p-2"
        placeholder="عنوان الدرس"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="w-full border rounded p-2"
        placeholder="محتوى الدرس"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        required
      />
      <input
        className="w-full border rounded p-2"
        placeholder="ترتيب الدرس (اختياري)"
        value={order}
        onChange={(e) => setOrder(e.target.value)}
        type="number"
        min={1}
      />
      <input
        className="w-full border rounded p-2"
        placeholder="رابط الفيديو (اختياري)"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-yellow-500 text-white px-4 py-1 rounded"
          disabled={loading}
        >
          {loading ? "جارٍ التعديل..." : "حفظ التعديلات"}
        </button>
        {onCancel && (
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-1 rounded"
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
