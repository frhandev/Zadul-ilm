import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { Link } from "react-router-dom";
import { NextArrow, PrevArrow } from "../components/CarouselArrow";
import CourseCard from "./CourseCard";

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
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
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
    <section className="max-w-6xl mx-auto py-12 w-full flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold mb-6 text-center">أحدث الدورات</h2>
      {loading ? (
        <div className="text-center">جارٍ التحميل...</div>
      ) : courses.length === 0 ? (
        <div className="text-center text-gray-500">
          لا يوجد دورات مضافة بعد.
        </div>
      ) : (
        <Slider
          {...settings}
          className="w-full flex flex-row justify-center items-center h-fit"
        >
          {courses.map((course) => (
            <div key={course._id} className="p-2">
              <CourseCard course={course} />
            </div>
          ))}
        </Slider>
      )}
      <div className="text-center mt-8">
        <Link to="/courses" className="underline text-primary font-bold">
          استعراض جميع الدورات &larr;
        </Link>
      </div>
    </section>
  );
}
