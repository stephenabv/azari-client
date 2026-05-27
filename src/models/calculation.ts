// ─── Business constants ───────────────────────────────────────────────────────

/** Core solar engineering constants shared across the entire app. */
export const SOLAR_CONSTANTS = {
  /** Average monthly solar production per kWp — Metro Manila irradiance baseline (kWh/kWp/month) */
  averageSolarProductionPerKwp: 120,
  /** Fraction of electricity bill effectively offset by the system */
  estimatedSavingsRate: 0.87,
  /** Projection window used in the quick-calculator display (months) */
  calculatorProjectionMonths: 12,
  /** Full ROI projection window used in quotation payloads — 12 years (months) */
  projectionMonths: 144,
  /** Round-trip storage efficiency / appliance load derating factor */
  systemEfficiency: 0.9,
  /** Design safety margin multiplier for peak-shaving inverter sizing */
  inverterSafetyFactor: 1.25,
  /** Effective peak sun hours per day used for solar array sizing (hrs/day) */
  peakSunHours: 4,
  /** Assumed days per month for monthly kWh estimates */
  daysPerMonth: 30,
  /** Storage-to-solar ratio for bill-only zero-bill sizing (kWh battery per kWp solar) */
  zeroBillStorageRatio: 3,
};

/** Electricity rate slider / input bounds (₱/kWh). */
export const ELECTRIC_RATE_CONFIG = {
  min: 8,
  max: 20,
  step: 0.01,
  defaultValue: 11.25,
};

/** Monthly bill slider / input bounds (₱). */
export const MONTHLY_BILL_CONFIG = {
  min: 3000,
  max: 200_000,
  step: 0.1,
  defaultValue: 3000,
};

/** Available discrete inverter sizes (kW). */
export const INVERTER_STEPS: number[] = [3.6, 5, 6, 8, 10, 12, 16];

/** Day / night boundary window used for load-profile scheduling (minutes from midnight). */
export const DAY_BOUNDARY = {
  startMinutes: 8 * 60,    // 08:00 → 480 min
  endMinutes: 18 * 60,     // 18:00 → 1080 min
};

// ─── Day / night schedule helpers ─────────────────────────────────────────────

/** Minutes of overlap between [startMin, endMin] and the daytime window. */
export function minutesOverlapWithDay(startMin: number, endMin: number): number {
  return Math.max(
    0,
    Math.min(endMin, DAY_BOUNDARY.endMinutes) - Math.max(startMin, DAY_BOUNDARY.startMinutes)
  );
}

/**
 * Given an HH:MM from/to pair, returns how many hours fall within the
 * daytime window (08:00–18:00) and how many fall in the nighttime window.
 * Handles schedules that span midnight.
 */
export function calculateDayNightHours(
  from: string,
  to: string
): { dayHours: number; nightHours: number } {
  if (!from || !to) return { dayHours: 0, nightHours: 0 };

  const [fh, fm] = from.split(":").map(Number);
  const [th, tm] = to.split(":").map(Number);

  const fromMin = fh * 60 + fm;
  let toMin = th * 60 + tm;

  if (toMin <= fromMin) toMin += 24 * 60; // spans midnight

  const totalMin = toMin - fromMin;
  let dayMin: number;

  if (toMin <= 1440) {
    dayMin = minutesOverlapWithDay(fromMin, toMin);
  } else {
    // Spans midnight: check both the pre-midnight and post-midnight segments.
    dayMin =
      minutesOverlapWithDay(fromMin, 1440) +
      minutesOverlapWithDay(0, toMin - 1440);
  }

  return { dayHours: dayMin / 60, nightHours: (totalMin - dayMin) / 60 };
}

// ─── Appliance load metrics ────────────────────────────────────────────────────

type ApplianceLoadInput = {
  watts: number;
  quantity: number;
  dayHours: number;
  nightHours: number;
  usage: number;
};

/**
 * Aggregates an appliance list into daytime energy consumption (duec),
 * nighttime energy consumption (nwec), and raw total daily Wh.
 * The systemEfficiency factor accounts for wiring and conversion losses.
 */
export function computeDailyLoadMetrics(appliances: ApplianceLoadInput[]): {
  duec: number;
  nwec: number;
  totalDailyUsageWh: number;
} {
  let duec = 0;
  let nwec = 0;
  let totalDailyUsageWh = 0;
  for (const a of appliances) {
    duec += (a.watts * a.quantity * a.dayHours * SOLAR_CONSTANTS.systemEfficiency) / 1000;
    nwec += (a.watts * a.quantity * a.nightHours * SOLAR_CONSTANTS.systemEfficiency) / 1000;
    totalDailyUsageWh += a.usage;
  }
  return { duec, nwec, totalDailyUsageWh };
}

// ─── System size formatting ────────────────────────────────────────────────────

/**
 * Formats a raw kWp value for display. Automatically switches to MWp above 1 000 kWp.
 * @param precision decimal places for the numeric part (default 1; use 2 for payload data)
 */
export function formatSystemSize(
  kWp: number,
  precision = 1
): { value: string; unit: string } {
  if (kWp >= 1000) return { value: (kWp / 1000).toFixed(precision), unit: "MWp" };
  return { value: kWp.toFixed(precision), unit: "kWp" };
}

// ─── Legacy types (kept for calculator backward-compat) ───────────────────────

export type CalculationMode = "with-bill" | "no-bill";

export type SolarFormula = {
  averageSolarProductionPerKwp: number;
  estimatedSavingsRate: number;
  projectionYears: number;
  monthsPerYear: number;
};

export type SolarCalculationInput = {
  mode: CalculationMode;
  monthlyBill: number;
  electricRate: number;
  totalDailyUsageWh: number;
  formula: SolarFormula;
};

export type SolarCalculationResult = {
  monthlyKwh: number;
  systemSize: number;
  estimatedMonthlySavings: number;
  projectedSavings: number;
  projectionMonths: number;
};

export function getProjectionMonths(formula: SolarFormula): number {
  return formula.projectionYears > 0 ? formula.projectionYears : SOLAR_CONSTANTS.calculatorProjectionMonths;
}

export function formatProjectionLabel(projectionMonths: number): string {
  if (projectionMonths <= 1) return "1-MONTH SAVINGS";
  if (projectionMonths < 12) return `${projectionMonths}-MONTH SAVINGS`;

  const years = projectionMonths / 12;
  if (years === 1) return "1-YEAR SAVINGS";
  return `${Number.isInteger(years) ? years : years.toFixed(1)}-YEAR SAVINGS`;
}

export function formatProjectionDescription(projectionMonths: number): string {
  if (projectionMonths <= 1) return "1-month";
  if (projectionMonths < 12) return `${projectionMonths}-month`;

  const years = projectionMonths / 12;
  if (years === 1) return "1-year";
  return `${Number.isInteger(years) ? years : years.toFixed(1)}-year`;
}

export function calculateSolarEstimate({
  mode,
  monthlyBill,
  electricRate,
  totalDailyUsageWh,
  formula,
}: SolarCalculationInput): SolarCalculationResult {
  const safeElectricRate = electricRate > 0 ? electricRate : 0;
  const monthlyKwh =
    mode === "with-bill"
      ? safeElectricRate > 0
        ? monthlyBill / safeElectricRate
        : 0
      : (totalDailyUsageWh * SOLAR_CONSTANTS.daysPerMonth) / 1000;

  const rawSystemSize =
    formula.averageSolarProductionPerKwp > 0
      ? monthlyKwh / formula.averageSolarProductionPerKwp
      : 0;

  const systemSize = rawSystemSize > 0 ? Number(rawSystemSize.toFixed(1)) : 0;
  const estimatedMonthlyBillEquivalent = monthlyKwh * safeElectricRate;
  const estimatedMonthlySavings = estimatedMonthlyBillEquivalent * formula.estimatedSavingsRate;
  const projectionMonths = getProjectionMonths(formula);
  const projectedSavings = estimatedMonthlySavings * projectionMonths;

  return {
    monthlyKwh: Math.round(monthlyKwh),
    systemSize,
    estimatedMonthlySavings: Math.round(estimatedMonthlySavings),
    projectedSavings: Math.round(projectedSavings),
    projectionMonths,
  };
}

// ─── Engine types ─────────────────────────────────────────────────────────────

export type SystemPurpose = "monthly-savings" | "peak-shaving" | "zero-bill";
export type SystemType = "hybrid" | "grid-tied";

export type EngineResult = {
  solarKwp: number;
  inverterKw: number;
  storageKwh: number;
  systemType: SystemType;
};

// ─── Rounding helpers ─────────────────────────────────────────────────────────

export function roundInverterSize(rawKw: number): number {
  if (rawKw <= 0) return INVERTER_STEPS[0];
  if (rawKw >= 20) return Math.ceil(rawKw / 10) * 10;
  for (const step of INVERTER_STEPS) {
    if (step >= rawKw) return step;
  }
  return Math.ceil(rawKw / 10) * 10;
}

export function roundStorageCapacity(rawKwh: number): number {
  if (rawKwh <= 0) return 0;
  return Math.ceil(rawKwh / 5) * 5;
}

// ─── Shared calculation primitives ────────────────────────────────────────────

/** Daily peak time (kWh/day) from a monthly PHP amount and ₱/kWh rate. */
export function computeDpt(amountPhp: number, electricRate: number): number {
  if (electricRate <= 0) return 0;
  return amountPhp / electricRate / SOLAR_CONSTANTS.daysPerMonth;
}

function solarFromDpt(dpt: number): number {
  return Math.round((dpt / SOLAR_CONSTANTS.peakSunHours) * 100) / 100;
}

// ─── Monthly Savings path ─────────────────────────────────────────────────────

export function calculateMonthlySavingsHybrid(dpt: number, nwec: number, duec = 0): EngineResult {
  const solarKwp = solarFromDpt(Math.max(dpt, duec));
  const inverterKw = roundInverterSize(solarKwp);
  const storageKwh = roundStorageCapacity(nwec / SOLAR_CONSTANTS.systemEfficiency);
  return { solarKwp, inverterKw, storageKwh, systemType: "hybrid" };
}

export function calculateMonthlySavingsGridTied(dpt: number, duec = 0): EngineResult {
  const solarKwp = solarFromDpt(Math.max(dpt, duec));
  const inverterKw = roundInverterSize(solarKwp);
  return { solarKwp, inverterKw, storageKwh: 0, systemType: "grid-tied" };
}

// ─── Peak Shaving path ────────────────────────────────────────────────────────

export function calculatePeakShaving(
  peakPower: number,
  allowedGridPower: number,
  peakDuration: number
): EngineResult {
  const rawInverter = SOLAR_CONSTANTS.inverterSafetyFactor * (peakPower - allowedGridPower);
  const inverterKw = roundInverterSize(rawInverter);
  const storageKwh = roundStorageCapacity(
    (inverterKw * peakDuration) / SOLAR_CONSTANTS.systemEfficiency
  );
  const solarKwp = Math.round((inverterKw / SOLAR_CONSTANTS.peakSunHours) * 100) / 100;
  return { solarKwp, inverterKw, storageKwh, systemType: "hybrid" };
}

// ─── Zero Bill paths ──────────────────────────────────────────────────────────

export function calculateZeroBillBillOnly(
  monthlyBill: number,
  electricRate: number
): EngineResult {
  const dpt = computeDpt(monthlyBill, electricRate);
  const solarKwp = solarFromDpt(dpt);
  const inverterKw = roundInverterSize(solarKwp);
  const storageKwh = roundStorageCapacity(solarKwp * SOLAR_CONSTANTS.zeroBillStorageRatio);
  return { solarKwp, inverterKw, storageKwh, systemType: "hybrid" };
}

export function calculateZeroBillWithLoadProfile(
  monthlyBill: number,
  electricRate: number,
  nwec: number
): EngineResult {
  const dpt = computeDpt(monthlyBill, electricRate);
  const solarKwp = solarFromDpt(Math.max(dpt, nwec));
  const inverterKw = roundInverterSize(solarKwp);
  const storageKwh = roundStorageCapacity(nwec / SOLAR_CONSTANTS.systemEfficiency);
  return { solarKwp, inverterKw, storageKwh, systemType: "hybrid" };
}

export function calculateZeroBillLoadOnly(duec: number, nwec: number): EngineResult {
  const totalDaily = duec + nwec;
  const solarKwp = Math.round((totalDaily / SOLAR_CONSTANTS.peakSunHours) * 100) / 100;
  const inverterKw = roundInverterSize(solarKwp);
  const storageKwh = roundStorageCapacity(nwec / SOLAR_CONSTANTS.systemEfficiency);
  return { solarKwp, inverterKw, storageKwh, systemType: "hybrid" };
}
