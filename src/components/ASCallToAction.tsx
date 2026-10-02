import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router";

const ASTalkToAnExpert = lazy(() => import("../modules/talk-to-expert-modal/ASTalkToAnExpert"));
import { useContent } from "../hooks/useContent";
import { DEFAULT_LOCALE, useLocale, useLocalizedPath, useT } from "../i18n";

type CtaContent = {
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
};

const DEFAULT_CTA: CtaContent = {
  title: "Ready to engineer your energy independence?",
  description:
    "Take control of your energy bills. Get a free quote or talk to an expert",
  primaryCta: "Get a free Quote",
  secondaryCta: "Talk to an Expert",
};

const ENGLISH_HIGHLIGHT = "energy independence";

/**
 * Splits the CMS title into a plain lead-in and a highlighted tail. The English
 * title highlights "energy independence?"; a translated title is matched against
 * this locale's highlight phrase. A title matching neither is shown whole rather
 * than replaced, and an empty title falls back to the built-in wording.
 */
function splitCtaTitle(
  title: string,
  fallback: { prefix: string; highlight: string },
): { titlePrefix: string; titleHighlight: string } {
  const text = title?.trim() ?? "";
  if (!text) return { titlePrefix: fallback.prefix, titleHighlight: fallback.highlight };

  if (text.includes(ENGLISH_HIGHLIGHT)) {
    return { titlePrefix: text.split(ENGLISH_HIGHLIGHT)[0].trimEnd(), titleHighlight: `${ENGLISH_HIGHLIGHT}?` };
  }

  const at = text.indexOf(fallback.highlight);
  if (at > 0) {
    return { titlePrefix: text.slice(0, at).trimEnd(), titleHighlight: text.slice(at) };
  }

  return { titlePrefix: text, titleHighlight: "" };
}

export default function ASCallToAction() {

  const sectionRef = useRef<HTMLElement | null>(null);
  const hasAnimated = useRef(false);
  const [isShown, setIsShown] = useState(false);
  const cta = useContent<CtaContent>("cta", DEFAULT_CTA);
  const localize = useLocalizedPath();

  const t = useT();
  const locale = useLocale();
  // English keeps its long-standing rendering exactly; other languages use the
  // locale-aware split so a translated title is never replaced by English.
  const { titlePrefix, titleHighlight } = locale === DEFAULT_LOCALE
    ? {
        titlePrefix: cta.title.includes(ENGLISH_HIGHLIGHT)
          ? cta.title.split(ENGLISH_HIGHLIGHT)[0].trimEnd()
          : "Ready to engineer your",
        titleHighlight: `${ENGLISH_HIGHLIGHT}?`,
      }
    : splitCtaTitle(cta.title, {
        prefix: t("system.cta.titlePrefix"),
        highlight: t("system.cta.titleHighlight"),
      });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;

        hasAnimated.current = true;
        setIsShown(true);
        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className={`as-cta-section ${isShown ? "is-shown" : ""}`}
      >
        <h2 className="as-cta-title">
          {titlePrefix}
          {titleHighlight && (
            <>
              {" "}
              <br />
              <span>{titleHighlight}</span>
            </>
          )}
        </h2>

        <p className="as-cta-description">{cta.description}</p>

        <div className="as-cta-actions">
          <Link
            to={localize("/solar-calculator")}
            className="as-cta-primary"
          >
            {cta.primaryCta.replace(/\s*↗\s*$/, "")}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true" style={{ flexShrink: 0 }}>
              <line x1="5" y1="19" x2="19" y2="5" />
              <polyline points="5 5 19 5 19 19" />
            </svg>
          </Link>

          <button
            type="button"
            className="as-cta-secondary"
            onClick={() => setIsModalOpen(true)}
          >
            {cta.secondaryCta}
          </button>
        </div>
      </section>

      <Suspense fallback={null}>
        <ASTalkToAnExpert
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </Suspense>
    </>
  );
}
