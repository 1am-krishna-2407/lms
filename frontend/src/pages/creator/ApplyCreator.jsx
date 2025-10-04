import React from "react";
import API from "../../api";

export default function ApplyCreator() {
  async function apply() {
    try {
      await API.post("/creator/apply");
      alert("Applied. Admin will review.");
    } catch (err) {
      alert("Failed to apply: " + (err.response?.data?.message || ""));
    }
  }

  return (
    <div className="container">
      <h2>Apply to be a Creator</h2>
      <p className="small">As a creator you can create courses and lessons. Application requires admin approval.</p>
      <button onClick={apply}>Apply Now</button>
    </div>
  );
}
