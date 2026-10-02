import { useMemo } from "react";
import { useLocale, useT, type MessageKey } from "../i18n";

type SecondsForm = "one" | "few" | "many" | "other";

const COUNT_KEYS: Readonly<Record<SecondsForm, MessageKey>> = {
  one: "system.seconds.count.one",
  few: "system.seconds.count.few",
  many: "system.seconds.count.many",
  other: "system.seconds.count.other",
};

const UNIT_KEYS: Readonly<Record<SecondsForm, MessageKey>> = {
  one: "system.seconds.unit.one",
  few: "system.seconds.unit.few",
  many: "system.seconds.unit.many",
  other: "system.seconds.unit.other",
};

/** Maps CLDR categories we have no message for ("zero", "two") onto "other". */
function toForm(category: Intl.LDMLPluralRule): SecondsForm {
  return category === "one" || category === "few" || category === "many" ? category : "other";
}

export interface SecondsLabel {
  /** "5 seconds", "1 second", "5秒", "5 секунд"... */
  count(n: number): string;
  /** The unit alone, inflected for n: "seconds", "секунд". */
  unit(n: number): string;
}

/** Locale-aware, plural-correct wording for a number of seconds. */
export function useSecondsLabel(): SecondsLabel {
  const t = useT();
  const { tag } = useLocale();
  const rules = useMemo(() => new Intl.PluralRules(tag), [tag]);

  return useMemo(
    () => ({
      count: (n) => t(COUNT_KEYS[toForm(rules.select(n))], { n }),
      unit: (n) => t(UNIT_KEYS[toForm(rules.select(n))]),
    }),
    [t, rules],
  );
}

/**
 * Splits a translated sentence around one `{slot}` placeholder so the slot can
 * be rendered as markup (e.g. bold) while word order stays per-language.
 */
export function splitAtSlot(template: string, slot: string): [before: string, after: string] {
  const marker = `{${slot}}`;
  const at = template.indexOf(marker);
  if (at < 0) return [template, ""];
  return [template.slice(0, at), template.slice(at + marker.length)];
}
