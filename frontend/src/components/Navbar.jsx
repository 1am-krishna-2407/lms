import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const userJSON = localStorage.getItem("user");
  const user = userJSON ? JSON.parse(userJSON) : null;
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    nav("/login");
  };

  return (
    <nav>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="brand"><Link to="/" style={{ color: "white", textDecoration: "none" }}>MiniLMS</Link></div>
        <Link to="/courses" style={{ color: "white", textDecoration: "none" }}>Courses</Link>
        <Link to="/progress" style={{ color: "white", textDecoration: "none" }}>Progress</Link>
      </div>

      <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
        {!token ? (
          <>
            <Link to="/login" style={{ color: "white", textDecoration: "none" }}>Login</Link>
            <Link to="/register" style={{ color: "white", textDecoration: "none" }}>Register</Link>
          </>
        ) : (
          <>
            {user?.role === "creator" && <Link to="/creator/dashboard" style={{ color: "white", textDecoration: "none" }}>Creator</Link>}
            {user?.role === "admin" && <Link to="/admin/review/courses" style={{ color: "white", textDecoration: "none" }}>Admin</Link>}
            <div style={{ color: "white", alignSelf: "center" }}>{user?.name}</div>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
