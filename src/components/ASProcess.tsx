import { useEffect, useRef, useState } from "react";
import lightBg from "../assets/videos/bg_hero_section_light.mp4";


const steps = [
  {
    number: "01",
    title: "Consumption Audit",
    description:
      "We don't guess; we calculate. Our engineers analyze your historical electricity bill data to build a custom ROI map tailored to your specific energy habits. You'll know exactly how much you'll save before we even touch your roof.",
  },
  {
    number: "02",
    title: "Resilient Engineering",
    description:
      "A Licensed Professional Electrical Engineer (PEE) conducts a 100-point structural and shading audit. We design your system to withstand 250 kph winds and maintain peak yield in 40°C+ tropical heat using Global Tier-1 components.",
  },
  {
    number: "03",
    title: "Turnkey Activation",
    description:
      "From Barangay clearances to energy providers Net-Metering permits, we handle the bureaucracy. Our certified in-house teams manage the full installation and grid interconnection, leaving you with nothing to do but flip the switch.",
  },
];

export default function ASProcessSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasAnimated = useRef(false);

  const [activeStep, setActiveStep] = useState(-1);
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const timeouts: number[] = [];

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;

        hasAnimated.current = true;

        steps.forEach((_, index) => {
          timeouts.push(
            window.setTimeout(() => {
              setActiveStep(index);
            }, (index + 1) * 1100)
          );
        });

        timeouts.push(
          window.setTimeout(() => {
            setShowFooter(true);
          }, (steps.length + 1) * 1100)
        );

        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const progressWidth =
    activeStep < 0 ? 0 : ((activeStep + 1) / steps.length) * 100;

  return (
    <section ref={sectionRef} className="as-process">
      <div className="as-process-steps">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className={`as-process-step ${index <= activeStep ? "is-shown" : ""
              }`}
          >
            <span className="as-process-number">{step.number}</span>
            <p className="as-process-title">{step.title}</p>
          </div>
        ))}
      </div>

      <div className="as-process-line">
        <div className="as-process-line-track" />
        <div
          className="as-process-line-bar"
          style={{ width: `${progressWidth}%` }}
        />
        <div
          className="as-process-line-dot"
          style={{
            left: `${progressWidth}%`,
            opacity: activeStep < 0 ? 0 : 1,
          }}
        />
      </div>

      <div className="as-process-content">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className={`as-process-card ${index <= activeStep ? "is-shown" : ""
              }`}
          >
            <p className="as-process-card-title">{step.title}</p>
            <p className="as-process-card-description">{step.description}</p>
          </div>
        ))}
      </div>

      <div className={`as-process-footer ${showFooter ? "is-shown" : ""}`}>
        <div className="as-process-video">
          <video
            src={lightBg}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        </div>

        <div className="as-process-cta">
          <p>Your Path to Energy Independence</p>
          <button>Get Started</button>
        </div>
      </div>
    </section>
  );
}