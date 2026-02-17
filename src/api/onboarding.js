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
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || err.message || res.statusText);
  }
  return res.json();
}

export async function signup(data) {
  return request('/api/onboarding/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function createTenant(data) {
  return request('/api/onboarding/tenant', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getWizardState(tenantId) {
  return request(`/api/onboarding/tenant/${tenantId}/state`);
}

export async function updateStructure(tenantId, data) {
  return request(`/api/onboarding/tenant/${tenantId}/structure`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function activateTenant(tenantId) {
  return request(`/api/onboarding/tenant/${tenantId}/activate`, {
    method: 'POST',
  });
}
