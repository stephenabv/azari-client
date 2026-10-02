import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useScrollLock } from "../hooks/useScrollLock";

/**
 * Below this width the popover renders as a bottom sheet (see as_select_menu.less).
 * The sheet is portalled to <body> so transformed page ancestors cannot
 * re-anchor its fixed positioning.
 */
const SHEET_QUERY = "(max-width: 576px)";

export interface SelectMenuOption<T> {
  value: T;
  /** Plain-text label; also the accessible name when `content` is an image. */
  label: string;
  /** Optional rich rendering (logo, flag, …) used in place of the label. */
  content?: ReactNode;
  /** Language of the label, for options written in another language. */
  lang?: string;
}

export type SelectMenuPlacement = "below" | "above";

export interface ASSelectMenuProps<T> {
  options: readonly SelectMenuOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Visible label beside the trigger. */
  label?: string;
  /** Small heading at the top of the popover; also the listbox's accessible name. */
  heading: string;
  placement?: SelectMenuPlacement;
  icon?: ReactNode;
  /** Marks the trigger as holding a non-default choice. */
  highlighted?: boolean;
  className?: string;
}

/**
 * Accessible single-select dropdown (WAI-ARIA listbox pattern) shared by the
 * site's filters and the footer language switcher. Becomes a bottom sheet on
 * phones.
 */
export default function ASSelectMenu<T>({
  options,
  value,
  onChange,
  label,
  heading,
  placement = "below",
  icon,
  highlighted = false,
  className,
}: ASSelectMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSheet, setIsSheet] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);
  const listId = useId();
  const labelId = useId();

  const selectedIndex = Math.max(0, options.findIndex((o) => Object.is(o.value, value)));
  const selected = options[selectedIndex];

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

  const select = (option: SelectMenuOption<T>) => {
    close(true);
    if (!Object.is(option.value, value)) onChange(option.value);
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
    const last = options.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + options.length) % options.length);
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(last);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        select(options[activeIndex]);
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

  if (!selected) return null;

  const rootClass = ["as-select", `is-${placement}`, open && "is-open", className].filter(Boolean).join(" ");

  return (
    <div className={rootClass} ref={rootRef}>
      {label && <span className="as-select-label" id={labelId}>{label}</span>}
      <button
        ref={triggerRef}
        type="button"
        className={`as-select-trigger${highlighted ? " has-value" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={`${label ? `${labelId} ` : ""}${listId}-value`}
        onClick={() => (open ? close(false) : openList())}
        onKeyDown={onTriggerKeyDown}
      >
        <span id={`${listId}-value`} className="as-select-value" lang={selected.lang}>
          {selected.content ?? selected.label}
        </span>
        {icon}
      </button>

      {open && renderPopover(
        <>
          <div className="as-select-backdrop" aria-hidden="true" onClick={() => close(true)} />
          <div className="as-select-popover" ref={popoverRef}>
            <div className="as-select-heading">{heading}</div>
            <ul
              id={listId}
              role="listbox"
              aria-label={heading}
              className="as-select-list"
              onKeyDown={onListKeyDown}
            >
              {options.map((option, i) => {
                const isSelected = i === selectedIndex;
                return (
                  <li
                    key={String(option.value)}
                    ref={(el) => { optionRefs.current[i] = el; }}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={i === activeIndex ? 0 : -1}
                    lang={option.lang}
                    className={`as-select-option${isSelected ? " is-selected" : ""}`}
                    onClick={() => select(option)}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    {option.content ?? <span className="as-select-option-label">{option.label}</span>}
                    <span className="as-select-radio" aria-hidden="true" />
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
