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
 * Returns the tenant's classes (grade/section options) from onboarding structure.
 * Used for GRADE LEVEL dropdown in Add Student and similar forms.
 */
export async function getStructureClasses() {
  const data = await request('/api/structure/classes');
  return data.items ?? [];
}
