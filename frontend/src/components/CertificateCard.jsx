import React from "react";

export default function CertificateCard({ cert }) {
  return (
    <div className="card">
      <h4>Certificate for {cert.courseTitle}</h4>
      <p className="small">Issued to: {cert.learnerName}</p>
      <p className="small">Serial: <code>{cert.serialHash}</code></p>
      <p className="small">Issued: {new Date(cert.issuedAt).toLocaleString()}</p>
    </div>
  );
}
