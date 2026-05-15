import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ASTalkToAnExpert from "../modules/talk-to-expert-modal/ASTalkToAnExpert";
import { useContent } from "../hooks/useContent";

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
  primaryCta: "Get a free Quote ↗",
  secondaryCta: "Talk to an Expert",
};

export default function ASCallToAction() {
  const navigate = useNavigate();

  const sectionRef = useRef<HTMLElement | null>(null);
  const hasAnimated = useRef(false);
  const [isShown, setIsShown] = useState(false);
  const cta = useContent<CtaContent>("cta", DEFAULT_CTA);

  const titlePrefix = cta.title.includes("energy independence")
    ? cta.title.split("energy independence")[0].trimEnd()
    : "Ready to engineer your";

  const titleHighlight = cta.title.includes("energy independence")
    ? "energy independence?"
    : "energy independence?";

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
          {titlePrefix} <br />
          <span>{titleHighlight}</span>
        </h2>

        <p className="as-cta-description">{cta.description}</p>

        <div className="as-cta-actions">
          <button
            type="button"
            className="as-cta-primary"
            onClick={() => navigate("/quotation-engine")}
          >
            {cta.primaryCta}
          </button>

          <button
            type="button"
            className="as-cta-secondary"
            onClick={() => setIsModalOpen(true)}
          >
            {cta.secondaryCta}
          </button>
        </div>
      </section>

      <ASTalkToAnExpert
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}