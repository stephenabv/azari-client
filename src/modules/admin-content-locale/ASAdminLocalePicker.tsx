import { DEFAULT_LOCALE, LOCALES, type LocaleDefinition } from "../../i18n/locales";

type Props = {
  value: LocaleDefinition;
  onChange: (locale: LocaleDefinition) => void;
};

/** Chooses which language version of the site content the editors below edit. */
export default function ASAdminLocalePicker({ value, onChange }: Props) {
  const isDefault = value === DEFAULT_LOCALE;
  return (
    <div className="ad-locale-picker">
      <label className="ad-locale-picker-field">
        <span className="ad-locale-picker-label">Editing language</span>
        <select
          className="ad-select"
          value={value.code}
          onChange={(e) => onChange(LOCALES.find((l) => l.code === e.target.value) ?? DEFAULT_LOCALE)}
        >
          {LOCALES.map((l) => (
            <option key={l.code} value={l.code} lang={l.tag}>
              {l.nativeName}{l === DEFAULT_LOCALE ? " (default)" : ""}
            </option>
          ))}
        </select>
      </label>
      <p className="ad-locale-picker-hint">
        {isDefault
          ? "English is shown to every visitor whose language has no translation yet."
          : `Fields start with the English text until you save a ${value.nativeName} version. Reset removes the ${value.nativeName} version so visitors see English again.`}
      </p>
    </div>
  );
}
