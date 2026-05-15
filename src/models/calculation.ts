// ─── Legacy types (kept for reference) ───────────────────────────────────────

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

export function getProjectionMonths(formula: SolarFormula) {
  return formula.projectionYears > 0 ? formula.projectionYears : 12;
}

export function formatProjectionLabel(projectionMonths: number) {
  if (projectionMonths <= 1) return "1-MONTH SAVINGS";
  if (projectionMonths < 12) return `${projectionMonths}-MONTH SAVINGS`;

  const years = projectionMonths / 12;

  if (years === 1) return "1-YEAR SAVINGS";

  return `${Number.isInteger(years) ? years : years.toFixed(1)}-YEAR SAVINGS`;
}

export function formatProjectionDescription(projectionMonths: number) {
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
      : (totalDailyUsageWh * 30) / 1000;

  const rawSystemSize =
    formula.averageSolarProductionPerKwp > 0
      ? monthlyKwh / formula.averageSolarProductionPerKwp
      : 0;

  const systemSize = rawSystemSize > 0 ? Number(rawSystemSize.toFixed(1)) : 0;
  const estimatedMonthlyBillEquivalent = monthlyKwh * safeElectricRate;
  const estimatedMonthlySavings =
    estimatedMonthlyBillEquivalent * formula.estimatedSavingsRate;
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

const INVERTER_STEPS = [3.6, 5, 6, 8, 10, 12, 16];

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

export function computeDpt(amountPhp: number, electricRate: number): number {
  if (electricRate <= 0) return 0;
  return amountPhp / electricRate / 30;
}

function solarFromDpt(dpt: number): number {
  return Math.round((dpt / 4) * 100) / 100;
}

// ─── Monthly Savings path ─────────────────────────────────────────────────────

export function calculateMonthlySavingsHybrid(
  dpt: number,
  nwec: number
): EngineResult {
  const solarKwp = solarFromDpt(dpt);
  const inverterKw = roundInverterSize(solarKwp);
  const storageKwh = roundStorageCapacity(nwec / 0.9);
  return { solarKwp, inverterKw, storageKwh, systemType: "hybrid" };
}

export function calculateMonthlySavingsGridTied(dpt: number): EngineResult {
  const solarKwp = solarFromDpt(dpt);
  const inverterKw = roundInverterSize(solarKwp);
  return { solarKwp, inverterKw, storageKwh: 0, systemType: "grid-tied" };
}

// ─── Peak Shaving path ────────────────────────────────────────────────────────

export function calculatePeakShaving(
  peakPower: number,
  allowedGridPower: number,
  peakDuration: number
): EngineResult {
  const rawInverter = 1.25 * (peakPower - allowedGridPower);
  const inverterKw = roundInverterSize(rawInverter);
  const storageKwh = roundStorageCapacity((inverterKw * peakDuration) / 0.9);
  const solarKwp = Math.round((inverterKw / 4) * 100) / 100;
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
  const storageKwh = roundStorageCapacity(solarKwp * 3);
  return { solarKwp, inverterKw, storageKwh, systemType: "hybrid" };
}

export function calculateZeroBillWithLoadProfile(
  monthlyBill: number,
  electricRate: number,
  nwec: number
): EngineResult {
  const dpt = computeDpt(monthlyBill, electricRate);
  const solarKwp = solarFromDpt(dpt);
  const inverterKw = roundInverterSize(solarKwp);
  const storageKwh = roundStorageCapacity(nwec / 0.9);
  return { solarKwp, inverterKw, storageKwh, systemType: "hybrid" };
}

export function calculateZeroBillLoadOnly(
  duec: number,
  nwec: number
): EngineResult {
  const totalDaily = duec + nwec;
  const solarKwp = Math.round((totalDaily / 4) * 100) / 100;
  const inverterKw = roundInverterSize(solarKwp);
  const storageKwh = roundStorageCapacity(nwec / 0.9);
  return { solarKwp, inverterKw, storageKwh, systemType: "hybrid" };
}
