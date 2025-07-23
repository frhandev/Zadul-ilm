import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import CourseCard from "../components/CourseCard";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
      return;
    }

    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      try {
        if (user.role === "student") {
          const res = await axios.get(
            "http://localhost:5000/api/enrollments/my-courses",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setCourses(res.data.map((enr) => enr.course));
        } else if (user.role === "teacher") {
          const res = await axios.get(
            "http://localhost:5000/api/courses?mycourses=1",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setCourses(res.data);
        }
      } catch (err) {
        setCourses([]);
        setError(
          err.response?.data?.message ||
            "تعذر تحميل الدورات. تحقق من الاتصال أو الصلاحية."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [navigate, token]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8 text-center">لوحة التحكم</h1>

      <div className="mb-6 p-4 bg-gray-100 rounded flex flex-col md:flex-row items-center gap-4">
        <span className="font-bold text-lg text-green-700">
          مرحبًا، {user.name}
        </span>
        <span className="text-gray-600">
          ({user.role === "student" ? "طالب" : "معلم"})
        </span>
        <Link to="/profile" className="text-blue-600 hover:underline ml-auto">
          الملف الشخصي
        </Link>
        {user.role === "teacher" && (
          <Link
            to="/add-course"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
          >
            إضافة دورة جديدة
          </Link>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-4">
        {user.role === "student" ? "دوراتي المشتركة" : "دوراتي كمعلم"}
      </h2>

      {loading ? (
        <div className="text-center">جاري التحميل...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : courses.length === 0 ? (
        <div className="text-center text-gray-500">لا يوجد دورات بعد.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {courses
            .filter((course) => course && course._id) // حماية إضافية من العناصر غير الصحيحة
            .map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
        </div>
      )}
    </div>
  );
}
