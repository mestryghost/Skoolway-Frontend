import { API_BASE_URL } from '../constants/api';

const credentials = 'include';

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    credentials,
    headers: {
      'Accept': 'application/json',
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

export async function fetchStudents({ page = 1, pageSize = 20, status } = {}) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));
  if (status) params.set('status', status);
  return request(`/api/students?${params.toString()}`);
}

export async function fetchStudentProfile(id) {
  return request(`/api/students/${id}`);
}

export async function searchStudents(query, { pageSize = 10 } = {}) {
  const params = new URLSearchParams();
  params.set('page', '1');
  params.set('pageSize', String(pageSize));
  if (query) params.set('query', query);
  return request(`/api/students?${params.toString()}`);
}

export async function createStudent(body) {
  return request('/api/students', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateStudent(id, body) {
  return request(`/api/students/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/**
 * @param {Array<{ firstName?: string, lastName?: string, email?: string, phone?: string, gradeLabel?: string, sectionLabel?: string, dateOfBirth?: string, address?: string }>} rows
 * @returns {Promise<{ created: number, failed: number, errors: Array<{ row: number, message: string }> }>}
 */
export async function importStudents(rows) {
  return request('/api/students/batch/import', {
    method: 'POST',
    body: JSON.stringify({ rows }),
  });
}

