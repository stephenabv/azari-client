import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { LOCALES, LocalePath, LocalePreference, findLocale, useLocale, useT } from "../i18n";
import ASSelectMenu, { type SelectMenuOption, type SelectMenuPlacement } from "./ASSelectMenu";

function GlobeIcon() {
  return (
    <svg className="as-select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

/**
 * Lists every registered locale by its native name. Choosing one remembers it
 * and moves to the same page in that language, keeping query and hash.
 */
export default function ASLanguageSwitcher({ placement = "above" }: { placement?: SelectMenuPlacement }) {
  const t = useT();
  const locale = useLocale();
  const navigate = useNavigate();
  const { pathname, search, hash } = useLocation();

  const options = useMemo<SelectMenuOption<string>[]>(
    () => LOCALES.map((l) => ({ value: l.code, label: l.nativeName, lang: l.tag })),
    [],
  );

  const handleChange = (code: string) => {
    const next = findLocale(code);
    if (!next) return;
    LocalePreference.save(next);
    navigate(`${LocalePath.parse(pathname).withLocale(next).toString()}${search}${hash}`);
  };

  return (
    <ASSelectMenu
      className="as-language-switcher"
      options={options}
      value={locale.code}
      onChange={handleChange}
      heading={t("language.choose")}
      placement={placement}
      icon={<GlobeIcon />}
    />
  );
}
