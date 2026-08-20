/**
 * Server-side access to azari-service for route loaders.
 *
 * The browser talks to the API through the relative `/api` prefix that nginx
 * proxies (see src/services/ASContent.ts). Loaders run on the SSR server, which
 * has no origin to resolve that against, so they need the absolute base URL.
 *
 * Callers get the upstream outcome rather than a bare null, so a route can tell
 * "this record does not exist" (a real 404) apart from "the API did not answer"
 * (a server error). Collapsing those two into one value is what produced soft
 * 404s on /projects/:id.
 */

const API_BASE = process.env["API_URL"] ?? "http://localhost:4000";

export type ApiResult<T> =
  | { status: "ok"; data: T }
  | { status: "not-found" }
  | { status: "unavailable" };

export async function apiGet<T>(path: string): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { Accept: "application/json" },
    });

    if (res.status === 404) return { status: "not-found" };
    if (!res.ok) return { status: "unavailable" };

    const json = (await res.json()) as { data?: T } | T;
    const data = (json as { data?: T }).data ?? (json as T);

    return data == null ? { status: "not-found" } : { status: "ok", data };
  } catch {
    return { status: "unavailable" };
  }
}

/**
 * Lists degrade to an empty array when the API is unreachable, matching what
 * the client-side fetchers already do: the page still renders its empty state
 * instead of failing the whole route.
 */
export async function apiGetList<T>(path: string): Promise<T[]> {
  const result = await apiGet<T[]>(path);
  return result.status === "ok" && Array.isArray(result.data) ? result.data : [];
}
