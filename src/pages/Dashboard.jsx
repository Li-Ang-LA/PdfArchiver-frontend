import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, listFiles, uploadFile, deleteFile } from "../api";

export default function Dashboard({ token, onLogout }) {
  const [username, setUsername] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getMe(token).then((d) => setUsername(d.username)).catch(() => onLogout());
    loadFiles();
  }, [token]);

  async function loadFiles() {
    try {
      const data = await listFiles(token);
      setFiles(data);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      await uploadFile(token, file);
      await loadFiles();
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
      fileInputRef.current.value = "";
    }
  }

  async function handleDelete(e, id) {
    e.stopPropagation();
    try {
      await deleteFile(token, id);
      setFiles((prev) => prev.filter((f) => f.id !== id));
    } catch (e) {
      setError(e.message);
    }
  }

  function formatSize(bytes) {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("zh-CN");
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <span className="dashboard-username">{username}</span>
        <button className="logout-btn" onClick={onLogout}>退出</button>
      </header>

      <main className="dashboard-main">
        <div className="file-list-toolbar">
          <h2>我的文件</h2>
          <button
            className="upload-btn"
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
          >
            {uploading ? "上传中..." : "+ 上传 PDF"}
          </button>
          <input
            type="file"
            accept=".pdf"
            ref={fileInputRef}
            onChange={handleUpload}
            style={{ display: "none" }}
          />
        </div>

        {error && <p className="error" style={{ marginBottom: "1rem" }}>{error}</p>}

        {files.length === 0 ? (
          <div className="file-empty">还没有文件，点击上传按钮添加 PDF</div>
        ) : (
          <ul className="file-list">
            {files.map((file) => (
              <li
                key={file.id}
                className="file-item"
                onClick={() => navigate(`/viewer/${file.id}`)}
              >
                <div className="file-icon">PDF</div>
                <div className="file-info">
                  <span className="file-name">{file.filename}</span>
                  <span className="file-meta">
                    {formatSize(file.size)} · {formatDate(file.created_at)}
                  </span>
                </div>
                <button
                  className="file-delete-btn"
                  onClick={(e) => handleDelete(e, file.id)}
                >
                  删除
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
