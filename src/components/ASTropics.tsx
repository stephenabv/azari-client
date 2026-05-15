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

  const [visibleCards, setVisibleCards] = useState(-1);
  const [showText, setShowText] = useState(false);
  const tropics = useContent<TropicsContent>("tropics", DEFAULT_TROPICS);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const timeouts: number[] = [];

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;

        hasAnimated.current = true;

        timeouts.push(
          window.setTimeout(() => setVisibleCards(0), 200),
          window.setTimeout(() => setVisibleCards(1), 550),
          window.setTimeout(() => setVisibleCards(2), 900),
          window.setTimeout(() => setShowText(true), 1350)
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
      <ASTropicsCards visibleCards={visibleCards} />

      <div className={`as-tropics-text ${showText ? "is-shown" : ""}`}>
        <p className="header">{tropics.header}</p>

        <p className="subtext">{tropics.subtext}</p>
      </div>
    </section>
  );
}