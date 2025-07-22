import React from "react";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return (
      <div className="text-center py-16 text-red-600 font-bold text-xl">
        لم تقم بتسجيل الدخول.
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8 text-center">الملف الشخصي</h1>
      <div className="bg-white rounded shadow p-6 space-y-5">
        <div>
          <span className="text-gray-500 font-semibold">الاسم: </span>
          <span className="font-bold">{user.name}</span>
        </div>
        <div>
          <span className="text-gray-500 font-semibold">
            البريد الإلكتروني:{" "}
          </span>
          <span className="font-bold">{user.email}</span>
        </div>
        <div>
          <span className="text-gray-500 font-semibold">الدور: </span>
          <span className="font-bold">
            {user.role === "student"
              ? "طالب"
              : user.role === "teacher"
              ? "معلم"
              : user.role}
          </span>
        </div>
        <div>
          <span className="text-gray-500 font-semibold">تاريخ الانضمام: </span>
          <span className="font-bold">
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "غير محدد"}
          </span>
        </div>
      </div>
    </div>
  );
}
