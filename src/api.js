const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const COMMON_HEADERS = { "ngrok-skip-browser-warning": "1" };

async function request(path, options = {}) {
  const { headers: optHeaders, ...restOptions } = options;
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...COMMON_HEADERS, ...optHeaders },
    ...restOptions,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Request failed");
  return data;
}

export function register(username, password) {
  return request("/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function login(username, password) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function getMe(token) {
  return request("/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function listFiles(token) {
  return request("/files", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function uploadFile(token, file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${BASE}/files/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, ...COMMON_HEADERS },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Upload failed");
  return data;
}

export async function downloadFileBlob(token, fileId) {
  const res = await fetch(`${BASE}/files/${fileId}`, {
    headers: { Authorization: `Bearer ${token}`, ...COMMON_HEADERS },
  });
  if (!res.ok) throw new Error("Download failed");
  return res.blob();
}

export async function deleteFile(token, fileId) {
  const res = await fetch(`${BASE}/files/${fileId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}`, ...COMMON_HEADERS },
  });
  if (!res.ok) throw new Error("Delete failed");
}
