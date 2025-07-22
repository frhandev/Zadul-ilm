import React, { useState } from "react";
import axios from "axios";

export default function AddLessonForm({ courseId, onSuccess, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [order, setOrder] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("order", order);
    if (videoFile) formData.append("video", videoFile);

    try {
      await axios.post(
        `http://localhost:5000/api/lessons/${courseId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setTitle("");
      setContent("");
      setOrder("");
      setVideoFile(null);
      setLoading(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message ||
          "حدث خطأ أثناء إضافة الدرس. تأكد من البيانات أو الصلاحية."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 p-4 rounded shadow space-y-3 mb-6"
    >
      <h3 className="font-bold mb-2">إضافة درس جديد</h3>
      <input
        className="w-full border rounded p-2"
        placeholder="عنوان الدرس"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="file"
        accept="video/*"
        className="w-full border rounded p-2"
        onChange={(e) => setVideoFile(e.target.files[0])}
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
        placeholder="ترتيب الدرس (اختياري، مثال: 1)"
        value={order}
        onChange={(e) => setOrder(e.target.value)}
        type="number"
        min={1}
      />
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-1 rounded"
          disabled={loading}
        >
          {loading ? "جارٍ الإضافة..." : "إضافة الدرس"}
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
