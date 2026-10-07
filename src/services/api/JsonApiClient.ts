import { handleRateLimitResponse } from "../ASContent";

/** An API call that failed; `status` is the HTTP status (0 when offline). */
export class ApiError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

type Envelope<T> = { success?: boolean; data?: T; message?: string };

/**
 * Base for typed clients of the same-origin `/api` proxy. Subclasses add their
 * endpoints and may contribute headers (e.g. admin credentials); this class
 * owns JSON encoding, the `{ success, data }` envelope, rate-limit signalling
 * and error messages.
 */
export abstract class JsonApiClient {
  protected static readonly BASE = "/api";

  protected headers(): Record<string, string> {
    return { Accept: "application/json" };
  }

  protected async request<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
    const headers = this.headers();
    const hasBody = init.body !== undefined;
    if (hasBody) headers["Content-Type"] = "application/json";

    let res: Response;
    try {
      res = await fetch(`${JsonApiClient.BASE}${path}`, {
        method: init.method ?? "GET",
        headers,
        credentials: "same-origin",
        ...(hasBody && { body: JSON.stringify(init.body) }),
      });
    } catch {
      throw new ApiError(0, "Network error. Check your connection and try again.");
    }

    if (handleRateLimitResponse(res)) throw new ApiError(429, "Too many requests. Please wait a moment.");

    const json = (await res.json().catch(() => ({}))) as Envelope<T>;
    if (!res.ok) throw new ApiError(res.status, this.errorMessage(res.status, json.message));
    return json.data as T;
  }

  protected errorMessage(status: number, message: string | undefined): string {
    return message ?? `Request failed (${status}).`;
  }
}
