
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

export interface ProjectStat {
  value: string;
  label: string;
}

export interface PerformanceMetric {
  title: string;
  description: string;
}

export interface TechBreakdownItem {
  title: string;
  subtitle?: string;
  badge?: string;
  imageUrl?: string;
  featured?: boolean;
}

export interface ProjectTestimonial {
  clientName: string;
  clientRole: string;
  quote: string;
}

export interface ApiProject {
  id: string;
  title: string;
  subtitle?: string;
  category: ProjectCategory;
  system: string;
  savings: string;
  imageUrl: string;
  videoUrl?: string;
  isRecent: boolean;
  sortOrder: number;
  stats: ProjectStat[];
  performanceMetrics: PerformanceMetric[];
  technicalBreakdown: TechBreakdownItem[];
  galleryImages: string[];
  testimonial?: ProjectTestimonial | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInput {
  title: string;
  subtitle?: string;
  category: ProjectCategory;
  system: string;
  savings: string;
  videoUrl?: string;
  isRecent: boolean;
  sortOrder?: number;
  imageFile?: File;
  stats?: ProjectStat[];
  performanceMetrics?: PerformanceMetric[];
  technicalBreakdown?: TechBreakdownItem[];
  galleryImages?: string[];
  testimonial?: ProjectTestimonial | null;
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

export async function fetchProjectById(id: string): Promise<ApiProject | null> {
  try {
    const res = await apiFetch(`${API_BASE}/projects/${id}`, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const json = await res.json() as { success: boolean; data: ApiProject };
    return json.data ?? null;
  } catch { return null; }
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
  if (data.subtitle !== undefined) fd.append('subtitle', data.subtitle);
  fd.append('category', data.category);
  fd.append('system', data.system);
  fd.append('savings', data.savings);
  if (data.videoUrl !== undefined) fd.append('videoUrl', data.videoUrl);
  fd.append('isRecent', String(data.isRecent));
  if (data.sortOrder !== undefined) fd.append('sortOrder', String(data.sortOrder));
  fd.append('stats', JSON.stringify(data.stats ?? []));
  fd.append('performanceMetrics', JSON.stringify(data.performanceMetrics ?? []));
  fd.append('technicalBreakdown', JSON.stringify(data.technicalBreakdown ?? []));
  fd.append('galleryImages', JSON.stringify(data.galleryImages ?? []));
  fd.append('testimonial', data.testimonial ? JSON.stringify(data.testimonial) : '');
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
  capacityUnit?: string | null;
  // Ratio-bound fields — read by the package-builder stepper UI
  parallelMin: number;   // Inverter: min absolute count in a package
  parallelMax: number;   // Inverter: max absolute count (= max_parallel_units)
  perInverterMin: number; // Battery/Panel: legacy min units per inverter
  perInverterMax: number; // Battery/Panel: legacy max units per inverter
  // Inverter electrical spec — used to derive physics-based panel/battery bounds
  pvMinPower?: number | null;          // kWp per unit — min PV input (lower panel bound)
  pvMaxPower?: number | null;          // kWp per unit — max PV input (upper panel bound)
  batteryMaxCapacity?: number | null;  // kWh per unit — max battery storage supported
  specsReviewedAt?: string | null;
  dataSheetUrl?: string | null;
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
  capacityUnit?: string | null;
  parallelMin?: number;
  parallelMax?: number;
  perInverterMin?: number;
  perInverterMax?: number;
  pvMinPower?: number | null;
  pvMaxPower?: number | null;
  batteryMaxCapacity?: number | null;
  dataSheetUrl?: string | null;
  // Note: 'unit' (SKU unit) and 'sortOrder' are deprecated - capacity units are dimension-driven by category
}

export interface ApiPackageComponent {
  id: string;
  packageId: string;
  componentId: string;
  quantity: number;
  baseComponentId?: string | null;
  multiplier?: number;
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
  imageUrl?: string | null;
  mainFeatures: string[];
  components: ApiPackageComponent[];
  createdAt: string;
  updatedAt: string;
}

export interface PackageComponentLine {
  componentId: string;
  quantity: number;
  baseComponentId?: string | null;  // drives derived quantity; null = fixed
  multiplier?: number;              // quantity = ceil(base.quantity * multiplier)
}

/**
 * Monthly savings estimate from production capacity.
 * Formula: productionKwp × 4 peak-sun-hours × 30 days × ₱12/kWh × 0.80 performance ratio,
 * rounded DOWN to the nearest ₱500. Range is savings ±₱1000.
 * 0.80 PR accounts for temperature derating, wiring losses, inverter efficiency, and soiling
 * (NREL PVWatts default for the Philippines).
 */
export function computeMonthlySavings(productionKwp: number): { savings: number; min: number; max: number } {
  const raw = productionKwp * 4 * 30 * 12 * 0.80;
  const savings = Math.floor(raw / 500) * 500;
  return { savings, min: Math.max(0, savings - 1000), max: savings + 1000 };
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
  mainFeatures?: string[];
  imageUrl?: string | null;
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
    const body = await res.json().catch(() => ({ message: 'Unknown error' })) as { message?: string; errors?: { fieldErrors?: Record<string, string[]>; formErrors?: string[] } };
    const firstFieldError = body.errors?.fieldErrors ? Object.values(body.errors.fieldErrors).flat()[0] : null;
    const firstFormError = body.errors?.formErrors?.[0];
    throw new Error(firstFieldError ?? firstFormError ?? body.message ?? `Update failed: ${res.status}`);
  }
  return res.json();
}

export interface PackageUsageItem {
  id: string;
  name: string;
  isActive: boolean;
  components: Array<{
    componentId: string;
    quantity: number;
    baseComponentId: string | null;
    multiplier: number;
    component: {
      category: string;
      productionCapacityKwp: number;
      loadCapacityKw: number;
      storageCapacityKwh: number;
      pvMinPower: number | null;
      pvMaxPower: number | null;
      batteryMaxCapacity: number | null;
      parallelMax: number;
    };
  }>;
}

export async function adminGetComponentUsage(apiKey: string, id: string): Promise<{ success: boolean; data: PackageUsageItem[] }> {
  const res = await apiFetch(`${API_BASE}/admin/components/${id}/usage`, {
    headers: { 'x-admin-api-key': apiKey, Accept: 'application/json' }
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Failed to check usage: ${res.status}`);
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

// ─── Package Inquiries API ────────────────────────────────────────────────────

// Customized config the customer actually inquired about (Scope B: faithful submission).
// All capacity fields are canonical kilo values (kWp / kW / kWh).
// qty and components carry the customer's scaled selections.
export interface PackageDetails {
  solarKwp: number;
  inverterKw: number;
  storageKwh: number;
  phase: string;
  billRangeMin: number;
  billRangeMax: number;
  totalPrice: number | null;
  // Scope B additions — present when the customer customized the package:
  qty?: { inverter: number; batteries: number; panels: number };
  components?: Array<{ brand: string; name: string; category: string; quantity: number; unitPrice: number | null }>;
}

export interface PackageInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  packageId: string;
  packageName: string;
  packageDetails: PackageDetails;
  status: 'new' | 'contacted' | 'converted';
  createdAt: string;
  updatedAt: string;
}

// The live, scaled selection built in PackageCard when the customer clicks Inquire.
export interface PackageSelection {
  qty: { inverter: number; batteries: number; panels: number };
  solarKwp: number;
  inverterKw: number;
  storageKwh: number;
  savings: { min: number; max: number };
  price: number | null;
  components: Array<{ brand: string; name: string; category: string; quantity: number; unitPrice: number | null }>;
}

export async function submitPackageInquiry(data: {
  name: string;
  email: string;
  phone: string;
  location: string;
  packageId: string;
  packageName: string;
  packageDetails: PackageDetails;
}) {
  const res = await apiFetch(`${API_BASE}/packages/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: 'Unknown error' })) as { message?: string };
    throw new Error(body.message ?? `Submit failed: ${res.status}`);
  }
  return res.json();
}

export async function adminGetPackageInquiries(apiKey: string) {
  const res = await apiFetch(`${API_BASE}/admin/packages/inquiries`, {
    headers: { 'x-admin-api-key': apiKey, Accept: 'application/json' }
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Failed to load inquiries: ${res.status}`);
  return (await res.json()) as { success: boolean; data: PackageInquiry[] };
}

export async function adminUpdatePackageInquiry(apiKey: string, id: string, data: Partial<Pick<PackageInquiry, 'status'>>) {
  const res = await apiFetch(`${API_BASE}/admin/packages/inquiries/${id}/status`, {
    method: 'PATCH',
    headers: { 'x-admin-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data)
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Update failed: ${res.status}`);
  return res.json();
}

export async function adminDeletePackageInquiry(apiKey: string, id: string) {
  const res = await apiFetch(`${API_BASE}/admin/packages/inquiries/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-api-key': apiKey, Accept: 'application/json' }
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
  return res.json();
}

export async function adminUploadPackageImage(apiKey: string, id: string, imageFile: File) {
  const fd = new FormData();
  fd.append('image', imageFile);
  const res = await apiFetch(`${API_BASE}/admin/packages/${id}/image`, {
    method: 'PUT',
    headers: { 'x-admin-api-key': apiKey },
    body: fd,
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: 'Unknown error' })) as { message?: string };
    throw new Error(body.message ?? `Upload failed: ${res.status}`);
  }
  return res.json();
}

export async function adminUploadComponentDataSheet(apiKey: string, id: string, pdfFile: File) {
  const fd = new FormData();
  fd.append('dataSheet', pdfFile);
  const res = await apiFetch(`${API_BASE}/admin/components/${id}/datasheet`, {
    method: 'PUT',
    headers: { 'x-admin-api-key': apiKey },
    body: fd,
  });
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: 'Unknown error' })) as { message?: string };
    throw new Error(body.message ?? `Upload failed: ${res.status}`);
  }
  return res.json();
}
