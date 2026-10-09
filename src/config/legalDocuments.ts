import type { ContentKey } from "../services/ASContent";

export type LegalDocumentId = "privacy" | "terms";

/**
 * A legal document the site publishes. Each one has a standalone route (kept
 * for SEO, direct links and printing) and can also be read in the legal modal
 * without leaving the current page.
 */
export interface LegalDocumentDefinition {
  readonly id: LegalDocumentId;
  /** CMS entry holding the document body, edited under Admin → Legal. */
  readonly contentKey: ContentKey;
  /** Standalone route, also the canonical URL path. */
  readonly path: `/${string}`;
  /** Shown while the CMS entry loads and used as the dialog's label. */
  readonly fallbackTitle: string;
}

/**
 * Every document the legal modal can open. Adding a new one (a cookie policy,
 * say) is an entry here plus its route; links resolve to it automatically.
 */
export const LEGAL_DOCUMENTS: readonly LegalDocumentDefinition[] = Object.freeze([
  {
    id: "privacy",
    contentKey: "privacyPolicy",
    path: "/privacy-policy",
    fallbackTitle: "Privacy Policy",
  },
  {
    id: "terms",
    contentKey: "termsConditions",
    path: "/terms-and-conditions",
    fallbackTitle: "Terms and Conditions",
  },
]);
