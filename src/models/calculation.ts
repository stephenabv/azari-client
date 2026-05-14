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
