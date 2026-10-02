import { useEffect, useRef, useState } from "react";
import { DEFAULT_LOCALE } from "../../i18n/locales";
import { adminGetAllContent, LOCALIZABLE_CONTENT_KEYS } from "../../services/ASContent";
import { adminTranslateDraft } from "../../services/ASTranslations";
import { useAdminContentLocale } from "../admin-content-locale/AdminContentLocale";

/**
 * Applies a machine-translated draft to an editor's form state.
 * @param english The English content the draft was made from.
 * @param draft   The same shape with prose translated.
 * @returns How many fields were filled (for the confirmation message).
 */
export type ApplyContentDraft = (english: unknown, draft: unknown) => number;

export interface AutoTranslateDraftProps {
  apiKey: string;
  /** Site-content key whose English version is translated (e.g. "hero"). */
  contentKey: string;
  /** Defaults merged under the stored English object, matching how the editor loads it. */
  defaults?: object;
  onDraft: ApplyContentDraft;
  /** Receives Toast-style messages ("✓ …" for success, anything else is an error). */
  onMessage: (msg: string) => void;
  /** Button label; defaults to "Auto-translate draft from English". */
  label?: string;
}

/** Loads the English value of a content key, the same way the editors load it. */
async function loadEnglishContent(apiKey: string, contentKey: string, defaults?: object): Promise<unknown> {
  const res = await adminGetAllContent(apiKey);
  const item = res.data.find((i) => i.key === contentKey);
  const data = item?.data ?? null;
  if (defaults && (data === null || (typeof data === "object" && !Array.isArray(data)))) {
    return { ...defaults, ...((data as object | null) ?? {}) };
  }
  return data;
}

/**
 * "Auto-translate draft from English" for a localized site-content editor.
 * Renders nothing while the admin is editing English or for keys that are
 * shared by every language. The draft only fills the editor; nothing is saved
 * until the admin clicks the editor's own Save button.
 */
export default function AutoTranslateDraftButton({ apiKey, contentKey, defaults, onDraft, onMessage, label }: AutoTranslateDraftProps) {
  const locale = useAdminContentLocale();
  const [busy, setBusy] = useState(false);
  // The editor's form can change while the request is in flight; always apply to the latest one.
  const onDraftRef = useRef(onDraft);
  const onMessageRef = useRef(onMessage);
  useEffect(() => { onDraftRef.current = onDraft; onMessageRef.current = onMessage; });

  if (locale === DEFAULT_LOCALE || !LOCALIZABLE_CONTENT_KEYS.has(contentKey)) return null;

  const run = async () => {
    setBusy(true);
    onMessageRef.current("");
    try {
      const english = await loadEnglishContent(apiKey, contentKey, defaults);
      if (english === null || english === undefined) {
        onMessageRef.current("Error: there is no English content to translate yet.");
        return;
      }
      const draft = await adminTranslateDraft(apiKey, locale.tag, english);
      const filled = onDraftRef.current(english, draft);
      onMessageRef.current(filled > 0
        ? `✓ Draft filled ${filled} field${filled === 1 ? "" : "s"} in ${locale.nativeName} — review, then Save`
        : "✓ Nothing to fill — every field already has its own translation");
    } catch (e) {
      onMessageRef.current(`Error: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className="ad-btn ad-btn--secondary ad-btn--sm ad-tr-draft-btn"
      onClick={() => void run()}
      disabled={busy}
      title={`Machine-translates the English version into ${locale.nativeName} and fills fields that are empty or still in English. Nothing is saved until you click Save.`}
    >
      {busy ? "Translating…" : (label ?? "Auto-translate draft from English")}
    </button>
  );
}
