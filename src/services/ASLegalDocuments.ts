import { BUSINESS } from "../config/business";
import {
  LEGAL_DOCUMENTS,
  type LegalDocumentDefinition,
  type LegalDocumentId,
} from "../config/legalDocuments";

/**
 * Maps links to the legal documents they point at.
 *
 * Footer link URLs come from the CMS, so they may be absolute
 * (`https://azari.solar/privacy-policy`), relative, or carry a trailing
 * slash, query or hash. A link resolves only when it is on one of this site's
 * own origins and its path matches a registered document; anything else (an
 * admin pointing the link at an external host, for instance) resolves to null
 * and the caller keeps ordinary link behaviour.
 */
export class LegalDocumentRegistry {
  private readonly byId: ReadonlyMap<LegalDocumentId, LegalDocumentDefinition>;
  private readonly byPath: ReadonlyMap<string, LegalDocumentDefinition>;
  private readonly canonicalOrigin: string;

  constructor(
    documents: readonly LegalDocumentDefinition[],
    canonicalOrigin: string,
  ) {
    this.canonicalOrigin = new URL(canonicalOrigin).origin;
    this.byId = new Map(documents.map((doc) => [doc.id, doc]));
    this.byPath = new Map(
      documents.map((doc) => [LegalDocumentRegistry.normalisePath(doc.path), doc]),
    );
  }

  get(id: LegalDocumentId): LegalDocumentDefinition | null {
    return this.byId.get(id) ?? null;
  }

  resolve(href: string | null | undefined): LegalDocumentDefinition | null {
    if (!href) return null;

    let url: URL;
    try {
      url = new URL(href, this.currentOrigin());
    } catch {
      return null;
    }

    if (!this.isOwnOrigin(url.origin)) return null;
    return this.byPath.get(LegalDocumentRegistry.normalisePath(url.pathname)) ?? null;
  }

  private currentOrigin(): string {
    return typeof window === "undefined" ? this.canonicalOrigin : window.location.origin;
  }

  private isOwnOrigin(origin: string): boolean {
    return origin === this.canonicalOrigin || origin === this.currentOrigin();
  }

  private static normalisePath(pathname: string): string {
    const trimmed = pathname.replace(/\/+$/, "");
    return (trimmed || "/").toLowerCase();
  }
}

export const legalDocuments = new LegalDocumentRegistry(LEGAL_DOCUMENTS, BUSINESS.siteUrl);
