import type { ApiSolarComponent, ApiSolarPackage } from "../ASContent";

/**
 * A predicate over public packages. Filters are composable and stateless, so
 * new criteria (battery brand, price band, …) plug in as new implementations
 * without touching the packages page.
 */
export interface PackageFilter {
  /** False when the filter would match everything (e.g. "All brands"). */
  readonly isActive: boolean;
  matches(pkg: ApiSolarPackage): boolean;
}

/** Normalises free-text component attributes so "Sofar", " SOFAR " and "sofar" compare equal. */
export function normalizeAttribute(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

/**
 * Matches packages whose component of a given category has a selected
 * attribute value. Subclasses decide which category and attribute.
 */
export abstract class ComponentAttributeFilter implements PackageFilter {
  private readonly selected: string;

  protected constructor(
    private readonly category: string,
    selected: string | null | undefined,
  ) {
    this.selected = normalizeAttribute(selected);
  }

  protected abstract attributeOf(component: ApiSolarComponent): string | null | undefined;

  get isActive(): boolean {
    return this.selected.length > 0;
  }

  matches(pkg: ApiSolarPackage): boolean {
    if (!this.isActive) return true;
    return (pkg.components ?? []).some(
      (line) =>
        line.component.category === this.category &&
        normalizeAttribute(this.attributeOf(line.component)) === this.selected,
    );
  }
}

export const INVERTER_CATEGORY = "Inverter";

export class InverterBrandFilter extends ComponentAttributeFilter {
  constructor(brand: string | null | undefined) {
    super(INVERTER_CATEGORY, brand);
  }

  protected attributeOf(component: ApiSolarComponent): string {
    return component.brand;
  }
}

/** Matches when every active child filter matches. */
export class CompositePackageFilter implements PackageFilter {
  private readonly filters: readonly PackageFilter[];

  constructor(filters: readonly PackageFilter[]) {
    this.filters = filters.filter((f) => f.isActive);
  }

  get isActive(): boolean {
    return this.filters.length > 0;
  }

  matches(pkg: ApiSolarPackage): boolean {
    return this.filters.every((f) => f.matches(pkg));
  }

  apply(packages: readonly ApiSolarPackage[]): ApiSolarPackage[] {
    return this.isActive ? packages.filter((p) => this.matches(p)) : [...packages];
  }
}
