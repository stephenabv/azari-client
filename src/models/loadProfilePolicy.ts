import type { SystemPurpose } from "./calculation";

/**
 * How the Detailed Load Profile step behaves for a given calculator setup.
 * - hidden:   step is not shown
 * - optional: shown, calculation runs without appliances
 * - required: shown, calculation and proposal need at least one appliance
 */
export type LoadProfileRequirement = "hidden" | "optional" | "required";

type BillMode = "withBill" | "noBill";

/**
 * Single source of truth for the load profile rule. Without a bill the
 * appliance list is the only usage signal we have, so it is required for
 * every purpose. Extend by editing this table, not the component.
 */
const LOAD_PROFILE_POLICY: Readonly<Record<SystemPurpose, Readonly<Record<BillMode, LoadProfileRequirement>>>> = {
  "monthly-savings": { withBill: "optional", noBill: "required" },
  "peak-shaving": { withBill: "hidden", noBill: "required" },
  "zero-bill": { withBill: "optional", noBill: "required" },
};

export function getLoadProfileRequirement(
  purpose: SystemPurpose,
  hasBill: boolean
): LoadProfileRequirement {
  return LOAD_PROFILE_POLICY[purpose][hasBill ? "withBill" : "noBill"];
}

export const LOAD_PROFILE_REQUIRED_MESSAGE =
  "Please add at least one appliance to your load profile.";
