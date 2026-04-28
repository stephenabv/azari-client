import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ASTalkToAnExpert from "../modules/talk-to-expert-modal/ASTalkToAnExpert";


export default function ASCallToAction() {
  const navigate = useNavigate();

  const sectionRef = useRef<HTMLElement | null>(null);
  const hasAnimated = useRef(false);
  const [isShown, setIsShown] = useState(false);

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
          Ready to engineer your <br />
          <span>energy independence?</span>
        </h2>

        <p className="as-cta-description">
          Take control of your energy bills. Get a free quote or talk to an expert
        </p>

        <div className="as-cta-actions">
          <button
            type="button"
            className="as-cta-primary"
            onClick={() => navigate("/quotation-engine")}
          >
            Get a free Quote ↗
          </button>

          <button
            type="button"
            className="as-cta-secondary"
            onClick={() => setIsModalOpen(true)}
          >
            Talk to an Expert
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