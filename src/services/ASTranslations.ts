import { handleRateLimitResponse } from './ASContent';

/**
 * Admin client for per-language translations of database content (projects,
 * packages, journey steps, IP ratings) and for machine-translated drafts.
 * Mirrors the request/error conventions of the admin calls in ASContent.ts.
 */

const API_BASE = '/api';

export type TranslatableEntityType = 'project' | 'package' | 'journeyStep' | 'ipRating';

/** Field name -> JSON value, as stored on the English record or in a translation. */
export type TranslationFields = Record<string, unknown>;

export interface EntityTranslationView {
  /** The English values of every translatable field. */
  source: TranslationFields;
  /** The saved translation for the requested locale, or null when none exists. */
  translation: TranslationFields | null;
  /** True when the English record changed after the translation was saved. */
  stale: boolean;
  updatedAt: string | null;
}

/** Raised for any non-OK admin translation response; `status` lets callers special-case 503/413. */
export class TranslationApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = 'TranslationApiError';
  }
}

type ApiEnvelope<T> = { success: boolean; data: T; message?: string };

async function apiFetch(url: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(url, init);
  if (handleRateLimitResponse(res)) {
    const sec = parseInt(res.headers.get('Retry-After') ?? '60', 10);
    throw new TranslationApiError(`rate_limited:${sec}`, 429);
  }
  return res;
}

async function readError(res: Response, fallback: string): Promise<TranslationApiError> {
  if (res.status === 401) return new TranslationApiError('Invalid API key.', 401);
  const body = (await res.json().catch(() => ({}))) as { message?: unknown };
  const message = typeof body.message === 'string' && body.message.trim() ? body.message : `${fallback}: ${res.status}`;
  return new TranslationApiError(message, res.status);
}

function entityUrl(entityType: TranslatableEntityType, entityId: string, locale: string): string {
  return `${API_BASE}/admin/translations/${encodeURIComponent(entityType)}/${encodeURIComponent(entityId)}?locale=${encodeURIComponent(locale)}`;
}

function headers(apiKey: string, json = false): HeadersInit {
  return json
    ? { 'x-admin-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' }
    : { 'x-admin-api-key': apiKey, Accept: 'application/json' };
}

export async function adminGetEntityTranslation(
  apiKey: string, entityType: TranslatableEntityType, entityId: string, locale: string,
): Promise<EntityTranslationView> {
  const res = await apiFetch(entityUrl(entityType, entityId, locale), { headers: headers(apiKey) });
  if (!res.ok) throw await readError(res, 'Failed to load translation');
  return ((await res.json()) as ApiEnvelope<EntityTranslationView>).data;
}

/** Saves a translation; empty/null fields are dropped server-side so they fall back to English. */
export async function adminSaveEntityTranslation(
  apiKey: string, entityType: TranslatableEntityType, entityId: string, locale: string, fields: TranslationFields,
): Promise<EntityTranslationView> {
  const res = await apiFetch(entityUrl(entityType, entityId, locale), {
    method: 'PUT',
    headers: headers(apiKey, true),
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw await readError(res, 'Save failed');
  return ((await res.json()) as ApiEnvelope<EntityTranslationView>).data;
}

export async function adminDeleteEntityTranslation(
  apiKey: string, entityType: TranslatableEntityType, entityId: string, locale: string,
): Promise<void> {
  const res = await apiFetch(entityUrl(entityType, entityId, locale), { method: 'DELETE', headers: headers(apiKey) });
  if (!res.ok) throw await readError(res, 'Remove failed');
}

/**
 * Machine-translates the prose strings of any JSON value into `locale` and
 * returns the same shape. Nothing is saved.
 */
export async function adminTranslateDraft<T>(apiKey: string, locale: string, data: T): Promise<T> {
  const res = await apiFetch(`${API_BASE}/admin/translate`, {
    method: 'POST',
    headers: headers(apiKey, true),
    body: JSON.stringify({ locale, data }),
  });
  if (res.status === 503) throw new TranslationApiError('Auto-translate is not configured on the server.', 503);
  if (res.status === 413) throw new TranslationApiError('Too much text to auto-translate at once. Translate it in smaller parts.', 413);
  if (!res.ok) throw await readError(res, 'Auto-translate failed');
  return ((await res.json()) as ApiEnvelope<T>).data;
}
