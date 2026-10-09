import type { ApiSolarPackage } from "../ASContent";

/**
 * Keys stored in SolarPackage.packageType. Mirrors the service's PACKAGE_TYPES
 * and Prisma `PackageType` enum; the order here is the display order.
 */
export const PACKAGE_TYPE_KEYS = ["standard_hybrid", "premium_hybrid", "grid_tie"] as const;

export type PackageTypeKey = (typeof PACKAGE_TYPE_KEYS)[number];

/** Everything the UI needs to present one package type. */
export interface PackageTypeDefinition {
  readonly key: PackageTypeKey;
  readonly label: string;
  readonly description: string;
  /** Hybrid systems carry a battery; grid-tie systems never do. */
  readonly hasBattery: boolean;
  /** Identity color for chips, dots, borders and the cover tint. */
  readonly accent: string;
  /** Cover image assigned to packages of this type, served from /public. */
  readonly cover: string;
}

/** The single source of truth for package-type presentation. */
const DEFINITIONS: Readonly<Record<PackageTypeKey, PackageTypeDefinition>> = {
  standard_hybrid: {
    key: "standard_hybrid",
    label: "Standard Hybrid",
    description: "Solar with battery storage",
    hasBattery: true,
    accent: "#ef4444",
    cover: "/images/package-covers/standard-hybrid.webp",
  },
  premium_hybrid: {
    key: "premium_hybrid",
    label: "Premium Hybrid",
    description: "Higher-spec solar with battery storage",
    hasBattery: true,
    accent: "#3b82f6",
    cover: "/images/package-covers/premium-hybrid.webp",
  },
  grid_tie: {
    key: "grid_tie",
    label: "Grid-Tie",
    description: "Solar without battery storage",
    hasBattery: false,
    accent: "#22c55e",
    cover: "/images/package-covers/grid-tie.webp",
  },
};

/** The fields a type can be resolved from; satisfied by both API rows and admin forms. */
export type PackageTypeSource = Pick<ApiSolarPackage, "storageKwh"> & {
  packageType?: string | null;
};

/**
 * Resolves a package's display type. An explicitly assigned, known type wins.
 * Packages saved before types existed (or carrying a value this build does
 * not know) fall back to the battery split the site used before: with storage
 * is Standard Hybrid, without is Grid-Tie. Nothing is ever left untyped.
 */
export class PackageTypeCatalog {
  static readonly all: readonly PackageTypeDefinition[] = PACKAGE_TYPE_KEYS.map((k) => DEFINITIONS[k]);

  static isKnown(value: unknown): value is PackageTypeKey {
    return typeof value === "string" && Object.prototype.hasOwnProperty.call(DEFINITIONS, value);
  }

  static get(key: PackageTypeKey): PackageTypeDefinition {
    return DEFINITIONS[key];
  }

  /** The type implied by battery storage alone; used for unassigned packages. */
  static derive(source: Pick<PackageTypeSource, "storageKwh">): PackageTypeDefinition {
    return source.storageKwh > 0 ? DEFINITIONS.standard_hybrid : DEFINITIONS.grid_tie;
  }

  static resolve(source: PackageTypeSource): PackageTypeDefinition {
    return PackageTypeCatalog.isKnown(source.packageType)
      ? DEFINITIONS[source.packageType]
      : PackageTypeCatalog.derive(source);
  }

  /** True when the stored value is missing or unknown and the type shown is derived. */
  static isDerived(source: PackageTypeSource): boolean {
    return !PackageTypeCatalog.isKnown(source.packageType);
  }

  /** Types that have at least one package, in display order. */
  static presentIn(packages: readonly PackageTypeSource[]): PackageTypeDefinition[] {
    const present = new Set(packages.map((p) => PackageTypeCatalog.resolve(p).key));
    return PackageTypeCatalog.all.filter((d) => present.has(d.key));
  }
}

/**
 * Inline CSS custom properties that carry a type's identity into styles, so
 * stylesheets never branch on a type key.
 */
export function packageTypeStyle(def: PackageTypeDefinition): Record<string, string> {
  return {
    "--pkg-type-accent": def.accent,
    "--pkg-type-cover": `url("${def.cover}")`,
  };
}

/** What the admin form knows when a package is saved. */
export interface CoverSaveContext {
  readonly isNew: boolean;
  /** Stored type before this edit; null for unassigned or new packages. */
  readonly previousType: string | null | undefined;
  readonly nextType: string | null | undefined;
  readonly imageUrl: string | null | undefined;
  /** An image file picked in this edit; it is uploaded after the save and wins. */
  readonly hasNewUpload: boolean;
}

/**
 * Decides a package's cover when the admin saves it. A new package, or an
 * existing one whose type changes, gets its type's cover; untouched packages
 * keep whatever image they have, so older records change only when an admin
 * changes their type. An image the admin explicitly uploads always wins.
 */
export class PackageCoverPolicy {
  private static readonly covers = new Set(PackageTypeCatalog.all.map((d) => d.cover));

  /** True when the URL is one of the built-in type covers rather than a custom photo. */
  static isTypeCover(url: string | null | undefined): boolean {
    return !!url && PackageCoverPolicy.covers.has(url);
  }

  static imageUrlOnSave(ctx: CoverSaveContext): string | null {
    const current = ctx.imageUrl ?? null;
    if (ctx.hasNewUpload || !PackageTypeCatalog.isKnown(ctx.nextType)) return current;

    const cover = PackageTypeCatalog.get(ctx.nextType).cover;
    const typeChanged = ctx.previousType !== ctx.nextType;
    // A built-in cover always follows the type, even if it was left stale.
    const staleCover = PackageCoverPolicy.isTypeCover(current) && current !== cover;
    return ctx.isNew || typeChanged || staleCover ? cover : current;
  }
}
