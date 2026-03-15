const BASE = "https://viscid-benita-garlandless.ngrok-free.dev";

async function request(path, options = {}) {
  const { headers: optHeaders, ...restOptions } = options;
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "1", ...optHeaders },
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
