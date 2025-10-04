import React from "react";
import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <div className="card">
      <h3>{course.title}</h3>
      <p className="small">{course.description}</p>
      <div style={{ marginTop: 8 }}>
        <Link to={`/courses/${course._id}`}><button>View</button></Link>
      </div>
    </div>
  );
}
