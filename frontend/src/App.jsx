import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseDetails from "./pages/CourseDetails";
import Courses from "./pages/Courses";
import LessonDetails from "./pages/LessonDetails";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import AddCourse from "./pages/AddCourse";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/lessons/:lessonId" element={<LessonDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-course" element={<AddCourse />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
