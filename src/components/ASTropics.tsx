import { useEffect, useRef, useState } from "react";
import ASTropicsCards from "./ASTropicsCards";
import { useContent } from "../hooks/useContent";

type TropicsContent = {
  header: string;
  subtext: string;
  performanceRating: number;
};

type MetricsContent = {
  items: Array<{ value: string; label: string; order: number }>;
};

const DEFAULT_TROPICS: TropicsContent = {
  header: "Solar Energy for the Tropics",
  subtext:
    "Standard solar systems are often not equipped to handle the unique challenges of the tropics. At Azari Solar we bridge the Trust Gap with resilient design for the philippine archipelago.",
  performanceRating: 87,
};

const DEFAULT_METRICS: MetricsContent = {
  items: [{ value: "0", label: "INSTALLED", order: 1 }],
};

/**
 * The heading is shown on two lines. CMS text may mark the break with a
 * newline or <br>; without one, the last word goes on the second line. The
 * old fallback appended a hard-coded "Tropics" instead, so a one-line heading
 * such as "Solar Energy for the Tropics" rendered as "...Tropics Tropics".
 */
function splitHeading(text: string): [string, string] {
  const parts = text
    .split(/\n|<br\s*\/?\s*>/i)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length > 1) return [parts[0] ?? "", parts.slice(1).join(" ")];

  const words = (parts[0] ?? "").split(/\s+/).filter(Boolean);
  return [words.slice(0, -1).join(" "), words.at(-1) ?? ""];
}

export default function ASTropicsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasAnimated = useRef(false);

  const [isVisible, setIsVisible] = useState(false);
  const [showText, setShowText] = useState(false);
  const tropics = useContent<TropicsContent>("tropics", DEFAULT_TROPICS);
  const metrics = useContent<MetricsContent>("metrics", DEFAULT_METRICS);
  const installedValue = metrics.items.find((i) => i.label === "INSTALLED")?.value ?? "0";

  const [headerTop, headerBottom] = splitHeading(tropics.header);

  // Normalize domain form ("azari.solar") to brand name wherever it appears as company name
  const normalizedSubtext = tropics.subtext.replace(/azari\.solar/gi, "Azari Solar");
  const brandIdx = normalizedSubtext.indexOf("Azari Solar");
  const subtextBeforeBrand = brandIdx >= 0 ? normalizedSubtext.slice(0, brandIdx) : normalizedSubtext;
  const subtextAfterBrand = brandIdx >= 0 ? normalizedSubtext.slice(brandIdx + "Azari Solar".length) : "";
  const hasBrand = brandIdx >= 0;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const timeouts: number[] = [];

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;

        hasAnimated.current = true;

        timeouts.push(
          window.setTimeout(() => setIsVisible(true), 200),
          window.setTimeout(() => setShowText(true), 600)
        );

        observer.disconnect();
      },
      { threshold: 0.25 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <section ref={sectionRef} className="as-tropics-section">
      <ASTropicsCards
          isVisible={isVisible}
          assetsDeployed={installedValue}
          performanceRating={tropics.performanceRating ?? 87}
        />

      <div className={`as-tropics-text ${showText ? "is-shown" : ""}`}>
        <p className="header">
          {headerTop} <br />
          {headerBottom}
        </p>

        <p className="subtext">
          {subtextBeforeBrand}
          {hasBrand && <span>Azari Solar</span>}
          {subtextAfterBrand}
        </p>
      </div>
    </section>
  );
}
