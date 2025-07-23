import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("https://zadul-ilm-1.onrender.com/api/auth/register", {
        name,
        email,
        password,
        role,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء التسجيل");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-96"
      >
        <h2 className="text-2xl mb-6 font-bold text-center">إنشاء حساب</h2>
        <input
          type="text"
          className="w-full mb-3 p-2 border rounded"
          placeholder="الاسم"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          className="w-full mb-3 p-2 border rounded"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full mb-3 p-2 border rounded"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          className="w-full mb-3 p-2 border rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">طالب</option>
          <option value="teacher">معلم</option>
        </select>
        {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          تسجيل
        </button>
        <div className="mt-4 text-center">
          لديك حساب؟{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            دخول
          </a>
        </div>
      </form>
    </div>
  );
}
