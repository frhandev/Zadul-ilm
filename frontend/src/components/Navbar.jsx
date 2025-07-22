import { Link } from "react-router-dom";
import logo from "../assets/زاد_العلم-removebg-preview.png";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <nav className="bg-white shadow flex justify-between items-center px-6 py-4">
      <Link to="/">
        <div className="flex items-center gap-2">
          <img src={logo} alt="زاد العلم" className="w-10" />
          <span className="font-bold text-green-700 text-xl">زاد العلم</span>
        </div>
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/courses" className="hover:text-green-600">
          الدورات
        </Link>
        {user?.name ? (
          <>
            <Link to="/dashboard" className="hover:text-green-600">
              مرحبًا، {user.name.split(" ")[0]}
            </Link>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
              className="text-red-600 hover:underline"
            >
              تسجيل خروج
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-green-600 text-white px-4 py-1 rounded"
          >
            تسجيل الدخول
          </Link>
        )}
      </div>
    </nav>
  );
}
