// src/components/CourseCard.jsx
import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <Link
      target="blank"
      to={`/courses/${course._id}`}
      className="bg-white rounded-lg shadow p-4 flex flex-col h-[320px] min-h-[270px] sm:w-full transition-all hover:shadow-lg shadow-primary hover:scale-101 duration-300 ease-in-out"
    >
      <img
        src={
          course.image ? `http://localhost:5000${course.image}` : "/default.png"
        }
        alt={course.title}
        className="h-[50%] object-cover rounded mb-3 mx-auto w-full "
        loading="lazy"
      />
      <h3 className="font-bold mb-1 truncate">{course.title}</h3>
      <div className="text-sm text-gray-600 mb-1 truncate">
        {course.teacher?.name}
      </div>
      <div className="flex items-center gap-2 text-yellow-600 text-sm mt-1">
        <span>⭐</span>
        <span>
          {course.averageRating ? course.averageRating.toFixed(1) : "0"}
        </span>
        <span className="text-gray-400">
          ({course.reviewsCount || 0} تقييم)
        </span>
      </div>
      <div className="mb-2 text-gray-500 text-xs">{course.category}</div>
    </Link>
  );
}
