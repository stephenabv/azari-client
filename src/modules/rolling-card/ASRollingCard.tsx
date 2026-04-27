import { useEffect, useMemo, useRef, useState } from "react";
import "./as_rollingcard.less";

type StatCardProps = {
  value: string;
  label: string;
  duration?: number;
};

type ParsedValue = {
  prefix: string;
  numeric: string;
  suffix: string;
};

function parseAnimatedValue(value: string): ParsedValue | null {
  const match = value.match(/^(.*?)(\d[\d,.]*)(.*)$/);

  if (!match) return null;

  return {
    prefix: match[1],
    numeric: match[2],
    suffix: match[3],
  };
}

function countDecimals(numStr: string) {
  const clean = numStr.replace(/,/g, "").replace(/\+/g, "");
  const parts = clean.split(".");
  return parts[1]?.length ?? 0;
}

function extractNumericTarget(numericText: string) {
  const clean = numericText.replace(/[,+]/g, "");
  const parsed = parseFloat(clean);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatAnimatedValue(current: number, template: string) {
  const hasComma = template.includes(",");
  const decimals = countDecimals(template);
  const hasPlus = template.includes("+");

  let formatted = current.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (!hasComma) {
    formatted = formatted.replace(/,/g, "");
  }

  if (hasPlus) {
    formatted += "+";
  }

  return formatted;
}

export function StatCard({
  value,
  label,
  duration = 1800,
}: StatCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);

  const parsed = useMemo(() => parseAnimatedValue(value), [value]);

  const target = useMemo(() => {
    if (!parsed) return 0;
    return extractNumericTarget(parsed.numeric);
  }, [parsed]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || hasStarted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted || !parsed) return;

    let startTime: number | null = null;

    const animate = (time: number) => {
      if (startTime === null) startTime = time;

      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedValue(target * eased);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [hasStarted, target, duration, parsed]);

  const displayValue = useMemo(() => {
    if (!parsed) return value;

    const formattedNumeric = hasStarted
      ? formatAnimatedValue(animatedValue, parsed.numeric)
      : formatAnimatedValue(0, parsed.numeric);

    return `${parsed.prefix}${formattedNumeric}${parsed.suffix}`;
  }, [animatedValue, hasStarted, parsed, value]);

  return (
    <div ref={cardRef} className="stat-card">
      <p className="stat-card-value">{displayValue}</p>
      <p className="stat-card-label">{label}</p>
    </div>
  );
}