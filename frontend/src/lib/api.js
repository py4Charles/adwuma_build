export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function apiFetch(path, { method = 'GET', token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return { data: null, error: null };

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const message = json?.error ?? json?.message ?? `Request failed with status ${res.status}`;
    return { data: null, error: { message } };
  }

  return { data: json, error: null };
}