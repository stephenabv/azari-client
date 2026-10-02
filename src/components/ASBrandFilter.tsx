import { useMemo } from "react";
import type { BrandOption } from "../services/packages/InverterBrandCatalog";
import { useT } from "../i18n";
import ASSelectMenu, { type SelectMenuOption } from "./ASSelectMenu";

type ASBrandFilterProps = {
  options: BrandOption[];
  /** Selected brand key, or null for all brands. */
  value: string | null;
  onChange: (key: string | null) => void;
  label?: string;
};

function BrandMark({ label, logoUrl }: { label: string; logoUrl: string | null }) {
  return logoUrl ? (
    <img className="as-brand-filter-logo" src={logoUrl} alt={label} loading="lazy" decoding="async" />
  ) : (
    <span className="as-brand-filter-name">{label}</span>
  );
}

function FilterIcon() {
  return (
    <svg className="as-select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M3 6h18M6 12h12M10 18h4" />
    </svg>
  );
}

export default function ASBrandFilter({ options, value, onChange, label }: ASBrandFilterProps) {
  const t = useT();

  const menuOptions = useMemo<SelectMenuOption<string | null>[]>(
    () => [
      { value: null, label: t("brandFilter.all") },
      ...options.map((o) => ({
        value: o.key,
        label: o.label,
        content: <BrandMark label={o.label} logoUrl={o.logoUrl} />,
      })),
    ],
    [options, t],
  );

  return (
    <ASSelectMenu
      className="as-brand-filter"
      options={menuOptions}
      value={value}
      onChange={onChange}
      label={label ?? t("brandFilter.label")}
      heading={t("brandFilter.heading")}
      icon={<FilterIcon />}
      highlighted={value !== null}
    />
  );
}
