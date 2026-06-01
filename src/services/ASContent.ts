
const API_BASE = '/api';

// ─── Rate-limit pub/sub ────────────────────────────────────────────────────────
// Any fetch that receives a 429 fires this so components can show the banner.

export type RateLimitInfo = { retryAfterSec: number; resetAt: number };
const _rlSubs = new Set<(info: RateLimitInfo) => void>();

export function subscribeRateLimit(fn: (info: RateLimitInfo) => void): () => void {
  _rlSubs.add(fn);
  return () => _rlSubs.delete(fn);
}

function notifyRateLimit(res: Response): never {
  const sec = parseInt(res.headers.get('Retry-After') ?? '60', 10);
  _rlSubs.forEach(fn => fn({ retryAfterSec: sec, resetAt: Date.now() + sec * 1000 }));
  throw new Error(`rate_limited:${sec}`);
}

// Central fetch wrapper — intercepts 429 before callers see it
async function apiFetch(url: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(url, init);
  if (res.status === 429) notifyRateLimit(res);
  return res;
}

export type ContentKey =
  | 'hero'
  | 'metrics'
  | 'excellence'
  | 'process'
  | 'tropics'
  | 'clientJourney'
  | 'cta'
  | 'benefits'
  | 'footer'
  | 'section-visibility';

export async function fetchContent<T = unknown>(key: ContentKey): Promise<T | null> {
  try {
    const res = await apiFetch(`${API_BASE}/content/${key}`, {
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
    const res = await apiFetch(`${API_BASE}/content`, {
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { success: boolean; data: Record<string, unknown> };
    return json.data ?? null;
  } catch {
    return null;
  }
}



export async function adminGetAllContent(apiKey: string) {
  const res = await apiFetch(`${API_BASE}/admin/content`, {
    headers: { 'x-admin-api-key': apiKey, Accept: 'application/json' }
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Failed to load content: ${res.status}`);
  return (await res.json()) as { success: boolean; data: Array<{ key: string; data: unknown; isCustomized: boolean; updatedAt: string | null }> };
}

export async function adminUpsertContent(apiKey: string, key: string, data: unknown) {
  const res = await apiFetch(`${API_BASE}/admin/content/${key}`, {
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
  const res = await apiFetch(`${API_BASE}/admin/content/${key}`, {
    method: 'DELETE',
    headers: { 'x-admin-api-key': apiKey, Accept: 'application/json' }
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Reset failed: ${res.status}`);
  return res.json();
}

export async function adminGetStats(apiKey: string) {
  const res = await apiFetch(`${API_BASE}/admin/stats`, {
    headers: { 'x-admin-api-key': apiKey, Accept: 'application/json' }
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Failed to load stats: ${res.status}`);
  return res.json();
}

export async function adminGetTalkInquiries(apiKey: string, params: { limit?: number; offset?: number; status?: string; search?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.limit  != null) qs.set('limit',  String(params.limit));
  if (params.offset != null) qs.set('offset', String(params.offset));
  if (params.status)         qs.set('status', params.status);
  if (params.search)         qs.set('search', params.search);

  const res = await apiFetch(`${API_BASE}/admin/talk-inquiries?${qs}`, {
    headers: { 'x-admin-api-key': apiKey, Accept: 'application/json' }
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Failed to load inquiries: ${res.status}`);
  return res.json();
}

export async function adminGetQuotations(apiKey: string, params: { limit?: number; offset?: number; status?: string; search?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.limit  != null) qs.set('limit',  String(params.limit));
  if (params.offset != null) qs.set('offset', String(params.offset));
  if (params.status)         qs.set('status', params.status);
  if (params.search)         qs.set('search', params.search);

  const res = await apiFetch(`${API_BASE}/admin/quotation-requests?${qs}`, {
    headers: { 'x-admin-api-key': apiKey, Accept: 'application/json' }
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Failed to load quotations: ${res.status}`);
  return res.json();
}

export async function adminUpdateTalkStatus(apiKey: string, id: string, status: string) {
  const res = await apiFetch(`${API_BASE}/admin/talk-inquiries/${id}/status`, {
    method: 'PATCH',
    headers: { 'x-admin-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ status })
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Update failed: ${res.status}`);
  return res.json();
}

export async function adminUpdateQuotationStatus(apiKey: string, id: string, status: string) {
  const res = await apiFetch(`${API_BASE}/admin/quotation-requests/${id}/status`, {
    method: 'PATCH',
    headers: { 'x-admin-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ status })
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Update failed: ${res.status}`);
  return res.json();
}

export async function adminUpdateTalkProjectStatus(apiKey: string, id: string, projectStatus: string) {
  const res = await apiFetch(`${API_BASE}/admin/talk-inquiries/${id}/project-status`, {
    method: 'PATCH',
    headers: { 'x-admin-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ projectStatus })
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Update failed: ${res.status}`);
  return res.json();
}

export async function adminUpdateQuotationProjectStatus(apiKey: string, id: string, projectStatus: string) {
  const res = await apiFetch(`${API_BASE}/admin/quotation-requests/${id}/project-status`, {
    method: 'PATCH',
    headers: { 'x-admin-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ projectStatus })
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Update failed: ${res.status}`);
  return res.json();
}

export async function adminRetryTalkEmail(apiKey: string, id: string) {
  const res = await apiFetch(`${API_BASE}/admin/talk-inquiries/${id}/retry-email`, {
    method: 'POST',
    headers: { 'x-admin-api-key': apiKey, Accept: 'application/json' }
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Email retry failed: ${res.status}`);
  return res.json();
}

export async function adminRetryQuotationEmail(apiKey: string, id: string) {
  const res = await apiFetch(`${API_BASE}/admin/quotation-requests/${id}/retry-email`, {
    method: 'POST',
    headers: { 'x-admin-api-key': apiKey, Accept: 'application/json' }
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Email retry failed: ${res.status}`);
  return res.json();
}

export async function adminDeleteTalkInquiry(apiKey: string, id: string) {
  const res = await apiFetch(`${API_BASE}/admin/talk-inquiries/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-api-key': apiKey, Accept: 'application/json' }
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
  return res.json();
}

export async function adminUpdateTalkInquiry(apiKey: string, id: string, data: Record<string, string>) {
  const res = await apiFetch(`${API_BASE}/admin/talk-inquiries/${id}`, {
    method: 'PUT',
    headers: { 'x-admin-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data)
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Update failed: ${res.status}`);
  return res.json();
}

export async function adminDeleteQuotation(apiKey: string, id: string) {
  const res = await apiFetch(`${API_BASE}/admin/quotation-requests/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-api-key': apiKey, Accept: 'application/json' }
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
  return res.json();
}

export async function adminUpdateQuotation(apiKey: string, id: string, data: Record<string, string>) {
  const res = await apiFetch(`${API_BASE}/admin/quotation-requests/${id}`, {
    method: 'PUT',
    headers: { 'x-admin-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data)
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Update failed: ${res.status}`);
  return res.json();
}



export type ProjectCategory = 'Residential' | 'Commercial' | 'Industrial';

export interface ApiProject {
  id: string;
  title: string;
  category: ProjectCategory;
  system: string;
  savings: string;
  imageUrl: string;
  isRecent: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInput {
  title: string;
  category: ProjectCategory;
  system: string;
  savings: string;
  isRecent: boolean;
  imageFile?: File;
}

export async function fetchProjects(): Promise<ApiProject[]> {
  try {
    const res = await apiFetch(`${API_BASE}/projects`, { headers: { Accept: 'application/json' } });
    if (!res.ok) return [];
    const json = (await res.json()) as { success: boolean; data: ApiProject[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function adminGetProjects(apiKey: string) {
  const res = await apiFetch(`${API_BASE}/admin/projects`, {
    headers: { 'x-admin-api-key': apiKey, Accept: 'application/json' }
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Failed to load projects: ${res.status}`);
  return (await res.json()) as { success: boolean; data: ApiProject[] };
}

function buildProjectFormData(data: ProjectInput): FormData {
  const fd = new FormData();
  fd.append('title', data.title);
  fd.append('category', data.category);
  fd.append('system', data.system);
  fd.append('savings', data.savings);
  fd.append('isRecent', String(data.isRecent));
  if (data.imageFile) fd.append('image', data.imageFile);
  return fd;
}

export async function adminCreateProject(apiKey: string, data: ProjectInput) {
  const res = await apiFetch(`${API_BASE}/admin/projects`, {
    method: 'POST',
    headers: { 'x-admin-api-key': apiKey },
    body: buildProjectFormData(data)
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: 'Unknown error' })) as { message?: string };
    throw new Error(body.message ?? `Create failed: ${res.status}`);
  }
  return res.json();
}

export async function adminUpdateProject(apiKey: string, id: string, data: ProjectInput) {
  const res = await apiFetch(`${API_BASE}/admin/projects/${id}`, {
    method: 'PUT',
    headers: { 'x-admin-api-key': apiKey },
    body: buildProjectFormData(data)
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: 'Unknown error' })) as { message?: string };
    throw new Error(body.message ?? `Update failed: ${res.status}`);
  }
  return res.json();
}

export async function adminDeleteProject(apiKey: string, id: string) {
  const res = await apiFetch(`${API_BASE}/admin/projects/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-api-key': apiKey, Accept: 'application/json' }
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
  return res.json();
}



// ─── Component inventory ─────────────────────────────────────────────────────

export interface ApiSolarComponent {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  unit: string;
  unitPrice: number | null;
  pricingEnabled: boolean;
  isActive: boolean;
  sortOrder: number; // DEPRECATED: Sorting now uses createdAt
  productionCapacityKwp: number;
  loadCapacityKw: number;
  storageCapacityKwh: number;
  createdAt: string;
  updatedAt: string;
}

export interface ComponentInput {
  name: string;
  brand: string;
  model: string;
  category: string;
  unitPrice?: number;
  pricingEnabled: boolean;
  isActive: boolean;
  productionCapacityKwp: number;
  loadCapacityKw: number;
  storageCapacityKwh: number;
  // Note: 'unit' and 'sortOrder' are deprecated - units are now determined by category
}

export interface ApiPackageComponent {
  id: string;
  packageId: string;
  componentId: string;
  quantity: number;
  component: ApiSolarComponent;
}

// ─── Packages ─────────────────────────────────────────────────────────────────

export interface ApiSolarPackage {
  id: string;
  name: string;
  solarKwp: number;
  inverterKw: number;
  storageKwh: number;
  phase: 'single' | 'three';
  totalPrice: number | null;   // null = components not fully priced yet
  billRangeMin: number;
  billRangeMax: number;
  isActive: boolean;
  isRecommended: boolean;
  sortOrder: number; // DEPRECATED: Sorting now uses createdAt
  components: ApiPackageComponent[];
  createdAt: string;
  updatedAt: string;
}

export interface PackageComponentLine {
  componentId: string;
  quantity: number;
}

export interface PackageInput {
  name: string;
  solarKwp: number;
  inverterKw: number;
  storageKwh: number;
  phase: 'single' | 'three';
  billRangeMin: number;
  billRangeMax: number;
  isActive: boolean;
  isRecommended: boolean;
  components?: PackageComponentLine[];
}

export async function fetchPublicPackages(): Promise<ApiSolarPackage[]> {
  try {
    const res = await apiFetch(`${API_BASE}/packages`, { headers: { Accept: 'application/json' } });
    if (!res.ok) return [];
    const json = (await res.json()) as { success: boolean; data: ApiSolarPackage[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function adminGetPackages(apiKey: string) {
  const res = await apiFetch(`${API_BASE}/admin/packages`, {
    headers: { 'x-admin-api-key': apiKey, Accept: 'application/json' }
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Failed to load packages: ${res.status}`);
  return (await res.json()) as { success: boolean; data: ApiSolarPackage[] };
}

export async function adminCreatePackage(apiKey: string, data: PackageInput) {
  const res = await apiFetch(`${API_BASE}/admin/packages`, {
    method: 'POST',
    headers: { 'x-admin-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data)
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: 'Unknown error' })) as { message?: string };
    throw new Error(body.message ?? `Create failed: ${res.status}`);
  }
  return res.json();
}

export async function adminUpdatePackage(apiKey: string, id: string, data: Partial<PackageInput>) {
  const res = await apiFetch(`${API_BASE}/admin/packages/${id}`, {
    method: 'PUT',
    headers: { 'x-admin-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data)
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: 'Unknown error' })) as { message?: string };
    throw new Error(body.message ?? `Update failed: ${res.status}`);
  }
  return res.json();
}

export async function adminDeletePackage(apiKey: string, id: string) {
  const res = await apiFetch(`${API_BASE}/admin/packages/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-api-key': apiKey, Accept: 'application/json' }
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
  return res.json();
}

// ─── Component inventory API ──────────────────────────────────────────────────

export async function adminGetComponents(apiKey: string) {
  const res = await apiFetch(`${API_BASE}/admin/components`, {
    headers: { 'x-admin-api-key': apiKey, Accept: 'application/json' }
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Failed to load components: ${res.status}`);
  return (await res.json()) as { success: boolean; data: ApiSolarComponent[] };
}

export async function adminCreateComponent(apiKey: string, data: ComponentInput) {
  const res = await apiFetch(`${API_BASE}/admin/components`, {
    method: 'POST',
    headers: { 'x-admin-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data)
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: 'Unknown error' })) as { message?: string };
    throw new Error(body.message ?? `Create failed: ${res.status}`);
  }
  return res.json();
}

export async function adminUpdateComponent(apiKey: string, id: string, data: Partial<ComponentInput>) {
  const res = await apiFetch(`${API_BASE}/admin/components/${id}`, {
    method: 'PUT',
    headers: { 'x-admin-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data)
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: 'Unknown error' })) as { message?: string };
    throw new Error(body.message ?? `Update failed: ${res.status}`);
  }
  return res.json();
}

export async function adminDeleteComponent(apiKey: string, id: string) {
  const res = await apiFetch(`${API_BASE}/admin/components/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-api-key': apiKey, Accept: 'application/json' }
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
  return res.json();
}

export async function adminLoadDefaultComponents(apiKey: string, force = false) {
  const res = await apiFetch(`${API_BASE}/admin/components/load-defaults`, {
    method: 'POST',
    headers: { 'x-admin-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ force })
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: 'Unknown error' })) as { message?: string };
    throw new Error(body.message ?? `Failed: ${res.status}`);
  }
  return res.json();
}
