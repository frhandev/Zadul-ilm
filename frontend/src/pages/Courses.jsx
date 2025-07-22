/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // تحقق إذا المستخدم مسجل دخول (اختياري)
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // جلب الدورات من الباكند
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/courses");
        setCourses(res.data);
      } catch (err) {
        setError("تعذر تحميل الدورات.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [navigate]);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">الدورات المتاحة</h1>
      {loading ? (
        <div className="text-center">جاري التحميل...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow p-5 flex flex-col"
            >
              {course.image && (
                <img
                  src={course.image}
                  alt={course.title}
                  className="rounded mb-3 h-40 object-cover"
                />
              )}
              <h2 className="text-xl font-bold mb-2">{course.title}</h2>
              <div className="mb-2 text-gray-700">{course.category}</div>
              <div className="mb-4 text-gray-500 line-clamp-2">
                {course.description}
              </div>
              <div className="text-sm mb-2">
                <span className="text-gray-500">المعلم: </span>
                {course.teacher?.name}
              </div>
              <Link
                to={`/courses/${course._id}`}
                className="mt-auto text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              >
                مشاهدة الدورة
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
