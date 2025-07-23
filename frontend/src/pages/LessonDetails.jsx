import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";

export default function LessonDetails() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // جلب التعليقات
  useEffect(() => {
    const fetchComments = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/comments/${lessonId}`
      );
      setComments(res.data);
    };
    fetchComments();
  }, [lessonId]);

  // إضافة تعليق
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await axios.post(
      `http://localhost:5000/api/comments/${lessonId}`,
      { text: newComment },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewComment("");
    // جلب التعليقات مجددًا بعد الإضافة
    const res = await axios.get(
      `http://localhost:5000/api/comments/${lessonId}`
    );
    setComments(res.data);
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/lessons/view/${lessonId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLesson(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "تعذر تحميل بيانات الدرس أو لا تملك صلاحية مشاهدته."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId, token, navigate]);

  function youtubeUrlToEmbed(url) {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    // رابط مختصر
    const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (short && short[1]) {
      return `https://www.youtube.com/embed/${short[1]}`;
    }
    return url; // إذا كان أصلًا embed
  }

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!lesson) return null;

  return (
    <div className="flex flex-col justify-center items-center sm:w-[50%] w-[90%] mx-[5%] sm:mx-[25%] min-h-[80vh]">
      <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
      {/* عرض فيديو يوتيوب فقط */}

      {lesson.videoUrl && (
        <iframe
          width="100%"
          height="420"
          src={youtubeUrlToEmbed(lesson.videoUrl)}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ borderRadius: "12px", marginBottom: 20 }}
        />
      )}

      <div className="mb-4">{lesson.content}</div>
      {lesson.attachments && lesson.attachments.length > 0 && (
        <div className="mb-5">
          <h3 className="font-bold mb-2">ملفات الدرس:</h3>
          <ul className="list-disc pl-5">
            {lesson.attachments.map((url, idx) => (
              <li key={idx}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  تحميل الملف {idx + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-8 w-[100%]">
        <h3 className="font-bold mb-3">التعليقات:</h3>
        <form onSubmit={handleAddComment} className="flex mb-3 gap-2">
          <input
            className="flex-1 border p-2 rounded"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="أضف تعليقك..."
          />
          <button className="bg-blue-600 text-white px-4 rounded" type="submit">
            إرسال
          </button>
        </form>
        <ul className=" w-[100%]">
          {comments.map((c) => (
            <li key={c._id} className="mb-2">
              <span className="font-bold text-gray-700">{c.user?.name}: </span>
              {c.text}
              <span className="text-xs text-gray-400 ml-2">
                {new Date(c.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
