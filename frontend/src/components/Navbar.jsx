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
    <nav className="bg-white shadow flex justify-between items-center px-6 py-4">
      <Link to="/">
        <div className="flex items-center gap-2">
          <img src={logo} alt="زاد العلم" className="w-10" />
        </div>
      </Link>
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="ابحث عن دورة..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border px-3 py-1 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white rounded px-4 py-1"
        >
          بحث
        </button>
      </form>
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
