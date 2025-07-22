/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function CourseDetails() {
  const { id } = useParams(); // id هو courseId من URL
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [error, setError] = useState("");
  const [lessonsError, setLessonsError] = useState("");
  const navigate = useNavigate();

  // جلب بيانات المستخدم الحالي من localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  // جلب بيانات الدورة والتحقق من الاشتراك
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // جلب بيانات الدورة
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        setError("تعذر تحميل بيانات الدورة.");
      } finally {
        setLoading(false);
      }
    };

    // تحقق من الاشتراك في الدورة (للطالب فقط)
    const checkEnrollment = async () => {
      try {
        if (user.role === "student") {
          const res = await axios.get(
            `http://localhost:5000/api/enrollments/my-courses`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          // تحقق هل الطالب مشترك في هذه الدورة
          const enrolled = res.data.some((enr) => enr.course._id === id);
          setIsEnrolled(enrolled);
        } else {
          // المعلم أو الأدمين دائماً يمكنهم رؤية الدروس
          setIsEnrolled(true);
        }
      } catch {
        setIsEnrolled(false);
      }
    };

    fetchCourse();
    checkEnrollment();
  }, [id, token, user.role, navigate]);

  // جلب الدروس إذا كان المستخدم مشترك أو معلم أو أدمين
  useEffect(() => {
    const fetchLessons = async () => {
      if (isEnrolled) {
        try {
          setLessonsError("");
          const res = await axios.get(
            `http://localhost:5000/api/lessons/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setLessons(res.data);
        } catch (err) {
          setLessonsError("تعذر جلب الدروس أو لا تملك صلاحية مشاهدتها.");
        }
      }
    };
    fetchLessons();
  }, [isEnrolled, id, token]);

  // دالة الاشتراك في الدورة (للطلاب فقط)
  const handleEnroll = async () => {
    setSubscribeLoading(true);
    setError("");
    try {
      await axios.post(
        `http://localhost:5000/api/enrollments/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEnrolled(true);
    } catch (err) {
      setError(err.response?.data?.message || "تعذر الاشتراك في الدورة.");
    } finally {
      setSubscribeLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!course) return null;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
      {course.image && (
        <img
          src={course.image}
          alt={course.title}
          className="rounded mb-4 h-60 object-cover"
        />
      )}
      <div className="mb-2 text-gray-700">{course.description}</div>
      <div className="mb-2">
        <span className="text-gray-500">التصنيف: </span>
        {course.category}
      </div>
      <div className="mb-2">
        <span className="text-gray-500">المعلم: </span>
        {course.teacher?.name}
      </div>
      <div className="mb-6 text-gray-500">
        {course.createdAt &&
          `تاريخ الإضافة: ${new Date(course.createdAt).toLocaleDateString()}`}
      </div>

      {/* زر الاشتراك إذا كان طالب وغير مشترك */}
      {user.role === "student" && !isEnrolled && (
        <button
          onClick={handleEnroll}
          disabled={subscribeLoading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded mb-6"
        >
          {subscribeLoading ? "جارٍ الاشتراك..." : "اشترك في الدورة"}
        </button>
      )}

      {/* استعراض الدروس إذا كان مشترك أو معلم أو أدمين */}
      {isEnrolled ? (
        <div>
          <h2 className="text-xl font-semibold mb-4 mt-8">دروس الدورة</h2>
          {lessonsError && (
            <div className="text-red-500 mb-3">{lessonsError}</div>
          )}
          <ul>
            {lessons.length > 0 ? (
              lessons.map((lesson, idx) => (
                <li
                  key={lesson._id}
                  className="mb-3 p-3 border-b flex gap-3 items-center"
                >
                  <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                    {idx + 1}
                  </span>
                  <span className="font-bold">{lesson.title}</span>
                  {/* يمكن إضافة زر عرض التفاصيل أو المحتوى هنا */}
                </li>
              ))
            ) : (
              <div>لا يوجد دروس مضافة بعد.</div>
            )}
          </ul>
        </div>
      ) : user.role === "student" ? (
        <div className="text-center text-gray-600 mt-8">
          يجب الاشتراك في الدورة لمشاهدة الدروس.
        </div>
      ) : null}
    </div>
  );
}
