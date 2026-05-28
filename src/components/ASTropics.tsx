import { useEffect, useRef, useState } from "react";
import ASTropicsCards from "./ASTropicsCards";
import { useContent } from "../hooks/useContent";

type TropicsContent = {
  header: string;
  subtext: string;
};

const DEFAULT_TROPICS: TropicsContent = {
  header: "Solar Energy for the Tropics",
  subtext:
    "Standard solar systems are often not equipped to handle the unique challenges of the tropics. At azari.solar we bridge the Trust Gap with resilient design for the philippine archipelago.",
};

export default function ASTropicsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasAnimated = useRef(false);

  const [isVisible, setIsVisible] = useState(false);
  const [showText, setShowText] = useState(false);
  const tropics = useContent<TropicsContent>("tropics", DEFAULT_TROPICS);

  const headerParts = tropics.header
    .split(/\n|<br\s*\/?\s*>/i)
    .map((part) => part.trim())
    .filter(Boolean);

  const headerTop = headerParts[0] ?? "Solar Energy for the";
  const headerBottom = headerParts[1] ?? "Tropics";

  const brandedSubtext = tropics.subtext.includes("azari.solar")
    ? tropics.subtext
    : "Standard solar systems are often not equipped to handle the unique challenges of the tropics. At azari.solar we bridge the Trust Gap with resilient design for the philippine archipelago.";

  const [subtextBeforeBrand, subtextAfterBrand] = brandedSubtext.split("azari.solar");

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
      <ASTropicsCards isVisible={isVisible} />

      <div className={`as-tropics-text ${showText ? "is-shown" : ""}`}>
        <p className="header">
          {headerTop} <br />
          {headerBottom}
        </p>

        <p className="subtext">
          {subtextBeforeBrand}
          <span>azari.solar</span>
          {subtextAfterBrand}
        </p>
      </div>
    </section>
  );
}
