// SearchPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import CourseCard from "../components/CourseCard";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {
  const query = useQuery();
  const searchTerm = query.get("query") || "";
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!searchTerm) return;
    setLoading(true);
    axios
      .get(
        `http://localhost:5000/api/courses?search=${encodeURIComponent(
          searchTerm
        )}`
      )
      .then((res) => setCourses(res.data))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [searchTerm]);

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8 text-center">
        نتائج البحث عن: "{searchTerm}"
      </h1>
      {loading ? (
        <div className="text-center">جاري البحث...</div>
      ) : courses.length === 0 ? (
        <div className="text-center text-gray-500">لا يوجد نتائج مطابقة.</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
