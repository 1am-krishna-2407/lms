import React, { useEffect, useState } from "react";
import API from "../../api";

export default function CreatorDashboard() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function load() {
    try {
      const { data } = await API.get("/creator/courses");
      setCourses(data || []);
    } catch (err) {
      alert("Failed to load creator courses");
    }
  }

  useEffect(() => { load(); }, []);

  async function createCourse(e) {
    e.preventDefault();
    try {
      const { data } = await API.post("/creator/courses", { title, description });
      setCourses(prev => [data, ...prev]);
      setTitle(""); setDescription("");
    } catch (err) {
      alert("Create failed");
    }
  }

  return (
    <div className="container">
      <h2>Creator Dashboard</h2>
      <div className="card">
        <h4>Create Course</h4>
        <form onSubmit={createCourse}>
          <input placeholder="Course title" value={title} onChange={e=>setTitle(e.target.value)} />
          <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
          <div style={{ marginTop: 8 }}><button type="submit">Create</button></div>
        </form>
      </div>

      <h3 style={{ marginTop: 12 }}>Your Courses</h3>
      <div className="grid">
        {courses.map(c => (
          <div key={c._id} className="card">
            <h4>{c.title}</h4>
            <p className="small">Status: {c.status}</p>
            <div style={{ marginTop: 8 }}>
              <a href={`/courses/${c._id}`}>View</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
