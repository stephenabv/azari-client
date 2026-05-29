import type { EngineResult } from "./calculation";

export type SolarPackage = {
  id: string;
  name: string;
  solarKwp: number;
  inverterKw: number;
  storageKwh: number;
  phase: "single" | "three";
  totalPrice: number;
  monthlyBillRange: [number, number];
  isRecommended?: boolean;
};

export const SOLAR_PACKAGES: SolarPackage[] = [

  {
    id: "sp-3.6",
    name: "3.72 kWp · 3.6 kW · 5.1 kWh",
    solarKwp: 3.72,
    inverterKw: 3.6,
    storageKwh: 5.1,
    phase: "single",
    totalPrice: 269393,
    monthlyBillRange: [3500, 5500],
  },
  {
    id: "sp-6",
    name: "6.2 kWp · 6 kW · 5.1 kWh",
    solarKwp: 6.2,
    inverterKw: 6,
    storageKwh: 5.1,
    phase: "single",
    totalPrice: 367378,
    monthlyBillRange: [7500, 9500],
  },
  {
    id: "sp-10",
    name: "11.16 kWp · 10 kW · 10.2 kWh",
    solarKwp: 11.16,
    inverterKw: 10,
    storageKwh: 10.2,
    phase: "single",
    totalPrice: 497798,
    monthlyBillRange: [15000, 17000],
  },
  {
    id: "sp-15",
    name: "18.6 kWp · 15 kW · 15.3 kWh",
    solarKwp: 18.6,
    inverterKw: 15,
    storageKwh: 15.3,
    phase: "single",
    totalPrice: 758289,
    monthlyBillRange: [22000, 26000],
  },

  {
    id: "tp-8",
    name: "8.68 kWp · 8 kW · 5.1 kWh",
    solarKwp: 8.68,
    inverterKw: 8,
    storageKwh: 5.1,
    phase: "three",
    totalPrice: 438721,
    monthlyBillRange: [12000, 14000],
  },
  {
    id: "tp-10",
    name: "11.16 kWp · 10 kW · 5.1 kWh",
    solarKwp: 11.16,
    inverterKw: 10,
    storageKwh: 5.1,
    phase: "three",
    totalPrice: 476573,
    monthlyBillRange: [15000, 17000],
  },
  {
    id: "tp-12",
    name: "12.4 kWp · 12 kW · 5.1 kWh",
    solarKwp: 12.4,
    inverterKw: 12,
    storageKwh: 5.1,
    phase: "three",
    totalPrice: 498886,
    monthlyBillRange: [15000, 17000],
  },
];

export function findMatchingPackages(
  result: EngineResult,
  preferredPhase: "single" | "three",
  catalog: SolarPackage[] = SOLAR_PACKAGES
): SolarPackage[] {
  const matches = catalog.filter((pkg) => {
    const solarOk = pkg.solarKwp >= result.solarKwp;
    const inverterOk = pkg.inverterKw >= result.inverterKw;
    const storageOk = result.storageKwh === 0 || pkg.storageKwh >= result.storageKwh;
    return solarOk && inverterOk && storageOk;
  });

  matches.sort((a, b) => {
    const aPref = a.phase === preferredPhase ? 0 : 1;
    const bPref = b.phase === preferredPhase ? 0 : 1;
    if (aPref !== bPref) return aPref - bPref;
    return a.totalPrice - b.totalPrice;
  });

  return matches.slice(0, 3);
}

export async function fetchPackagesFromApi(): Promise<SolarPackage[]> {
  try {
    const res = await fetch("/api/packages", { headers: { Accept: "application/json" } });
    if (!res.ok) return SOLAR_PACKAGES;
    const json = (await res.json()) as {
      success: boolean;
      data: Array<{
        id: string; name: string; solarKwp: number; inverterKw: number;
        storageKwh: number; phase: string; totalPrice: number;
        billRangeMin: number; billRangeMax: number;
      }>;
    };
    if (!json.data?.length) return SOLAR_PACKAGES;
    return json.data.map((p) => ({
      id: p.id,
      name: p.name,
      solarKwp: p.solarKwp,
      inverterKw: p.inverterKw,
      storageKwh: p.storageKwh,
      phase: p.phase as "single" | "three",
      totalPrice: p.totalPrice,
      monthlyBillRange: [p.billRangeMin, p.billRangeMax] as [number, number],
    }));
  } catch {
    return SOLAR_PACKAGES;
  }
}
