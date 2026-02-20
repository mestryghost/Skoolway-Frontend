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

export async function fetchParents({ page = 1, pageSize = 20, status } = {}) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));
  if (status) params.set('status', status);
  return request(`/api/parents?${params.toString()}`);
}

export async function searchParents(query, { pageSize = 10 } = {}) {
  const params = new URLSearchParams();
  params.set('page', '1');
  params.set('pageSize', String(pageSize));
  if (query) params.set('query', query);
  return request(`/api/parents?${params.toString()}`);
}

export async function createParent(body) {
  return request('/api/parents', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateParent(id, body) {
  return request(`/api/parents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

