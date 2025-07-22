import { Link } from "react-router-dom";
import logo from "../assets/زاد_العلم-removebg-preview.png";
import LatestCoursesCarousel from "../components/LatestCoursesCarousel";

export default function Home() {
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
      <LatestCoursesCarousel />
    </div>
  );
}
