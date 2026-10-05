import { useMemo, useRef } from "react";
import { useCountUp } from "../../hooks/useCountUp";
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

  const parsed = useMemo(() => parseAnimatedValue(value), [value]);
  const target = parsed ? extractNumericTarget(parsed.numeric) : 0;
  const animatedValue = useCountUp(cardRef, target, { duration, threshold: 0.35 });

  const displayValue = parsed
    ? `${parsed.prefix}${formatAnimatedValue(animatedValue, parsed.numeric)}${parsed.suffix}`
    : value;

  return (
    <div ref={cardRef} className="stat-card">
      <p className="stat-card-value">{displayValue}</p>
      <p className="stat-card-label">{label}</p>
    </div>
  );
}
