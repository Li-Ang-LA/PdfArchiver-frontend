import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PdfViewer from "./pages/PdfViewer";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const handleAuth = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/" replace /> : <Login onAuth={handleAuth} />}
      />
      <Route
        path="/register"
        element={token ? <Navigate to="/" replace /> : <Register onAuth={handleAuth} />}
      />
      <Route
        path="/"
        element={token ? <Dashboard token={token} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/viewer/:id"
        element={token ? <PdfViewer token={token} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}
