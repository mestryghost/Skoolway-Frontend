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

export async function fetchRecentNotifications({ category, limit = 3 } = {}) {
  const params = new URLSearchParams();
  params.set('page', '1');
  params.set('pageSize', String(limit));
  if (category) params.set('category', category);
  return request(`/api/notifications?${params.toString()}`);
}

export async function fetchNotifications({ page = 1, pageSize = 20 } = {}) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));
  return request(`/api/notifications?${params.toString()}`);
}

export async function fetchUnreadCount() {
  return request('/api/notifications/unread-count');
}

export async function markNotificationRead(id) {
  return request(`/api/notifications/${id}/read`, { method: 'POST' });
}

export async function markAllNotificationsRead() {
  return request('/api/notifications/mark-all-read', { method: 'POST' });
}

