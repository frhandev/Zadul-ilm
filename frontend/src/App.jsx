import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseDetails from "./pages/CourseDetails";
import Courses from "./pages/Courses";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Courses />} />
        {/* صفحة تفاصيل الدورة */}
        <Route path="/courses/:id" element={<CourseDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
