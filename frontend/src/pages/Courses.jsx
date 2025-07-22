/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import CourseCard from "../components/CourseCard";
import { Link, useLocation } from "react-router-dom";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/courses") // استبدل بالرابط الصحيح في مشروعك
      .then((res) => res.json())
      .then((data) => {
        const cats = [...new Set(data.map((c) => c.category).filter(Boolean))];
        setCategories(cats);
      });
  }, []);

  // جلب التصنيف من رابط الصفحة
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedCat = params.get("category") || "all";

  useEffect(() => {
    fetch("http://localhost:5000/api/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      });
  }, []);

  // فلترة حسب التصنيف الموجود في الـURL
  const filteredCourses =
    selectedCat === "all"
      ? courses
      : courses.filter((c) => c.category === selectedCat);

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">الدورات</h1>
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((cat) => (
          <Link
            key={cat}
            to={`/courses?category=${encodeURIComponent(cat)}`}
            className="px-5 py-2 bg-green-100 rounded-full font-bold text-green-700 hover:bg-green-200 transition"
          >
            {cat}
          </Link>
        ))}
      </div>
      {loading ? (
        <div className="text-center">جارٍ التحميل...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          لا يوجد دورات بهذا التصنيف.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
