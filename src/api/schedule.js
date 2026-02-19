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
    const message = data.detail ?? data.error ?? data.message ?? res.statusText;
    throw new Error(message);
  }
  return data;
}

export async function getScheduleConfig() {
  return request('/api/schedule/config');
}

export async function updateScheduleConfig(body) {
  return request('/api/schedule/config', {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function getScheduleOptions() {
  return request('/api/schedule/options');
}

export async function getScheduleSlots() {
  return request('/api/schedule/slots');
}

export async function upsertScheduleSlot(body) {
  return request('/api/schedule/slots', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
