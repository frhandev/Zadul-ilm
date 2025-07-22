import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/زاد_العلم-removebg-preview.png";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow py-3 px-6 flex items-center justify-between mb-8">
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="زاد العلم" className="h-10" />
        <span className="font-bold text-lg text-green-800">زاد العلم</span>
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-green-700 font-medium">
          الدورات
        </Link>
        {user && user.role === "teacher" && (
          <Link to="/my-courses" className="hover:text-green-700 font-medium">
            دوراتي
          </Link>
        )}
        {user && user.role === "student" && (
          <Link to="/my-courses" className="hover:text-green-700 font-medium">
            دوراتي
          </Link>
        )}
        {user && (
          <Link to="/dashboard" className="hover:text-green-700 font-medium">
            لوحة التحكم
          </Link>
        )}
        {user && (
          <Link to="/profile" className="hover:text-green-700 font-medium">
            الملف الشخصي
          </Link>
        )}
        {user && user.role === "teacher" && (
          <Link to="/add-course" className="hover:text-green-700 font-medium">
            إضافة دورة
          </Link>
        )}
        {user ? (
          <>
            <span className="text-gray-700 font-semibold">{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
            >
              تسجيل الخروج
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-green-700 font-medium">
              دخول
            </Link>
            <Link to="/register" className="hover:text-green-700 font-medium">
              تسجيل
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
