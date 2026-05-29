import { useState, useEffect, useRef, useCallback } from "react";

export type NominatimResult = {
  place_id: number;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    municipality?: string;
    city_district?: string;
    county?: string;
    state?: string;
    province?: string;
    region?: string;
  };
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (result: NominatimResult) => void;
  extractValue?: (result: NominatimResult) => string;
  placeholder?: string;
  inputClassName?: string;
  wrapperStyle?: React.CSSProperties;
};

export function formatSuggestion(displayName: string): string {
  return displayName.replace(/,\s*Philippines$/i, "").trim();
}

export default function LocationAutocompleteInput({
  value,
  onChange,
  onSelect,
  extractValue,
  placeholder,
  inputClassName,
  wrapperStyle,
}: Props) {
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const search = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ph&limit=5&addressdetails=1`;
        const res = await fetch(url, {
          signal: abortRef.current.signal,
          headers: { "Accept-Language": "en" },
        });
        const data = (await res.json()) as NominatimResult[];
        setSuggestions(data);
        setOpen(data.length > 0);
        setActiveIdx(-1);
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          setSuggestions([]);
          setOpen(false);
        }
      }
    }, 400);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    search(e.target.value);
  };

  const select = (result: NominatimResult) => {
    const val = extractValue
      ? extractValue(result)
      : formatSuggestion(result.display_name);
    onChange(val);
    onSelect?.(result);
    setSuggestions([]);
    setOpen(false);
    setActiveIdx(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      select(suggestions[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="as-location-ac" style={wrapperStyle}>
      <input
        type="text"
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        className={inputClassName}
        autoComplete="off"
        spellCheck={false}
      />
      {open && suggestions.length > 0 && (
        <ul className="as-location-ac-list" role="listbox">
          {suggestions.map((s, i) => (
            <li
              key={s.place_id}
              role="option"
              aria-selected={i === activeIdx}
              className={`as-location-ac-item${i === activeIdx ? " is-active" : ""}`}
              onMouseDown={(e) => { e.preventDefault(); select(s); }}
            >
              {formatSuggestion(s.display_name)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
