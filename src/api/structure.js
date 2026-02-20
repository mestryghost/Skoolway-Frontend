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

/**
 * Returns the tenant's classes (grade + stream) from structure.
 * Used for GRADE LEVEL dropdown in Add Student and Add Class.
 */
export async function getStructureClasses() {
  const data = await request('/api/structure/classes');
  return data.items ?? [];
}

/**
 * Create a class = Grade (education level) + Stream. No room.
 * @param {{ educationLevel: string, name: string }} body
 */
export async function createClass(body) {
  return request('/api/structure/classes', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
