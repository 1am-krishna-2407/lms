import React from "react";

export default function ProgressBar({ percent = 0 }) {
  return (
    <div style={{ borderRadius: 8, background: "#eee", height: 12, width: "100%" }}>
      <div style={{ height: "100%", width: `${percent}%`, background: "#0b74de", borderRadius: 8 }} />
    </div>
  );
}
