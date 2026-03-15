import React, { useState, useEffect } from "react";
import { getMe } from "../api";

export default function Dashboard({ token, onLogout }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getMe(token)
      .then((data) => setUsername(data.username))
      .catch(() => onLogout());
  }, [token]);

  return (
    <div className="dashboard">
      <button className="logout-btn" onClick={onLogout}>退出</button>
      <h1>{username}</h1>
    </div>
  );
}
