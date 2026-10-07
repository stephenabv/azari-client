/**
 * Home page FAQ entries.
 *
 * Entries are managed in the admin console and stored by azari-service; there
 * are no built-in defaults. The same list feeds both the visible FAQ section
 * and its FAQPage structured data, so the two cannot drift apart (search
 * engines require structured data to match what the page shows). When no
 * entry is published, the section and its structured data are left out.
 */

/** A published FAQ entry, as the public API serves it. */
export interface FaqItem {
  /** Stable id; also the anchor of the entry on the page. */
  readonly id: string;
  readonly question: string;
  /** Plain text. Blank lines separate paragraphs. */
  readonly answer: string;
}

/** A FAQ entry as the admin console sees it, drafts included. */
export interface AdminFaq extends FaqItem {
  readonly sortOrder: number;
  readonly isPublished: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface FaqInput {
  question: string;
  answer: string;
  isPublished?: boolean;
}

/** Limits enforced by azari-service; mirrored here for form hints. */
export const FAQ_LIMITS = Object.freeze({ question: 300, answer: 3000 });
