import React, { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../api";

export default function Login({ onAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(username, password);
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
        <h2>登录</h2>
        {error && <p className="error">{error}</p>}
        <input type="text" placeholder="用户名" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? "登录中..." : "登录"}</button>
        <p className="switch-link">还没有账号？<Link to="/register">注册</Link></p>
      </form>
    </div>
  );
}
