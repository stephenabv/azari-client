

export const SOLAR_CONSTANTS = {

  averageSolarProductionPerKwp: 120,

  estimatedSavingsRate: 0.87,

  calculatorProjectionMonths: 12,

  projectionMonths: 144,

  systemEfficiency: 0.9,

  inverterSafetyFactor: 1.25,

  peakSunHours: 4,

  daysPerMonth: 30,

  zeroBillStorageRatio: 3,

  //A.R.A. revision
  loadUsageFactor: 0.7,
};

export const ELECTRIC_RATE_CONFIG = {
  min: 8,
  max: 20,
  step: 0.01,
  defaultValue: 11.25,
};

export const MONTHLY_BILL_CONFIG = {
  min: 3000,
  max: 200_000,
  step: 0.1,
  defaultValue: 3000,
};

export const INVERTER_STEPS: number[] = [3.6, 5, 6, 8, 10, 12, 16];

export const DAY_BOUNDARY = {
  startMinutes: 8 * 60,
  endMinutes: 18 * 60,
};

export function minutesOverlapWithDay(startMin: number, endMin: number): number {
  return Math.max(
    0,
    Math.min(endMin, DAY_BOUNDARY.endMinutes) - Math.max(startMin, DAY_BOUNDARY.startMinutes)
  );
}

export function calculateDayNightHours(
  from: string,
  to: string
): { dayHours: number; nightHours: number } {
  if (!from || !to) return { dayHours: 0, nightHours: 0 };

  const [fh, fm] = from.split(":").map(Number);
  const [th, tm] = to.split(":").map(Number);

  const fromMin = fh * 60 + fm;
  let toMin = th * 60 + tm;

  if (toMin <= fromMin) toMin += 24 * 60;

  const totalMin = toMin - fromMin;
  let dayMin: number;

  if (toMin <= 1440) {
    dayMin = minutesOverlapWithDay(fromMin, toMin);
  } else {

    dayMin =
      minutesOverlapWithDay(fromMin, 1440) +
      minutesOverlapWithDay(0, toMin - 1440);
  }

  return { dayHours: dayMin / 60, nightHours: (totalMin - dayMin) / 60 };
}

type ApplianceLoadInput = {
  watts: number;
  quantity: number;
  dayHours: number;
  nightHours: number;
  usage: number;
};

export function computeDailyLoadMetrics(appliances: ApplianceLoadInput[]): {
  duec: number;
  nwec: number;
  totalDailyUsageWh: number;
} {
  let duec = 0;
  let nwec = 0;
  let totalDailyUsageWh = 0;
  for (const a of appliances) {
    //A.R.A. revision
    // duec += (a.watts * a.quantity * a.dayHours * SOLAR_CONSTANTS.systemEfficiency) / 1000;
    // nwec += (a.watts * a.quantity * a.nightHours * SOLAR_CONSTANTS.systemEfficiency) / 1000;
    duec += (a.watts * a.quantity * a.dayHours * SOLAR_CONSTANTS.loadUsageFactor) / 1000;
    nwec += (a.watts * a.quantity * a.nightHours * SOLAR_CONSTANTS.loadUsageFactor) / 1000;
    totalDailyUsageWh += a.usage;
  }
  return { duec, nwec, totalDailyUsageWh };
}

export function formatSystemSize(
  kWp: number,
  precision = 1
): { value: string; unit: string } {
  if (kWp >= 1000) return { value: (kWp / 1000).toFixed(precision), unit: "MWp" };
  return { value: kWp.toFixed(precision), unit: "kWp" };
}

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

export type SystemPurpose = "monthly-savings" | "peak-shaving" | "zero-bill";
export type SystemType = "hybrid" | "grid-tied";

export type EngineResult = {
  solarKwp: number;
  inverterKw: number;
  storageKwh: number;
  systemType: SystemType;
};

export function roundInverterSize(rawKw: number): number {
  if (rawKw <= 0) return INVERTER_STEPS[0];
  if (rawKw >= 20) return Math.ceil(rawKw / 10) * 10;
  for (const step of INVERTER_STEPS) {
    if (step >= rawKw) return step;
  }
  return Math.ceil(rawKw / 10) * 10;
}

export function roundStorageCapacity(rawKwh: number): number {
  if (rawKwh <= 0) return 5;
  return Math.ceil(rawKwh / 5) * 5;
}

export function computeDpt(amountPhp: number, electricRate: number): number {
  if (electricRate <= 0) return 0;
  return amountPhp / electricRate / SOLAR_CONSTANTS.daysPerMonth;
}

function solarFromDpt(dpt: number): number {
  return Math.round((dpt / SOLAR_CONSTANTS.peakSunHours) * 100) / 100;
}

export function calculateMonthlySavingsHybrid(dpt: number, duec = 0): EngineResult {
  const solarKwp = dpt < duec ? dpt / SOLAR_CONSTANTS.peakSunHours : solarFromDpt(Math.max(dpt, duec));
  const storageKwh = dpt < duec ? roundStorageCapacity(0) : roundStorageCapacity((dpt - duec) / SOLAR_CONSTANTS.systemEfficiency);
  const inverterKw = roundInverterSize(solarKwp);
  return { solarKwp, inverterKw, storageKwh, systemType: "hybrid" };
}

export function calculateMonthlySavingsGridTied(dpt: number, duec = 0): EngineResult {
  const solarKwp = dpt < duec ? dpt / SOLAR_CONSTANTS.peakSunHours : ((dpt - duec) / 2) + (duec / SOLAR_CONSTANTS.peakSunHours); //make a function for this if you feel like doing it
  const inverterKw = roundInverterSize(solarKwp);
  return { solarKwp, inverterKw, storageKwh: 0, systemType: "grid-tied" };
}

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
  const solarKwp = Math.round((storageKwh / SOLAR_CONSTANTS.peakSunHours) * 100) / 100;

  return { solarKwp, inverterKw, storageKwh, systemType: "hybrid" };
}

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
  const storageKwh = roundStorageCapacity(nwec / SOLAR_CONSTANTS.systemEfficiency);
  const solarKwp = dpt >= storageKwh ? solarFromDpt(Math.max(dpt, nwec)) : storageKwh / SOLAR_CONSTANTS.peakSunHours;
  const inverterKw = roundInverterSize(solarKwp);
  return { solarKwp, inverterKw, storageKwh, systemType: "hybrid" };
}

export function calculateZeroBillLoadOnly(duec: number, nwec: number): EngineResult {
  const totalDaily = duec + nwec;
  const solarKwp = Math.round((totalDaily / SOLAR_CONSTANTS.peakSunHours) * 100) / 100;
  const inverterKw = roundInverterSize(solarKwp);
  const storageKwh = roundStorageCapacity(nwec / SOLAR_CONSTANTS.systemEfficiency);
  return { solarKwp, inverterKw, storageKwh, systemType: "hybrid" };
}