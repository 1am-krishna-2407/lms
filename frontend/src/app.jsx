import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Courses from "/pages/learner/Courses";
import CourseDetail from "/pages/learner/CourseDetail";
import Learn from "/pages/learner/Learn";
import Progress from "/pages/learner/Progress";

import ApplyCreator from "./pages/creator/ApplyCreator";
import CreatorDashboard from "./pages/creator/CreatorDashboard";

import ReviewCourses from "./pages/admin/ReviewCourses";

function App() {
  return (
    <div>
      <Navbar />
      <main style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/courses" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Learner */}
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/learn/:lessonId" element={<Learn />} />
          <Route path="/progress" element={<Progress />} />

          {/* Creator */}
          <Route path="/creator/apply" element={<ApplyCreator />} />
          <Route path="/creator/dashboard" element={<CreatorDashboard />} />

          {/* Admin */}
          <Route path="/admin/review/courses" element={<ReviewCourses />} />

          <Route path="*" element={<div>404 — page not found</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
