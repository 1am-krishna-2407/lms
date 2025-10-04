import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api";

export default function Learn() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const { data } = await API.get(`/lessons/${lessonId}`);
      setLesson(data);
      // fetch course for next/prev lesson links
      const { data: courseData } = await API.get(`/courses/${data.course}`);
      setCourse(courseData);
    } catch (err) {
      alert("Failed to load lesson");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [lessonId]);

  async function markComplete() {
    try {
      await API.post("/learner/progress", { lessonId });
      // backend should update enrollment and maybe issue certificate when progress reaches 100%
      alert("Marked complete");
      // navigate to next lesson if present
      if (course) {
        const idx = course.lessons.findIndex(l => l._id === lessonId);
        const next = course.lessons[idx + 1];
        if (next) nav(`/learn/${next._id}`);
        else nav(`/progress`);
      }
    } catch (err) {
      alert("Failed to mark complete");
    }
  }

  if (loading) return <div className="container">Loading...</div>;
  if (!lesson) return <div className="container">Lesson not found</div>;

  return (
    <div className="container">
      <h2>{lesson.title}</h2>
      <div className="card">
        <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
      </div>

      <h4>Transcript</h4>
      <div className="card">
        <pre style={{ whiteSpace: "pre-wrap" }}>{lesson.transcript || "No transcript available"}</pre>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={markComplete}>Mark Complete</button>
      </div>
    </div>
  );
}
