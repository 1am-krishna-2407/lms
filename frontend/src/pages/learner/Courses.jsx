import React, { useEffect, useState } from "react";
import API from "../../api";
import CourseCard from "../../components/CourseCard";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [q, setQ] = useState("");

  async function fetchCourses() {
    try {
      // backend should expose GET /courses which returns only published courses for learners
      const { data } = await API.get("/courses");
      setCourses(data);
    } catch (err) {
      alert("Failed to fetch courses");
    }
  }

  useEffect(() => { fetchCourses(); }, []);

  const filtered = courses.filter(c => c.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="container">
      <h2>Courses</h2>
      <div style={{ marginBottom: 12 }}>
        <input placeholder="Search courses..." value={q} onChange={e => setQ(e.target.value)} />
      </div>
      <div className="grid">
        {filtered.map(c => <CourseCard key={c._id} course={c} />)}
      </div>
    </div>
  );
}
