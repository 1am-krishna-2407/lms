import React, { useEffect, useState } from "react";
import API from "../../api";
import CertificateCard from "../../components/CertificateCard";
import ProgressBar from "../../components/ProgressBar";

export default function Progress() {
  const [enrollments, setEnrollments] = useState([]);
  const [certs, setCerts] = useState([]);

  async function load() {
    try {
      const { data } = await API.get("/learner/enrollments");
      setEnrollments(data || []);
      const { data: certData } = await API.get("/certificate");
      setCerts(certData || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load progress");
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="container">
      <h2>Your Progress</h2>
      <div>
        {enrollments.length === 0 && <p>No enrollments yet.</p>}
        {enrollments.map(e => (
          <div key={e._id} className="card" style={{ marginBottom: 8 }}>
            <h4>{e.courseTitle}</h4>
            <div style={{ margin: "8px 0" }}><ProgressBar percent={Math.round(e.progress)} /></div>
            <p className="small">Completed: {e.completed ? "Yes" : "No"}</p>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 20 }}>Certificates</h3>
      <div className="grid">
        {certs.length === 0 && <div className="small">No certificates yet.</div>}
        {certs.map(c => <CertificateCard key={c._id} cert={c} />)}
      </div>
    </div>
  );
}
