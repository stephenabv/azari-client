

export type Dimension = "power" | "energy";

export const UNITS: Record<Dimension, { canonical: string; units: { code: string; factorToCanonical: number }[] }> = {
  power: {
    canonical: "kW",
    units: [
      { code: "W",   factorToCanonical: 0.001 },
      { code: "kW",  factorToCanonical: 1 },
      { code: "MW",  factorToCanonical: 1000 },
      { code: "Wp",  factorToCanonical: 0.001 },
      { code: "kWp", factorToCanonical: 1 },
    ],
  },
  energy: {
    canonical: "kWh",
    units: [
      { code: "Wh",  factorToCanonical: 0.001 },
      { code: "kWh", factorToCanonical: 1 },
      { code: "MWh", factorToCanonical: 1000 },
    ],
  },
};

export type CapField = "productionCapacityKwp" | "loadCapacityKw" | "storageCapacityKwh";
export type CatSpec = {
  field: CapField; dimension: Dimension; offer: string[]; default: string;
  label: string; helper: string; canonicalLabel: string; example: number;
};

export const CATEGORY_SPEC: Record<string, CatSpec> = {
  "Solar Panel": { field: "productionCapacityKwp", dimension: "power",  offer: ["Wp", "kWp"], default: "Wp",  label: "Production Capacity", helper: "Per-panel output",          canonicalLabel: "kWp", example: 0.62 },
  "Inverter":    { field: "loadCapacityKw",        dimension: "power",  offer: ["W", "kW"],   default: "kW",  label: "Load Capacity",       helper: "Maximum power conversion", canonicalLabel: "kW",  example: 6 },
  "Battery":     { field: "storageCapacityKwh",    dimension: "energy", offer: ["Wh", "kWh"], default: "kWh", label: "Storage Capacity",    helper: "Total energy storage",     canonicalLabel: "kWh", example: 5.12 },
};

export const round = (n: number, dp = 6) => Math.round(n * 10 ** dp) / 10 ** dp;
export const unitFactor = (dimension: Dimension, code: string): number =>
  UNITS[dimension].units.find(u => u.code === code)?.factorToCanonical ?? 1;
export const toCanonical   = (displayVal: number,   dimension: Dimension, code: string): number => round(displayVal * unitFactor(dimension, code));
export const fromCanonical = (canonicalVal: number, dimension: Dimension, code: string): number => round(canonicalVal / unitFactor(dimension, code));

export function formatCapacity(
  canonicalValue: number,
  dimension: Dimension,
  opts?: { unit?: string; humanize?: boolean; dp?: number },
): string {
  if (!Number.isFinite(canonicalValue)) return "";
  const dp = opts?.dp ?? 6;

  if (opts?.humanize) {
    const sorted = [...UNITS[dimension].units].sort((a, b) => a.factorToCanonical - b.factorToCanonical);
    for (const u of sorted) {
      const v = fromCanonical(canonicalValue, dimension, u.code);
      if (Math.abs(v) >= 1 && Math.abs(v) < 1000) return `${String(round(v, dp))} ${u.code}`;
    }

  }

  const code = opts?.unit ?? UNITS[dimension].canonical;
  const value = fromCanonical(canonicalValue, dimension, code);
  return `${String(round(value, dp))} ${code}`;
}
