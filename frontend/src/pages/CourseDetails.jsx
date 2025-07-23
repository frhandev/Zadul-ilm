/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import AddLessonForm from "../components/AddLessonForm";
import EditLessonForm from "../components/EditLessonForm";
import EditCourseForm from "../components/EditCourseForm";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [error, setError] = useState("");
  const [lessonsError, setLessonsError] = useState("");
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editingCourse, setEditingCourse] = useState(false);

  // ----- التقييمات -----
  const [reviews, setReviews] = useState([]);
  const [reviewsError, setReviewsError] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  // --- جلب بيانات الدورة والتحقق من الاشتراك ---
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://zadul-ilm-1.onrender.com/api/courses/${id}`
        );
        setCourse(res.data);
      } catch (err) {
        setError("تعذر تحميل بيانات الدورة.");
      } finally {
        setLoading(false);
      }
    };

    const checkEnrollment = async () => {
      try {
        if (user.role === "student") {
          const res = await axios.get(
            "https://zadul-ilm-1.onrender.com/api/enrollments/my-courses",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          // تحقق وطباعة لتشخيص الأخطاء
          // (قد تحتوي بعض العناصر course = null)
          // اطبع القيم للتأكد
          // console.log("enrollments:", res.data, "courseId param:", id);

          const enrolled = res.data.some(
            (enr) =>
              enr.course && String(enr.course._id).trim() === String(id).trim()
          );
          setIsEnrolled(enrolled);
        } else {
          setIsEnrolled(true);
        }
      } catch {
        setIsEnrolled(false);
      }
    };

    fetchCourse();
    checkEnrollment();
  }, [id, token, user.role, navigate]);

  // --- جلب الدروس ---
  const fetchLessons = async () => {
    if (isEnrolled) {
      try {
        setLessonsError("");
        const res = await axios.get(
          `https://zadul-ilm-1.onrender.com/api/lessons/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLessons(res.data);
      } catch (err) {
        setLessonsError("تعذر جلب الدروس أو لا تملك صلاحية مشاهدتها.");
      }
    }
  };
  useEffect(() => {
    fetchLessons();
  }, [isEnrolled, id, token]);

  // --- جلب التقييمات ---
  const fetchReviews = async () => {
    try {
      setReviewsError("");
      const res = await axios.get(
        `https://zadul-ilm-1.onrender.com/api/reviews/course/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(res.data);
    } catch (err) {
      setReviewsError("تعذر جلب التقييمات.");
    }
  };
  useEffect(() => {
    fetchReviews();
  }, [id, token]);

  // --- الاشتراك في الدورة (للطلاب) ---
  const handleEnroll = async () => {
    setSubscribeLoading(true);
    setError("");
    try {
      await axios.post(
        `https://zadul-ilm-1.onrender.com/api/enrollments/${id}`,
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

  // --- حذف الدرس ---
  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("هل أنت متأكد من حذف الدرس؟")) return;
    try {
      await axios.delete(
        `https://zadul-ilm-1.onrender.com/api/lessons/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchLessons();
    } catch (err) {
      alert(err.response?.data?.message || "تعذر حذف الدرس!");
    }
  };

  // --- تعديل الدرس ---
  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
  };

  // --- حذف التعليق ---
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("هل تريد حذف التعليق؟")) return;
    try {
      await axios.delete(
        `https://zadul-ilm-1.onrender.com/api/reviews/${reviewId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || "خطأ أثناء حذف التعليق!");
    }
  };

  // --- بدء التعديل على تعليق ---
  const startEditReview = (review) => {
    setEditingReview(review);
    setEditText(review.comment);
    setEditRating(review.rating);
  };

  // --- حفظ التعديل على تعليق ---
  const handleUpdateReview = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://zadul-ilm-1.onrender.com/api/reviews/${editingReview._id}`,
        { comment: editText, rating: editRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingReview(null);
      fetchReviews();
    } catch (err) {
      alert("خطأ أثناء تعديل التعليق!");
    }
  };

  // --- صلاحية تعديل/حذف الدورة أو الدروس ---
  const isTeacherOwnerOrAdmin =
    user &&
    (user.role === "admin" ||
      (user.role === "teacher" &&
        (course?.teacher?._id === user._id ||
          course?.teacher === user._id ||
          course?.teacher?.id === user._id)));

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!course) return null;

  return (
    <div className="max-w-3xl mx-auto py-10">
      {/* بيانات الدورة */}
      <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
      {course.image && (
        <img
          src={`https://zadul-ilm-1.onrender.com${course.image}`}
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

      {/* زر تعديل الدورة */}
      {isTeacherOwnerOrAdmin && (
        <button
          onClick={() => setEditingCourse(true)}
          className="bg-yellow-600 text-white px-4 py-2 rounded ml-2"
        >
          تعديل الدورة
        </button>
      )}
      {editingCourse && (
        <EditCourseForm
          course={course}
          onSuccess={() => {
            setEditingCourse(false);
            axios
              .get(`https://zadul-ilm-1.onrender.com/api/courses/${id}`)
              .then((res) => setCourse(res.data));
          }}
          onCancel={() => setEditingCourse(false)}
        />
      )}
      {isTeacherOwnerOrAdmin && (
        <>
          <button
            onClick={async () => {
              if (!window.confirm("هل تريد حذف الدورة بشكل نهائي؟")) return;
              try {
                await axios.delete(
                  `https://zadul-ilm-1.onrender.com/api/courses/${course._id}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
                alert("تم حذف الدورة بنجاح.");
                navigate("/courses");
              } catch (err) {
                alert(
                  err.response?.data?.message || "حدث خطأ أثناء حذف الدورة!"
                );
              }
            }}
            className="bg-red-700 text-white px-4 py-2 rounded ml-2"
          >
            حذف الدورة
          </button>
        </>
      )}

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

          {/* نموذج تعديل الدرس */}
          {editingLesson && (
            <EditLessonForm
              lesson={editingLesson}
              onSuccess={() => {
                setEditingLesson(null);
                fetchLessons();
              }}
              onCancel={() => setEditingLesson(null)}
            />
          )}

          {/* زر إضافة درس جديد */}
          {isTeacherOwnerOrAdmin && (
            <button
              onClick={() => setShowAddLesson((v) => !v)}
              className="bg-green-700 text-white px-4 py-2 rounded my-4"
            >
              {showAddLesson ? "إخفاء النموذج" : "إضافة درس جديد"}
            </button>
          )}

          {/* نموذج إضافة الدرس */}
          {showAddLesson && (
            <AddLessonForm
              courseId={course._id}
              onSuccess={() => {
                setShowAddLesson(false);
                fetchLessons();
              }}
              onCancel={() => setShowAddLesson(false)}
            />
          )}

          {/* قائمة الدروس */}
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
                  {isTeacherOwnerOrAdmin && (
                    <>
                      <button
                        className="bg-yellow-400 px-2 py-1 rounded text-white text-xs"
                        onClick={() => handleEditLesson(lesson)}
                      >
                        تعديل
                      </button>
                      <button
                        className="bg-red-500 px-2 py-1 rounded text-white text-xs"
                        onClick={() => handleDeleteLesson(lesson._id)}
                      >
                        حذف
                      </button>
                    </>
                  )}
                  <Link
                    to={`/lessons/${lesson._id}`}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    مشاهدة
                  </Link>
                </li>
              ))
            ) : (
              <div>لا يوجد دروس مضافة بعد.</div>
            )}
          </ul>

          {/* نموذج إضافة تقييم (طالب مشترك ولم يقيم سابقًا) */}
          {user.role === "student" &&
            isEnrolled &&
            !reviews.some((r) => r.user?._id === user._id) && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await axios.post(
                      `https://zadul-ilm-1.onrender.com/api/reviews/course/${course._id}`,
                      { comment: editText, rating: editRating },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setEditText("");
                    setEditRating(5);
                    fetchReviews();
                  } catch (err) {
                    alert(
                      err.response?.data?.message ||
                        "حدث خطأ أثناء إضافة التقييم!"
                    );
                  }
                }}
                className="mb-8 bg-gray-50 p-4 rounded"
              >
                <h3 className="font-semibold mb-2">أضف تقييمك للدورة</h3>
                <textarea
                  className="w-full border rounded p-2 mb-2"
                  placeholder="اكتب تعليقك..."
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  required
                />
                <div className="flex items-center gap-2 mb-2">
                  <span>التقييم:</span>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={editRating}
                    onChange={(e) => setEditRating(Number(e.target.value))}
                    className="border rounded px-2 py-1 w-16"
                    required
                  />
                  <span>من 5</span>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                  إرسال التقييم
                </button>
              </form>
            )}
          {/* ====== قسم التقييمات والتعليقات ====== */}
          <h2 className="text-xl font-semibold my-8">تقييمات الطلاب</h2>
          {reviewsError && (
            <div className="text-red-500 mb-3">{reviewsError}</div>
          )}
          {reviews.map((review) =>
            editingReview && editingReview._id === review._id ? (
              // نموذج تعديل التعليق
              <form
                key={review._id}
                onSubmit={handleUpdateReview}
                className="bg-yellow-50 p-3 rounded mb-2"
              >
                <textarea
                  className="w-full border p-1 mb-2"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={2}
                  required
                />
                <input
                  type="number"
                  className="border rounded p-1 w-16"
                  min={1}
                  max={5}
                  value={editRating}
                  onChange={(e) => setEditRating(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-yellow-600 text-white p-1 rounded mx-2"
                >
                  حفظ
                </button>
                <button
                  type="button"
                  className="bg-gray-400 text-white p-1 rounded"
                  onClick={() => setEditingReview(null)}
                >
                  إلغاء
                </button>
              </form>
            ) : (
              // عرض التعليق العادي
              <div key={review._id} className="mb-3 p-3 border rounded">
                <div>
                  <span className="font-bold">{review.user?.name}</span>
                  <span className="mx-2 text-gray-400 text-xs">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="my-1">{review.comment}</div>
                <div>⭐ {review.rating}</div>
                {(user._id === review.user?._id || user.role === "admin") && (
                  <div className="flex gap-2 mt-2">
                    <button
                      className="text-yellow-700 text-xs"
                      onClick={() => startEditReview(review)}
                    >
                      تعديل
                    </button>
                    <button
                      className="text-red-600 text-xs"
                      onClick={() => handleDeleteReview(review._id)}
                    >
                      حذف
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      ) : user.role === "student" ? (
        <div className="text-center text-gray-600 mt-8">
          يجب الاشتراك في الدورة لمشاهدة الدروس.
        </div>
      ) : null}
    </div>
  );
}
