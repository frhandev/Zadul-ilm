import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { Link } from "react-router-dom";

export default function LatestCoursesCarousel() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // جلب أحدث 10 دورات من السيرفر
    axios
      .get("http://localhost:5000/api/courses?limit=10&sort=createdAt-desc")
      .then((res) => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // إعدادات الكاروسيل
  const settings = {
    rtl: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // عدل الرقم حسب رغبتك وشاشتك
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="max-w-6xl mx-auto py-12 w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">أحدث الدورات</h2>
      {loading ? (
        <div className="text-center">جارٍ التحميل...</div>
      ) : courses.length === 0 ? (
        <div className="text-center text-gray-500">
          لا يوجد دورات مضافة بعد.
        </div>
      ) : (
        <Slider {...settings} className="w-full flex flex-row">
          {courses.map((course) => (
            <div key={course._id} className="p-2">
              <div className="bg-white rounded-lg shadow p-4 flex flex-col h-full min-h-[250px]">
                <img
                  src={
                    course.image
                      ? `http://localhost:5000${course.image}`
                      : "/default.png"
                  }
                  alt={course.title}
                  className="h-32 object-cover rounded mb-3 mx-auto w-full"
                />
                <h3 className="font-bold mb-1 truncate">{course.title}</h3>
                <div className="text-sm text-gray-600 mb-1 truncate">
                  {course.teacher?.name}
                </div>
                <div className="mb-2 text-gray-500 text-xs">
                  {new Date(course.createdAt).toLocaleDateString()}
                </div>
                <Link
                  to={`/courses/${course._id}`}
                  className="bg-green-600 text-white px-3 py-1 rounded text-center mt-auto block"
                >
                  عرض الدورة
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      )}
      <div className="text-center mt-8">
        <Link
          to="/courses"
          className="underline text-green-700 hover:text-green-900 font-bold"
        >
          استعراض جميع الدورات &rarr;
        </Link>
      </div>
    </section>
  );
}
