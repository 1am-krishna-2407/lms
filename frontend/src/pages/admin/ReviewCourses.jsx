import React, { useEffect, useState } from "react";
import API from "../../api";

export default function ReviewCourses() {
  const [courses, setCourses] = useState([]);

  async function load() {
    try {
      const { data } = await API.get("/admin/courses/pending");
      setCourses(data || []);
    } catch (err) {
      alert("Failed to load pending courses");
    }
  }

  useEffect(() => { load(); }, []);

  async function approve(id) {
    try {
      await API.post(`/admin/courses/${id}/approve`);
      setCourses(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert("Approve failed");
    }
  }

  async function reject(id) {
    try {
      await API.post(`/admin/courses/${id}/reject`);
      setCourses(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert("Reject failed");
    }
  }

  return (
    <div className="container">
      <h2>Pending Courses</h2>
      <div>
        {courses.length === 0 && <div className="small">No pending courses.</div>}
        {courses.map(c => (
          <div key={c._id} className="card" style={{ marginBottom: 8 }}>
            <h4>{c.title}</h4>
            <p className="small">{c.description}</p>
            <div style={{ marginTop: 8 }}>
              <button onClick={() => approve(c._id)} style={{ marginRight: 8 }}>Approve</button>
              <button onClick={() => reject(c._id)}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
