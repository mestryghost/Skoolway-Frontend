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
  if (!res.ok) {
    throw new Error(data.error || data.message || res.statusText);
  }
  return data;
}

export async function fetchTeachers({ page = 1, pageSize = 20 } = {}) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));
  return request(`/api/teachers?${params.toString()}`);
}

export async function fetchTeacherProfile(id) {
  return request(`/api/teachers/${id}`);
}

