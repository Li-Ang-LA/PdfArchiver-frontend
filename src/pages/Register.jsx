import React, { useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../api";

export default function Register({ onAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await register(username, password);
      onAuth(data.access_token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>注册</h2>
        {error && <p className="error">{error}</p>}
        <input type="text" placeholder="用户名" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? "注册中..." : "注册"}</button>
        <p className="switch-link">已有账号？<Link to="/login">登录</Link></p>
      </form>
    </div>
  );
}
