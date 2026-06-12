import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  calculateSolarEstimate,
  formatProjectionDescription,

  formatSystemSize,
  getProjectionMonths,
  SOLAR_CONSTANTS,
  ELECTRIC_RATE_CONFIG,
  MONTHLY_BILL_CONFIG,
} from "../models/calculation";

const DEFAULT_CONFIG = {
  monthlyBill: MONTHLY_BILL_CONFIG,
  electricRate: ELECTRIC_RATE_CONFIG,
  formula: {
    averageSolarProductionPerKwp: SOLAR_CONSTANTS.averageSolarProductionPerKwp,
    estimatedSavingsRate: SOLAR_CONSTANTS.estimatedSavingsRate,
    projectionYears: SOLAR_CONSTANTS.calculatorProjectionMonths,
    monthsPerYear: 0,
  },
  labels: {
    monthlyBillMin: "₱3k",
    monthlyBillMax: "₱100k+",
    electricRateMin: `₱${ELECTRIC_RATE_CONFIG.min}`,
    electricRateMax: `₱${ELECTRIC_RATE_CONFIG.max}`,
  },
  animation: {
    duration: 1200,
  },
};

function normalizeDecimalInput(value: string) {
  let cleaned = value.replace(/[^\d.]/g, "");
  cleaned = cleaned.replace(/(\..*?)\..*/g, "$1");
  cleaned = cleaned.replace(/^0+(?=\d)/, "");
  const dot = cleaned.indexOf(".");
  if (dot !== -1) cleaned = cleaned.slice(0, dot + 3);
  return cleaned;
}

function useInitialRollingNumber(
  targetValue: number,
  shouldAnimate: boolean,
  duration: number
) {
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
      const progress = Math.min(elapsed / duration, 1);
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
  }, [targetValue, shouldAnimate, duration]);

  return displayValue;
}

export default function ASImpactCalculator() {
  const navigate = useNavigate();

  const sectionRef = useRef<HTMLElement | null>(null);
  const hasAnimated = useRef(false);

  const [isShown, setIsShown] = useState(false);
  const [monthlyBillError, setMonthlyBillError] = useState("");
  const [electricRateError, setElectricRateError] = useState("");

  const [config] = useState(DEFAULT_CONFIG);

  const [monthlyBill, setMonthlyBill] = useState(
    DEFAULT_CONFIG.monthlyBill.defaultValue
  );

  const [electricRate, setElectricRate] = useState(
    DEFAULT_CONFIG.electricRate.defaultValue
  );

  const [monthlyBillInput, setMonthlyBillInput] = useState(
    String(DEFAULT_CONFIG.monthlyBill.defaultValue)
  );

  const [electricRateInput, setElectricRateInput] = useState(
    String(DEFAULT_CONFIG.electricRate.defaultValue)
  );

  const clampValue = (value: number, min: number, max: number) => {
    return Math.min(max, Math.max(min, value));
  };

  const handleMonthlyBillInput = (value: string) => {
    const cleaned = normalizeDecimalInput(value);
    setMonthlyBillInput(cleaned);
    if (cleaned === "" || cleaned === ".") {
      setMonthlyBill(0);
      setMonthlyBillError("");
      return;
    }
    const num = Number(cleaned);
    setMonthlyBill(num);
    if (num < config.monthlyBill.min) {
      setMonthlyBillError(`Minimum value is ₱${config.monthlyBill.min.toLocaleString()}`);
    } else if (num > config.monthlyBill.max) {
      setMonthlyBillError(`Maximum value is ₱${config.monthlyBill.max.toLocaleString()}`);
    } else {
      setMonthlyBillError("");
    }
  };

  const handleMonthlyBillBlur = () => {
    const clamped = clampValue(monthlyBill, config.monthlyBill.min, config.monthlyBill.max);
    setMonthlyBill(clamped);
    setMonthlyBillInput(String(parseFloat(clamped.toFixed(2))));
    setMonthlyBillError("");
  };

  const handleElectricRateInput = (value: string) => {
    const cleaned = normalizeDecimalInput(value);
    setElectricRateInput(cleaned);
    if (cleaned === "" || cleaned === ".") {
      setElectricRate(0);
      setElectricRateError("");
      return;
    }
    const num = Number(cleaned);
    setElectricRate(num);
    if (num < config.electricRate.min) {
      setElectricRateError(`Minimum value is ₱${config.electricRate.min}`);
    } else if (num > config.electricRate.max) {
      setElectricRateError(`Maximum value is ₱${config.electricRate.max}`);
    } else {
      setElectricRateError("");
    }
  };

  const handleElectricRateBlur = () => {
    const clamped = clampValue(electricRate, config.electricRate.min, config.electricRate.max);
    setElectricRate(clamped);
    setElectricRateInput(String(parseFloat(clamped.toFixed(2))));
    setElectricRateError("");
  };

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
    return calculateSolarEstimate({
      mode: "with-bill",
      monthlyBill,
      electricRate,
      totalDailyUsageWh: 0,
      formula: config.formula,
    });
  }, [monthlyBill, electricRate, config]);

  const rollingSystemSize = useInitialRollingNumber(
    results.systemSize,
    isShown,
    config.animation.duration
  );



  const formattedSystemSize = formatSystemSize(rollingSystemSize);

  const monthlyBillProgress =
    ((monthlyBill - config.monthlyBill.min) /
      (config.monthlyBill.max - config.monthlyBill.min)) *
    100;

  const electricRateProgress =
    ((electricRate - config.electricRate.min) /
      (config.electricRate.max - config.electricRate.min)) *
    100;

  const projectionMonths = getProjectionMonths(config.formula);

  const projectionDescription = formatProjectionDescription(projectionMonths);

  const handleGetQuote = () => {
    navigate("/quotation-engine", {
      state: {
        monthlyBill,
        electricRate,
        monthlyKwh: results.monthlyKwh,
        systemSize: results.systemSize,
        estimatedMonthlySavings: results.estimatedMonthlySavings,
        projectedSavings: results.projectedSavings,
        projectionMonths,
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
            See how much you could save over the {projectionDescription} projected
            lifespan of your system.
          </p>
        </div>

        <div className="as-impact-card">
          <div className="as-slider-group as-delay-1">
            <p className="as-slider-question">
              What is your average monthly electric bill?
            </p>

            <div className="as-slider-labels">
              <span>{config.labels.monthlyBillMin}</span>
              <span>{config.labels.monthlyBillMax}</span>
            </div>

            <input
              type="range"
              min={config.monthlyBill.min}
              max={config.monthlyBill.max}
              step={config.monthlyBill.step}
              value={clampValue(
                monthlyBill,
                config.monthlyBill.min,
                config.monthlyBill.max
              )}
              onChange={(e) => {
                const value = Number(e.target.value);
                setMonthlyBill(value);
                setMonthlyBillInput(String(value));
                setMonthlyBillError("");
              }}
              className="as-range"
              style={
                {
                  "--progress": `${monthlyBillProgress}%`,
                } as React.CSSProperties
              }
            />

            <div className="as-current-value">
              <div className="as-current-row">
                <span className="as-prefix">₱</span>

                <div className="as-current-input-box">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={monthlyBillInput}
                    onChange={(e) => handleMonthlyBillInput(e.target.value)}
                    onBlur={handleMonthlyBillBlur}
                  />
                </div>

                <span className="as-suffix">/ month</span>
              </div>
              {monthlyBillError && (
                <p className="as-current-error">{monthlyBillError}</p>
              )}
            </div>
          </div>

          <div className="as-slider-group as-delay-2">
            <p className="as-slider-question">
              What is your typical residential rate?
            </p>

            <div className="as-slider-labels">
              <span>{config.labels.electricRateMin}</span>
              <span>{config.labels.electricRateMax}</span>
            </div>

            <input
              type="range"
              min={config.electricRate.min}
              max={config.electricRate.max}
              step={config.electricRate.step}
              value={clampValue(
                electricRate,
                config.electricRate.min,
                config.electricRate.max
              )}
              onChange={(e) => {
                const value = Number(e.target.value);
                setElectricRate(value);
                setElectricRateInput(String(value));
                setElectricRateError("");
              }}
              className="as-range"
              style={
                {
                  "--progress": `${electricRateProgress}%`,
                } as React.CSSProperties
              }
            />

            <div className="as-current-value">
              <div className="as-current-row">
                <span className="as-prefix">₱</span>

                <div className="as-current-input-box">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={electricRateInput}
                    onChange={(e) => handleElectricRateInput(e.target.value)}
                    onBlur={handleElectricRateBlur}
                  />
                </div>

                <span className="as-suffix">/ kWh</span>
              </div>
              {electricRateError && (
                <p className="as-current-error">{electricRateError}</p>
              )}
            </div>
          </div>

          <div className="as-impact-divider as-delay-3" />

          <div className="as-impact-results as-delay-4">
            <div>
              <p className="as-result-label">ESTIMATED SYSTEM SIZE</p>
              <p className="as-system-size">
                {formattedSystemSize.value}{" "}
                <span>{formattedSystemSize.unit}</span>
              </p>
            </div>

            {}
          </div>

          <button
            className="as-impact-button as-delay-5"
            onClick={handleGetQuote}
          >
            Get This System Quote
          </button>

          <p className="as-impact-note as-delay-6">
            *Estimates are based on the selected electricity rate and average
            Philippine solar irradiance. Actual results may vary.
          </p>
        </div>
      </div>
    </section>
  );
}
