import type { ReactNode } from "react";
import { localeEnglishName, type SubmissionTranslation } from "./SubmissionTranslationModel";

/** Small badge naming the site language a submission was made in. Renders nothing for old records. */
export function SubmissionLocaleBadge({ locale, standalone }: {
  locale: unknown;
  /** True when the badge is a field value on its own rather than following a name. */
  standalone?: boolean;
}) {
  if (typeof locale !== "string" || !locale.trim()) return null;
  // English is the default, so lists only flag submissions from another language.
  if (!standalone && /^en(-|$)/i.test(locale)) return null;
  return (
    <span className={`ad-sub-lang${standalone ? " is-standalone" : ""}`} title={`Submitted from the ${localeEnglishName(locale)} site`}>
      {localeEnglishName(locale)}
    </span>
  );
}

/** "not translated — shown as typed" note for failed / unavailable translations. */
export function SubmissionTranslationNote({ translation }: { translation: SubmissionTranslation | null }) {
  if (!translation || (translation.status !== "failed" && translation.status !== "unavailable")) return null;
  return (
    <div className="ad-sub-tr-note" role="note">
      Not translated — shown as typed{translation.status === "unavailable" ? " (auto-translation is not configured)" : " (translation failed)"}.
    </div>
  );
}

/**
 * Wraps a translated field: the English text (children) followed, when the
 * field was translated, by a "translated from X" tag and the visitor's
 * original words. Everything is rendered as text.
 */
export function TranslatedField({ translation, path, children, compact }: {
  translation: SubmissionTranslation | null;
  path: string;
  children: ReactNode;
  /** Single-line variant for table cells (appliance names). */
  compact?: boolean;
}) {
  const original = translation?.status === "translated" ? translation.originals?.[path] : undefined;
  if (original === undefined) return <>{children}</>;
  const from = translation?.sourceLanguage ? `Translated from ${translation.sourceLanguage}` : "Translated";
  return (
    <div className={`ad-sub-tr${compact ? " is-compact" : ""}`}>
      <div className="ad-sub-tr-text">{children}</div>
      <div className="ad-sub-tr-original">
        <span className="ad-sub-tr-from">{from}</span>
        <span className="ad-sub-tr-original-text">{compact ? "Original: " : ""}{original}</span>
      </div>
    </div>
  );
}
