import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const IMPACT_CALCULATOR_CONFIG = {
  monthlyBill: {
    min: 3000,
    max: 200000,
    step: 1,
    defaultValue: 1000,
  },
  electricRate: {
    min: 8,
    max: 20,
    step: 0.01,
    defaultValue: 11.07,
  },
  formula: {
    averageSolarProductionPerKwp: 120,
    estimatedSavingsRate: 0.87,
    projectionYears: 10,
    monthsPerYear: 12,
  },
  labels: {
    monthlyBillMin: "₱3k",
    monthlyBillMax: "₱100k+",
    electricRateMin: "₱8",
    electricRateMax: "₱20",
  },
  animation: {
    duration: 1200,
  },
};

function formatSystemSize(value: number) {
  if (value >= 1000) {
    return {
      value: (value / 1000).toFixed(1),
      unit: "MWp",
    };
  }

  return {
    value: value.toFixed(1),
    unit: "kWp",
  };
}

function useInitialRollingNumber(targetValue: number, shouldAnimate: boolean) {
  const [displayValue, setDisplayValue] = useState(0);
  const hasRolled = useRef(false);

  useEffect(() => {
    if (!shouldAnimate) return;

    if (hasRolled.current) {
      setDisplayValue(targetValue);
      return;
    }

    hasRolled.current = true;

    let animationFrame: number;
    const startTime = performance.now();
    const startValue = 0;
    const difference = targetValue - startValue;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;

      const progress = Math.min(
        elapsed / IMPACT_CALCULATOR_CONFIG.animation.duration,
        1
      );

      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + difference * easedProgress;

      setDisplayValue(nextValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValue);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [targetValue, shouldAnimate]);

  return displayValue;
}

export default function ASImpactCalculator() {
  const navigate = useNavigate();

  const sectionRef = useRef<HTMLElement | null>(null);
  const hasAnimated = useRef(false);

  const [isShown, setIsShown] = useState(false);

  const [monthlyBill, setMonthlyBill] = useState(
    IMPACT_CALCULATOR_CONFIG.monthlyBill.defaultValue
  );

  const [electricRate, setElectricRate] = useState(
    IMPACT_CALCULATOR_CONFIG.electricRate.defaultValue
  );

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

  const results = useMemo(() => {
    const monthlyKwh = monthlyBill / electricRate;

    const systemSize =
      monthlyKwh /
      IMPACT_CALCULATOR_CONFIG.formula.averageSolarProductionPerKwp;

    const roundedSystemSize = Math.max(1, Number(systemSize.toFixed(1)));

    const estimatedMonthlySavings =
      monthlyBill * IMPACT_CALCULATOR_CONFIG.formula.estimatedSavingsRate;

    const annualSavings =
      estimatedMonthlySavings *
      IMPACT_CALCULATOR_CONFIG.formula.monthsPerYear;

    const tenYearSavings =
      annualSavings * IMPACT_CALCULATOR_CONFIG.formula.projectionYears;

    return {
      monthlyKwh: Math.round(monthlyKwh),
      systemSize: roundedSystemSize,
      estimatedMonthlySavings: Math.round(estimatedMonthlySavings),
      annualSavings: Math.round(annualSavings),
      tenYearSavings: Math.round(tenYearSavings),
    };
  }, [monthlyBill, electricRate]);

  const rollingSystemSize = useInitialRollingNumber(results.systemSize, isShown);

  const rollingTenYearSavings = useInitialRollingNumber(
    results.tenYearSavings,
    isShown
  );

  const formattedSystemSize = formatSystemSize(rollingSystemSize);

  const monthlyBillProgress =
    ((monthlyBill - IMPACT_CALCULATOR_CONFIG.monthlyBill.min) /
      (IMPACT_CALCULATOR_CONFIG.monthlyBill.max -
        IMPACT_CALCULATOR_CONFIG.monthlyBill.min)) *
    100;

  const electricRateProgress =
    ((electricRate - IMPACT_CALCULATOR_CONFIG.electricRate.min) /
      (IMPACT_CALCULATOR_CONFIG.electricRate.max -
        IMPACT_CALCULATOR_CONFIG.electricRate.min)) *
    100;

  const handleGetQuote = () => {
    navigate("/quotation-engine", {
      state: {
        monthlyBill,
        electricRate,
        monthlyKwh: results.monthlyKwh,
        systemSize: results.systemSize,
        estimatedMonthlySavings: results.estimatedMonthlySavings,
        annualSavings: results.annualSavings,
        tenYearSavings: results.tenYearSavings,
      },
    });
  };

  return (
    <section
      ref={sectionRef}
      className={`as-impact ${isShown ? "is-shown" : ""}`}
    >
      <div className="as-impact-overlay" />

      <div className="as-impact-content">
        <div className="as-impact-heading">
          <h2>Calculate Your Savings</h2>
          <p>
            See how much you could save over the 10-year warrantied lifespan of
            your system.
          </p>
        </div>

        <div className="as-impact-card">
          <div className="as-slider-group as-delay-1">
            <p className="as-slider-question">
              What is your average monthly electric bill?
            </p>

            <div className="as-slider-labels">
              <span>{IMPACT_CALCULATOR_CONFIG.labels.monthlyBillMin}</span>
              <span>{IMPACT_CALCULATOR_CONFIG.labels.monthlyBillMax}</span>
            </div>

            <input
              type="range"
              min={IMPACT_CALCULATOR_CONFIG.monthlyBill.min}
              max={IMPACT_CALCULATOR_CONFIG.monthlyBill.max}
              step={IMPACT_CALCULATOR_CONFIG.monthlyBill.step}
              value={monthlyBill}
              onChange={(e) => setMonthlyBill(Number(e.target.value))}
              className="as-range"
              style={
                {
                  "--progress": `${monthlyBillProgress}%`,
                } as React.CSSProperties
              }
            />

            <div className="as-current-value">
              <strong>
                ₱{" "}
                {monthlyBill.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
              </strong>
              <span>/ month</span>
            </div>
          </div>

          <div className="as-slider-group as-delay-2">
            <p className="as-slider-question">
              What is your typical residential rate?
            </p>

            <div className="as-slider-labels">
              <span>{IMPACT_CALCULATOR_CONFIG.labels.electricRateMin}</span>
              <span>{IMPACT_CALCULATOR_CONFIG.labels.electricRateMax}</span>
            </div>

            <input
              type="range"
              min={IMPACT_CALCULATOR_CONFIG.electricRate.min}
              max={IMPACT_CALCULATOR_CONFIG.electricRate.max}
              step={IMPACT_CALCULATOR_CONFIG.electricRate.step}
              value={electricRate}
              onChange={(e) => setElectricRate(Number(e.target.value))}
              className="as-range"
              style={
                {
                  "--progress": `${electricRateProgress}%`,
                } as React.CSSProperties
              }
            />

            <div className="as-current-value">
              <strong>₱ {electricRate.toFixed(2)}</strong>
              <span>/ kWh</span>
            </div>
          </div>

          <div className="as-impact-divider as-delay-3" />

          <div className="as-impact-results as-delay-4">
            <div>
              <p className="as-result-label">ESTIMATED SYSTEM SIZE</p>
              <p className="as-system-size">
                {formattedSystemSize.value} <span>{formattedSystemSize.unit}</span>
              </p>
            </div>

            <div>
              <p className="as-result-label">10-YEAR SAVINGS</p>
              <p className="as-savings">
                ₱{" "}
                {Math.round(rollingTenYearSavings).toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
          </div>

          <button
            className="as-impact-button as-delay-5"
            onClick={handleGetQuote}
          >
            Get This System Quote
          </button>

          <p className="as-impact-note as-delay-6">
            *Estimates are based on the selected electricity rate and average
            Metro Manila solar irradiance. Actual results may vary.
          </p>
        </div>
      </div>
    </section>
  );
}