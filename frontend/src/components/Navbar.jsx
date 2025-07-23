import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/زاد_العلم-removebg-preview.png";
import { useState } from "react";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      // ينقلك لصفحة البحث مع تمرير الكلمة بالرابط
      navigate(`/search?query=${encodeURIComponent(searchInput)}`);
      setSearchInput("");
    }
  };
  return (
    <nav className="bg-white shadow flex flex-col md:flex-row justify-between items-center md:px-[20%] px-4 py-4 gap-3">
      <Link to="/">
        <div className="flex items-center gap-2">
          <img src={logo} alt="زاد العلم" className="w-20" />
        </div>
      </Link>
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-2 w-full md:w-[50%] h-20"
      >
        <input
          type="text"
          placeholder="ابحث عن دورة..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border px-3 py-1 rounded w-full md:w-[80%]"
        />
        <button
          type="submit"
          className="bg-primary hover:scale-105 transition-all duration-300 hover:shadow-lg text-white rounded px-4 py-1 w-24 md:w-[20%] cursor-pointer"
        >
          بحث
        </button>
      </form>
      <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto justify-center md:justify-end">
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
              className="text-red-600 hover:underline cursor-pointer"
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
