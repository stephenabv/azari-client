import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactElement } from "react";
import { createPortal } from "react-dom";
import type { BrandOption } from "../services/packages/InverterBrandCatalog";
import { useScrollLock } from "../hooks/useScrollLock";

/**
 * Below this width the popover renders as a bottom sheet (see as_packages.less).
 * The sheet is portalled to <body> so transformed page ancestors cannot
 * re-anchor its fixed positioning.
 */
const SHEET_QUERY = "(max-width: 576px)";

type ASBrandFilterProps = {
  options: BrandOption[];
  /** Selected brand key, or null for all brands. */
  value: string | null;
  onChange: (key: string | null) => void;
  label?: string;
};

type Row = { key: string | null; label: string; logoUrl: string | null };

function BrandMark({ label, logoUrl }: { label: string; logoUrl: string | null }) {
  return logoUrl ? (
    <img className="as-brand-filter-logo" src={logoUrl} alt={label} loading="lazy" decoding="async" />
  ) : (
    <span className="as-brand-filter-name">{label}</span>
  );
}

function FilterIcon() {
  return (
    <svg className="as-brand-filter-icon" width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M3 6h18M6 12h12M10 18h4" />
    </svg>
  );
}

export default function ASBrandFilter({ options, value, onChange, label = "Filter by inverter brand:" }: ASBrandFilterProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSheet, setIsSheet] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);
  const listId = useId();
  const labelId = useId();

  const rows: Row[] = [{ key: null, label: "All brands", logoUrl: null }, ...options];
  const selectedIndex = Math.max(0, rows.findIndex((r) => r.key === value));
  const selected = rows[selectedIndex];

  useScrollLock(open && isSheet);

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  const openList = () => {
    setIsSheet(window.matchMedia(SHEET_QUERY).matches);
    setActiveIndex(selectedIndex);
    setOpen(true);
  };

  const select = (row: Row) => {
    onChange(row.key);
    close(true);
  };

  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!rootRef.current?.contains(target) && !popoverRef.current?.contains(target)) close(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % rows.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + rows.length) % rows.length);
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(rows.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        select(rows[activeIndex]);
        break;
      case "Escape":
        e.preventDefault();
        close(true);
        break;
      case "Tab":
        close(false);
        break;
    }
  };

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      openList();
    }
  };

  const renderPopover = (content: ReactElement) => (isSheet ? createPortal(content, document.body) : content);

  return (
    <div className={`as-brand-filter${open ? " is-open" : ""}`} ref={rootRef}>
      <span className="as-brand-filter-label" id={labelId}>{label}</span>
      <button
        ref={triggerRef}
        type="button"
        className={`as-brand-filter-trigger${value ? " has-value" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={`${labelId} ${listId}-value`}
        onClick={() => (open ? close(false) : openList())}
        onKeyDown={onTriggerKeyDown}
      >
        <span id={`${listId}-value`} className="as-brand-filter-value">
          {selected.key ? <BrandMark label={selected.label} logoUrl={selected.logoUrl} /> : selected.label}
        </span>
        <FilterIcon />
      </button>

      {open && renderPopover(
        <>
          <div className="as-brand-filter-backdrop" aria-hidden="true" onClick={() => close(true)} />
          <div className="as-brand-filter-popover" ref={popoverRef}>
            <div className="as-brand-filter-heading">Inverter brand</div>
            <ul
              id={listId}
              role="listbox"
              aria-label="Inverter brand"
              className="as-brand-filter-list"
              onKeyDown={onListKeyDown}
            >
              {rows.map((row, i) => {
                const isSelected = i === selectedIndex;
                return (
                  <li
                    key={row.key ?? "__all"}
                    ref={(el) => { optionRefs.current[i] = el; }}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={i === activeIndex ? 0 : -1}
                    className={`as-brand-filter-option${isSelected ? " is-selected" : ""}`}
                    onClick={() => select(row)}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    <BrandMark label={row.label} logoUrl={row.logoUrl} />
                    <span className="as-brand-filter-radio" aria-hidden="true" />
                  </li>
                );
              })}
            </ul>
          </div>
        </>,
      )}
    </div>
  );
}
