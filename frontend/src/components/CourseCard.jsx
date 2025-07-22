// src/components/CourseCard.jsx
import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <Link
      target="blank"
      to={`/courses/${course._id}`}
      className="bg-white rounded-lg shadow p-4 flex flex-col h-full min-h-[270px] transition-all hover:shadow-xl"
    >
      <img
        src={
          course.image ? `http://localhost:5000${course.image}` : "/default.png"
        }
        alt={course.title}
        className="h-32 object-cover rounded mb-3 mx-auto w-full"
        loading="lazy"
      />
      <h3 className="font-bold mb-1 truncate">{course.title}</h3>
      <div className="text-sm text-gray-600 mb-1 truncate">
        {course.teacher?.name}
      </div>
      <div className="mb-2 text-gray-500 text-xs">
        {course.createdAt && new Date(course.createdAt).toLocaleDateString()}
      </div>
    </Link>
  );
}
