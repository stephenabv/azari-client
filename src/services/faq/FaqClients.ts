import type { AdminFaq, FaqInput, FaqItem } from "../../models/faq";
import { JsonApiClient } from "../api/JsonApiClient";

/** Read-only access to the published FAQ, for the public site. */
export class PublicFaqClient extends JsonApiClient {
  /** Published entries in display order; null when the API is unreachable. */
  async listPublished(): Promise<FaqItem[] | null> {
    try {
      const data = await this.request<FaqItem[]>("/faqs");
      return Array.isArray(data) ? data : [];
    } catch {
      return null;
    }
  }
}

/** FAQ management for the admin console, authenticated with the admin API key. */
export class AdminFaqClient extends JsonApiClient {
  private static readonly PATH = "/admin/faqs";

  constructor(private readonly apiKey: string) {
    super();
  }

  protected override headers(): Record<string, string> {
    return { ...super.headers(), "x-admin-api-key": this.apiKey };
  }

  protected override errorMessage(status: number, message: string | undefined): string {
    return status === 401 ? "Invalid API key." : super.errorMessage(status, message);
  }

  list(): Promise<AdminFaq[]> {
    return this.request(AdminFaqClient.PATH);
  }

  create(input: FaqInput): Promise<AdminFaq> {
    return this.request(AdminFaqClient.PATH, { method: "POST", body: input });
  }

  update(id: string, input: Partial<FaqInput>): Promise<AdminFaq> {
    return this.request(`${AdminFaqClient.PATH}/${encodeURIComponent(id)}`, { method: "PUT", body: input });
  }

  setPublished(id: string, isPublished: boolean): Promise<AdminFaq> {
    return this.request(`${AdminFaqClient.PATH}/${encodeURIComponent(id)}/publish`, {
      method: "PATCH",
      body: { isPublished },
    });
  }

  async remove(id: string): Promise<void> {
    await this.request(`${AdminFaqClient.PATH}/${encodeURIComponent(id)}`, { method: "DELETE" });
  }

  /** Saves the full list order; `ids` must name every entry once. */
  reorder(ids: readonly string[]): Promise<AdminFaq[]> {
    return this.request(`${AdminFaqClient.PATH}/reorder`, { method: "PATCH", body: { ids } });
  }
}
