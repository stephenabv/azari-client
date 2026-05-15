// Base URL for API calls. In production, Nginx proxies /api/* to the backend.
// In development, Vite proxies /api/* to localhost:4000 (see vite.config.ts).
const API_BASE = '/api';

export type ContentKey =
  | 'hero'
  | 'metrics'
  | 'excellence'
  | 'process'
  | 'tropics'
  | 'cta'
  | 'benefits';

export async function fetchContent<T = unknown>(key: ContentKey): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}/content/${key}`, {
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { success: boolean; data: T };
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function fetchAllContent(): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`${API_BASE}/content`, {
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { success: boolean; data: Record<string, unknown> };
    return json.data ?? null;
  } catch {
    return null;
  }
}

// ─── Admin API calls (require x-admin-api-key header) ──────────────────────────

export async function adminGetAllContent(apiKey: string) {
  const res = await fetch(`${API_BASE}/admin/content`, {
    headers: { 'x-admin-api-key': apiKey, Accept: 'application/json' }
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Failed to load content: ${res.status}`);
  return (await res.json()) as { success: boolean; data: Array<{ key: string; data: unknown; isCustomized: boolean; updatedAt: string | null }> };
}

export async function adminUpsertContent(apiKey: string, key: string, data: unknown) {
  const res = await fetch(`${API_BASE}/admin/content/${key}`, {
    method: 'PUT',
    headers: {
      'x-admin-api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ data })
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: 'Unknown error' })) as { message?: string };
    throw new Error(body.message ?? `Save failed: ${res.status}`);
  }
  return res.json();
}

export async function adminResetContent(apiKey: string, key: string) {
  const res = await fetch(`${API_BASE}/admin/content/${key}`, {
    method: 'DELETE',
    headers: { 'x-admin-api-key': apiKey, Accept: 'application/json' }
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Reset failed: ${res.status}`);
  return res.json();
}

export async function adminGetStats(apiKey: string) {
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: { 'x-admin-api-key': apiKey, Accept: 'application/json' }
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Failed to load stats: ${res.status}`);
  return res.json();
}

export async function adminGetTalkInquiries(apiKey: string, params: { limit?: number; offset?: number; status?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.limit != null) qs.set('limit', String(params.limit));
  if (params.offset != null) qs.set('offset', String(params.offset));
  if (params.status) qs.set('status', params.status);

  const res = await fetch(`${API_BASE}/admin/talk-inquiries?${qs}`, {
    headers: { 'x-admin-api-key': apiKey, Accept: 'application/json' }
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Failed to load inquiries: ${res.status}`);
  return res.json();
}

export async function adminGetQuotations(apiKey: string, params: { limit?: number; offset?: number; status?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.limit != null) qs.set('limit', String(params.limit));
  if (params.offset != null) qs.set('offset', String(params.offset));
  if (params.status) qs.set('status', params.status);

  const res = await fetch(`${API_BASE}/admin/quotation-requests?${qs}`, {
    headers: { 'x-admin-api-key': apiKey, Accept: 'application/json' }
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Failed to load quotations: ${res.status}`);
  return res.json();
}

export async function adminUpdateTalkStatus(apiKey: string, id: string, status: string) {
  const res = await fetch(`${API_BASE}/admin/talk-inquiries/${id}/status`, {
    method: 'PATCH',
    headers: { 'x-admin-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ status })
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Update failed: ${res.status}`);
  return res.json();
}

export async function adminUpdateQuotationStatus(apiKey: string, id: string, status: string) {
  const res = await fetch(`${API_BASE}/admin/quotation-requests/${id}/status`, {
    method: 'PATCH',
    headers: { 'x-admin-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ status })
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Update failed: ${res.status}`);
  return res.json();
}
