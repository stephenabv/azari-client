import { LOCALES } from "../../i18n/locales";

/**
 * How a visitor's free text (messages, appliance names) was turned into
 * English for the team. Null on records submitted from the English site and
 * on records older than the feature.
 */
export interface SubmissionTranslation {
  status: "translated" | "unchanged" | "failed" | "unavailable";
  /** Language the visitor wrote in, e.g. "Korean". */
  sourceLanguage?: string;
  /** The visitor's original words, keyed by field path ("message", "loadProfile.0.name"). */
  originals?: Record<string, string>;
}

const STATUSES: ReadonlySet<string> = new Set(["translated", "unchanged", "failed", "unavailable"]);

/** Validates the untyped `translation` value of an admin record; anything malformed is treated as absent. */
export function parseSubmissionTranslation(raw: unknown): SubmissionTranslation | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.status !== "string" || !STATUSES.has(r.status)) return null;
  const originals: Record<string, string> = {};
  if (r.originals && typeof r.originals === "object" && !Array.isArray(r.originals)) {
    for (const [k, v] of Object.entries(r.originals as Record<string, unknown>)) {
      if (typeof v === "string") originals[k] = v;
    }
  }
  return {
    status: r.status as SubmissionTranslation["status"],
    sourceLanguage: typeof r.sourceLanguage === "string" && r.sourceLanguage.trim() ? r.sourceLanguage : undefined,
    originals,
  };
}

/** English name of a site language tag ("zh-Hans" -> "Chinese (Simplified)"), falling back to the tag. */
export function localeEnglishName(tag: string): string {
  try {
    const name = new Intl.DisplayNames(["en"], { type: "language" }).of(tag);
    if (name && name !== tag) return name;
  } catch { /* unsupported tag or runtime: fall through */ }
  const known = LOCALES.find((l) => l.tag === tag || l.code === tag);
  return known?.nativeName ?? tag;
}
