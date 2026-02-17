import { API_BASE_URL } from '../constants/api';

const credentials = 'include';

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    credentials,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || res.statusText);
  return data;
}

export async function getMe() {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, { credentials });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error('Session check failed');
  return res.json();
}

export async function login(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  return request('/api/auth/logout', { method: 'POST' });
}
