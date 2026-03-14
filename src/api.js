const BASE = "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Request failed");
  return data;
}

export function register(username, password) {
  return request("/register", { method: "POST", body: JSON.stringify({ username, password }) });
}

export function login(username, password) {
  return request("/login", { method: "POST", body: JSON.stringify({ username, password }) });
}

export function getMe(token) {
  return request("/me", { headers: { Authorization: `Bearer ${token}` } });
}
