import { Link } from "react-router-dom";
import logo from "../assets/زاد_العلم-removebg-preview.png";
import LatestCoursesCarousel from "../components/LatestCoursesCarousel";
import { useEffect, useState } from "react";

export default function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("https://zadul-ilm-1.onrender.com/api/courses") // استبدل بالرابط الصحيح في مشروعك
      .then((res) => res.json())
      .then((data) => {
        const cats = [...new Set(data.map((c) => c.category).filter(Boolean))];
        setCategories(cats);
      });
  }, []);
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 py-16 text-center h-fit">
        <img src={logo} alt="زاد العلم" className="mx-auto mb-4 w-100" />
        <p className="mb-8 text-lg text-gray-700">
          منصتك العربية لتعلم العلوم الشرعية والمعارف المعاصرة من أفضل المعلمين.
        </p>
        <Link
          to="/courses"
          className="bg-primary text-white px-6 py-3 rounded text-lg transition-all duration-300 hover:scale-125 hover:shadow-2xl"
        >
          استعرض الدورات
        </Link>
      </div>

      {/* Features Section */}
      <div className="py-12 max-w-4xl mx-auto flex justify-center items-center gap-8 text-center flex-col sm:flex-row w-[80%]">
        <div className="cursor-default flex flex-col justify-center items-center w-[100%] sm:w-[30%] border py-10 shadow-md hover:shadow-xl transition-all duration-300 shadow-primary rounded-2xl border-primary">
          <div className="text-primary text-4xl mb-2 w-[75%]">🎥</div>
          <h3 className="font-bold text-lg mb-2 w-[75%]">دروس تفاعلية</h3>
          <p className="text-gray-600 w-[75%]">
            فيديوهات وملفات وأسئلة مباشرة في كل درس.
          </p>
        </div>
        <div className="cursor-default flex flex-col justify-center items-center w-[100%] sm:w-[30%] border py-10 shadow-md hover:shadow-xl transition-all duration-300 shadow-primary rounded-2xl border-primary">
          <div className="text-green-600 text-4xl mb-2 w-[75%]">🧑‍🏫</div>
          <h3 className="font-bold text-lg mb-2 w-[75%]">أفضل المعلمين</h3>
          <p className="text-gray-600 w-[75%]">
            مدرسون مختارون بخبرة وسمعة مميزة.
          </p>
        </div>
        <div className=" cursor-default flex flex-col justify-center items-center w-[100%] sm:w-[30%] border py-10 shadow-md hover:shadow-xl transition-all duration-300 shadow-primary rounded-2xl border-primary">
          <div className="text-green-600 text-4xl mb-2 w-[75%]">📱</div>
          <h3 className="font-bold text-lg mb-2 w-[75%]">واجهة سهلة</h3>
          <p className="text-gray-600 w-[75%]">
            تجربة مستخدم متجاوبة وسهلة لكل الأعمار.
          </p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto py-10">
        <h2 className="text-xl font-bold mb-6 text-center">التصنيفات</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/courses?category=${encodeURIComponent(cat)}`}
              className="px-5 py-2 bg-primary rounded-full font-bold text-white hover:bg-[#94b551] hover:scale-105 transition duration-300"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
      <LatestCoursesCarousel />
    </div>
  );
}
