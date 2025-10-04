import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../../api";
import ProgressBar from "../../components/ProgressBar";

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const nav = useNavigate();

  async function load() {
    try {
      const { data } = await API.get(`/courses/${id}`);
      setCourse(data);
      // check enrollment
      const res = await API.get(`/learner/enrollments?course=${id}`);
      const found = res.data?.find?.(e => e.course === id);
      setEnrolled(!!found);
    } catch (err) {
      alert("Failed to load course");
    }
  }

  async function enroll() {
    try {
      await API.post("/learner/enroll", { courseId: id });
      setEnrolled(true);
      nav(`/courses/${id}`);
    } catch (err) {
      alert("Enroll failed: " + (err.response?.data?.message || ""));
    }
  }

  useEffect(() => { load(); }, [id]);

  if (!course) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>{course.title}</h2>
      <p className="small">{course.description}</p>
      <div style={{ marginTop: 12 }}>
        {enrolled ? <button onClick={() => nav(`/learn/${course.lessons[0]._id}`)}>Start Learning</button> : <button onClick={enroll}>Enroll</button>}
      </div>

      <h3 style={{ marginTop: 18 }}>Lessons</h3>
      <div>
        {course.lessons.map(l => (
          <div key={l._id} className="card" style={{ marginBottom: 8 }}>
            <strong>{l.order}. {l.title}</strong>
            <p className="small">{l.content?.slice(0, 120)}...</p>
            <div><Link to={`/learn/${l._id}`}><button>Open</button></Link></div>
          </div>
        ))}
      </div>
    </div>
  );
}
