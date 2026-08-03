import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSeoMeta } from "../hooks/useSeoMeta";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { fetchPublicPackages, computeMonthlySavings, type ApiSolarPackage, type ApiPackageComponent, type ApiIpRating, type PackageSelection } from "../services/ASContent";
import { formatCapacity } from "../lib/units";
import { SOLAR_CONSTANTS } from "../models/calculation";
import { useContent } from "../hooks/useContent";

const ASTalkToAnExpert = lazy(() => import("../modules/talk-to-expert-modal/ASTalkToAnExpert"));
import ASPackageInquiry from "../modules/package-inquiry/ASPackageInquiry";
import checkBullet from "../assets/logos/packages/check-bullet.svg";



const ctaMobileStyles = `
  @media (max-width: 767px) {
    .as-packages-cta {
      position: relative !important;
      overflow: hidden !important;
    }
    .as-packages-cta-visual {
      position: absolute !important;
      top: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      left: 0 !important;
      display: flex !important;
      align-items: flex-end !important;
      justify-content: flex-end !important;
      z-index: 0 !important;
      pointer-events: none !important;
      width: 100% !important;
      height: 100% !important;
    }
    .as-packages-cta-visual img {
      width: 380px !important;
      height: auto !important;
      opacity: 0.2 !important;
      max-height: 100% !important;
    }
    .as-packages-cta-content {
      position: relative !important;
      z-index: 1 !important;
    }
  }
`;

const PAGE_SIZE = 3;

type Phase = "single" | "three";
type QtyState = { inverter: number; batteries: number; panels: number };



function getCoreComponents(pkg: ApiSolarPackage) {
  return {
    inverterLine: pkg.components?.find(pc => pc.component.category === "Inverter") ?? null,
    batteryLine:  pkg.components?.find(pc => pc.component.category === "Battery")  ?? null,
    panelLine:    pkg.components?.find(pc => pc.component.category === "Solar Panel") ?? null,
  };
}

function defaultQty(pkg: ApiSolarPackage): QtyState {
  const { inverterLine, batteryLine, panelLine } = getCoreComponents(pkg);
  return {
    inverter:  inverterLine?.quantity ?? 1,
    batteries: batteryLine?.quantity  ?? 0,
    panels:    panelLine?.quantity    ?? 1,
  };
}

type Bounds = { iMin: number; iMax: number; bMin: number; bMax: number; pMin: number; pMax: number };

function computeBounds(pkg: ApiSolarPackage, inverterCount: number): Bounds {
  const { inverterLine, batteryLine, panelLine } = getCoreComponents(pkg);
  const ic = inverterLine?.component;
  const bc = batteryLine?.component;
  const pc = panelLine?.component;


  const cfgI = inverterLine?.quantity ?? 1;
  const cfgB = batteryLine?.quantity  ?? 0;
  const cfgP = panelLine?.quantity    ?? 1;


  let pMin: number, pMax: number;
  if (ic?.pvMaxPower != null && pc != null && pc.productionCapacityKwp > 0) {
    const totalPvMin = (ic.pvMinPower ?? 0) * inverterCount;
    const totalPvMax = ic.pvMaxPower * inverterCount;
    pMin = totalPvMin > 0 ? Math.ceil(totalPvMin / pc.productionCapacityKwp) : 1;
    pMax = Math.floor(totalPvMax / pc.productionCapacityKwp);
  } else {

    const panelMaxPerInverter = (ic && pc && pc.productionCapacityKwp > 0)
      ? Math.floor(ic.loadCapacityKw / pc.productionCapacityKwp)
      : cfgP;
    pMin = 1;
    pMax = Math.max(cfgP, panelMaxPerInverter * inverterCount);
  }


  let bMin: number, bMax: number;
  if (ic?.batteryMaxCapacity != null && bc != null && bc.storageCapacityKwh > 0) {
    const totalBattMax = ic.batteryMaxCapacity * inverterCount;
    bMin = 1;
    bMax = Math.max(1, Math.floor(totalBattMax / bc.storageCapacityKwh));
  } else {

    const batteryMaxPerInverter = (ic && bc && bc.storageCapacityKwh > 0)
      ? Math.max(1, Math.floor(ic.loadCapacityKw / bc.storageCapacityKwh))
      : cfgB;
    bMin = bc ? 1 : 0;
    bMax = Math.max(bc ? 1 : 0, bc ? batteryMaxPerInverter * inverterCount : 0);
  }

  return {
    iMin: cfgI,
    iMax: Math.max(cfgI, ic?.parallelMax ?? cfgI),
    bMin,
    bMax,
    pMin,
    pMax,
  };
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function coreQty(pc: ApiPackageComponent, qty: QtyState): number {
  const cat = pc.component.category;
  if (cat === "Inverter")    return qty.inverter;
  if (cat === "Battery")     return qty.batteries;
  if (cat === "Solar Panel") return qty.panels;
  return pc.quantity;
}

function effectiveQty(pc: ApiPackageComponent, allPcs: ApiPackageComponent[], qty: QtyState): number {
  if (pc.baseComponentId) {
    const basePc = allPcs.find(p => p.componentId === pc.baseComponentId && !p.baseComponentId);
    if (!basePc) return pc.quantity;
    return Math.max(1, Math.ceil(coreQty(basePc, qty) * (pc.multiplier ?? 1)));
  }
  return coreQty(pc, qty);
}

function buildFeatures(pkg: ApiSolarPackage, inverterKw: number, solarKwp: number, storageKwh: number): string[] {
  const isHybrid = pkg.storageKwh > 0;

  if (pkg.mainFeatures?.length) return pkg.mainFeatures;

  const dailyKwh = Math.round(solarKwp * SOLAR_CONSTANTS.dailyYieldPerKwp * 10) / 10;
  const list = [
    `${isHybrid ? "Hybrid" : "Grid Tied"} System`,
    "Mobile Device Monitoring",
    `${formatCapacity(inverterKw, "power", { unit: "kW" })} ${isHybrid ? "Load Capacity" : "System Capacity"}`,
    `${dailyKwh} kWh/day Production Capacity`,
  ];
  if (isHybrid) list.push(`${formatCapacity(storageKwh, "energy", { unit: "kWh" })} Storage Capacity`);
  return list;
}

function pesoFmt(v: number): string {
  return `₱${v.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function QuantityStepper({
  label,
  sublabel,
  value,
  min,
  max,
  onBump,
}: {
  label: string;
  sublabel?: string;
  value: number;
  min: number;
  max: number;
  onBump: (delta: number) => void;
}) {
  return (
    <div className="as-pkg-qty-row">
      <div className="as-pkg-qty-label">
        <span className="as-pkg-qty-name">{label}</span>
        {sublabel && <span className="as-pkg-qty-sub">{sublabel}</span>}
      </div>
      <div className="as-pkg-qty-stepper">
        <button
          className="as-pkg-qty-btn"
          onClick={() => onBump(-1)}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
        >−</button>
        <span className="as-pkg-qty-val">{value}</span>
        <button
          className="as-pkg-qty-btn"
          onClick={() => onBump(1)}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
        >+</button>
      </div>
    </div>
  );
}

const TOOLTIP_MAX_W = 280;
const TOOLTIP_MARGIN = 8;

function IpRatingBadge({ code, description, offset }: { code: string; description: string; offset?: boolean }) {
  const [visible, setVisible] = useState(false);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0, arrowLeft: TOOLTIP_MAX_W / 2 });

  useEffect(() => {
    if (!visible) return;
    const hide = () => setVisible(false);
    window.addEventListener('scroll', hide, { passive: true, capture: true });
    return () => window.removeEventListener('scroll', hide, { capture: true });
  }, [visible]);

  const handleMouseEnter = () => {
    if (badgeRef.current) {
      const rect = badgeRef.current.getBoundingClientRect();
      const badgeCenterX = rect.left + rect.width / 2;
      const vw = window.innerWidth;
      const idealLeft = badgeCenterX - TOOLTIP_MAX_W / 2;
      const clampedLeft = Math.max(TOOLTIP_MARGIN, Math.min(idealLeft, vw - TOOLTIP_MAX_W - TOOLTIP_MARGIN));
      const arrowLeft = Math.max(12, Math.min(badgeCenterX - clampedLeft, TOOLTIP_MAX_W - 12));
      setTooltipPos({ top: rect.bottom, left: clampedLeft, arrowLeft });
    }
    setVisible(true);
  };

  return (
    <div className={`as-pkg-ip-wrap${offset ? " is-offset" : ""}`}>
      <span
        ref={badgeRef}
        className="as-pkg-ip-badge"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setVisible(false)}
      >
        {code}
      </span>
      {visible && createPortal(
        <div
          className="as-pkg-ip-tooltip"
          style={{ top: tooltipPos.top, left: tooltipPos.left, ['--ip-arrow-x' as string]: `${tooltipPos.arrowLeft}px` } as React.CSSProperties}
          role="tooltip"
        >
          <strong>{code}</strong> — {description}
        </div>,
        document.body
      )}
    </div>
  );
}

// Rolls a number from 0 (first appearance) or from its last value (on change)
// to the new target. Returns null while the target itself is null.
function useRollingNumber(target: number | null, duration = 700): number | null {
  const [value, setValue] = useState<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const prevRef = useRef<number | null>(null); // null = not yet seen → start from 0

  useEffect(() => {
    if (target === null) { setValue(null); prevRef.current = null; return; }
    const start = prevRef.current ?? 0;
    prevRef.current = target;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    const diff = target - start;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(start + diff * eased));
      if (p < 1) { frameRef.current = requestAnimationFrame(tick); }
      else { setValue(target); frameRef.current = null; }
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, duration]);

  return value;
}

function PackageCard({
  pkg,
  onInquire,
  ipRating,
}: {
  pkg: ApiSolarPackage;
  onInquire: (sel: PackageSelection) => void;
  ipRating?: ApiIpRating | null;
}) {
  const defaults = defaultQty(pkg);
  const [qty, setQty] = useState<QtyState>(defaults);
  const [showModal, setShowModal] = useState(false);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const [showOtherComponents, setShowOtherComponents] = useState(false);

  const handleCloseModal = useCallback(() => {
    setIsClosingModal(true);
    window.setTimeout(() => {
      setIsClosingModal(false);
      setShowModal(false);
    }, 220);
  }, []);

  useEffect(() => {
    if (!showModal) return;

    const scrollY = window.scrollY;
    const original = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleCloseModal(); };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);

      document.body.style.overflow = original.overflow;
      document.body.style.position = original.position;
      document.body.style.top = original.top;
      document.body.style.width = original.width;
      window.scrollTo(0, scrollY);
    };
  }, [showModal, handleCloseModal]);

  const { inverterLine, batteryLine, panelLine } = getCoreComponents(pkg);
  const isHybrid = pkg.storageKwh > 0;
  const displayName = inverterLine?.component.model ?? pkg.name;


  const liveInverterKw = Math.round((inverterLine?.component.loadCapacityKw ?? 0) * qty.inverter * 10) / 10;
  const liveSolarKwp   = Math.round((panelLine?.component.productionCapacityKwp ?? 0) * qty.panels * 100) / 100;
  const liveStorageKwh = Math.round((batteryLine?.component.storageCapacityKwh ?? 0) * qty.batteries * 100) / 100;

  const savings = computeMonthlySavings(liveSolarKwp);
  const features = buildFeatures(pkg, liveInverterKw, liveSolarKwp, liveStorageKwh);


  const bounds = computeBounds(pkg, qty.inverter);

  const bumpInverter = (delta: number) => {
    setQty((prev) => {
      const newI = clamp(prev.inverter + delta, bounds.iMin, bounds.iMax);
      if (newI === prev.inverter) return prev;
      const nb = computeBounds(pkg, newI);

      const cfgI = inverterLine?.quantity ?? 1;
      const cfgB = batteryLine?.quantity ?? 0;
      const cfgP = panelLine?.quantity ?? 1;
      const newB = batteryLine != null && cfgI > 0
        ? clamp(Math.round(cfgB * newI / cfgI), nb.bMin, nb.bMax)
        : clamp(prev.batteries, nb.bMin, nb.bMax);
      const newP = panelLine != null && cfgI > 0
        ? clamp(Math.round(cfgP * newI / cfgI), nb.pMin, nb.pMax)
        : clamp(prev.panels, nb.pMin, nb.pMax);
      return {
        inverter:  newI,
        batteries: newB,
        panels:    newP,
      };
    });
  };
  const bumpBatteries = (delta: number) =>
    setQty((prev) => ({ ...prev, batteries: clamp(prev.batteries + delta, bounds.bMin, bounds.bMax) }));
  const bumpPanels = (delta: number) =>
    setQty((prev) => ({ ...prev, panels: clamp(prev.panels + delta, bounds.pMin, bounds.pMax) }));


  const calcPrice = (): { price: number | null; breakdown: Array<{ name: string; qty: number; unitPrice: number; total: number }> } => {
    if (!pkg.components?.length) return { price: pkg.totalPrice, breakdown: [] };
    const breakdown: Array<{ name: string; qty: number; unitPrice: number; total: number }> = [];
    let total = 0;
    let allPriced = true;
    pkg.components.forEach((pc) => {
      const comp = pc.component;
      if (!comp.pricingEnabled || comp.unitPrice === null) { allPriced = false; return; }
      const count = effectiveQty(pc, pkg.components ?? [], qty);
      const lineTotal = count * comp.unitPrice;
      total += lineTotal;
      breakdown.push({ name: `${comp.name} (${comp.brand})`, qty: count, unitPrice: comp.unitPrice, total: lineTotal });
    });
    return { price: allPriced ? total : null, breakdown };
  };

  const { price: dynamicPrice } = calcPrice();

  const animatedPrice = useRollingNumber(dynamicPrice, 700);
  const animatedSavingsMin = useRollingNumber(savings.min, 700);
  const animatedSavingsMax = useRollingNumber(savings.max, 700);

  const priceToDisplay = animatedPrice ?? dynamicPrice ?? pkg.totalPrice;
  const displaySavingsMin = animatedSavingsMin ?? savings.min;
  const displaySavingsMax = animatedSavingsMax ?? savings.max;

  const buildSelection = (): PackageSelection => ({
    qty,
    solarKwp: liveSolarKwp,
    inverterKw: liveInverterKw,
    storageKwh: liveStorageKwh,
    savings,
    price: dynamicPrice ?? pkg.totalPrice,
    components: pkg.components?.map((pc) => {
      const count = effectiveQty(pc, pkg.components ?? [], qty);
      return {
        brand: pc.component.brand,
        name: pc.component.name,
        category: pc.component.category,
        quantity: count,
        unitPrice: pc.component.pricingEnabled ? pc.component.unitPrice : null,
      };
    }) ?? [],
  });

  return (
    <div className={`as-pkg-card${pkg.isRecommended ? " is-recommended" : ""}`}>
      {pkg.isRecommended && <div className="as-pkg-recommended-badge">Recommended</div>}
      {ipRating && <IpRatingBadge code={ipRating.code} description={ipRating.description} offset={!!pkg.isRecommended} />}

      <div className="as-pkg-top">
        <div className="as-pkg-name">{displayName}</div>
        {priceToDisplay != null && <div className="as-pkg-price">{pesoFmt(priceToDisplay)}</div>}
        <div className="as-pkg-size-label">{formatCapacity(liveInverterKw, "power", { unit: "kW" })} System</div>
        <div className="as-pkg-savings">Approx. Monthly Saving: ₱{displaySavingsMin.toLocaleString()} – ₱{displaySavingsMax.toLocaleString()}</div>
        <button
          className={`as-pkg-inquire${pkg.isRecommended ? " is-featured" : ""}`}
          onClick={() => onInquire(buildSelection())}
        >
          Inquire
        </button>
      </div>

      <div className="as-pkg-divider" />

      <ul className="as-pkg-features">
        {features.map((f) => (
          <li key={f} className="as-pkg-feature-row">
            <img src={checkBullet} alt="" aria-hidden="true" width={14} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <p className="as-pkg-customize-note">*You can customize your system</p>

      <div className="as-pkg-qty-table">
        <QuantityStepper
          label="Inverter"
          sublabel={[
            [inverterLine?.component.brand, inverterLine?.component.model].filter(Boolean).join(" "),
            inverterLine?.component.loadCapacityKw ? formatCapacity(inverterLine.component.loadCapacityKw, "power", { unit: "kW" }) : undefined,
          ].filter(Boolean).join(" | ") || undefined}
          value={qty.inverter}
          min={bounds.iMin}
          max={bounds.iMax}
          onBump={bumpInverter}
        />
        {isHybrid && (
          <QuantityStepper
            label="Battery"
            sublabel={[
              [batteryLine?.component.brand, batteryLine?.component.model].filter(Boolean).join(" "),
              batteryLine?.component.storageCapacityKwh ? formatCapacity(batteryLine.component.storageCapacityKwh, "energy", { unit: "kWh" }) : undefined,
            ].filter(Boolean).join(" | ") || undefined}
            value={qty.batteries}
            min={bounds.bMin}
            max={bounds.bMax}
            onBump={bumpBatteries}
          />
        )}
        <QuantityStepper
          label="Solar Panel"
          sublabel={[
            [panelLine?.component.brand, panelLine?.component.model].filter(Boolean).join(" "),
            panelLine?.component.productionCapacityKwp ? `${Math.round(panelLine.component.productionCapacityKwp * 1000)}W` : undefined,
          ].filter(Boolean).join(" | ") || undefined}
          value={qty.panels}
          min={bounds.pMin}
          max={bounds.pMax}
          onBump={bumpPanels}
        />
      </div>

      <button className="as-pkg-details-link" onClick={() => { setShowModal(true); setShowOtherComponents(false); }}>
        See more details
        {}
      </button>

      {showModal && createPortal(
        <div className={`as-pkg-modal-overlay${isClosingModal ? " is-closing" : ""}`} onClick={handleCloseModal} role="dialog" aria-modal="true" aria-label={`${displayName} details`}>
          <div className={`as-pkg-modal${isClosingModal ? " is-closing" : ""}`} onClick={(e) => e.stopPropagation()}>

            {}
            <div className="as-pkg-modal-hero">
              {pkg.imageUrl && (
                <div className="as-pkg-modal-hero-bg" style={{ backgroundImage: `url(${pkg.imageUrl})` }} />
              )}
              <div className="as-pkg-modal-hero-gradient" />

              <button className="as-pkg-modal-close" onClick={handleCloseModal} aria-label="Close details">✕</button>

              <div className="as-pkg-modal-hero-content">
                <div className="as-pkg-modal-hero-label">{displayName}</div>
                {priceToDisplay != null && (
                  <div className="as-pkg-modal-hero-price">{pesoFmt(priceToDisplay)}</div>
                )}
                <div className="as-pkg-modal-hero-size">
                  {formatCapacity(liveInverterKw, "power", { unit: "kW" })} System
                </div>
                <div className="as-pkg-modal-hero-savings">
                  Approx. Monthly Saving: ₱{displaySavingsMin.toLocaleString()} – ₱{displaySavingsMax.toLocaleString()}
                </div>
                <button
                  className="as-pkg-modal-hero-inquire"
                  onClick={() => { handleCloseModal(); onInquire(buildSelection()); }}
                >
                  Inquire
                </button>
              </div>
            </div>

            {}
            <div className="as-pkg-modal-body">

              {}
              {inverterLine && (
                <div className="as-pkg-spec-section">
                  <div className="as-pkg-spec-sec-header">
                    <span className="as-pkg-spec-sec-title">Inverter Specification</span>
                    <a
                      href={inverterLine.component.dataSheetUrl ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`as-pkg-spec-datasheet${!inverterLine.component.dataSheetUrl ? " is-disabled" : ""}`}
                      aria-disabled={!inverterLine.component.dataSheetUrl}
                    >
                      Download Data Sheet
                    </a>
                  </div>
                  <div className="as-pkg-spec-rows">
                    <div className="as-pkg-spec-row">
                      Model Name
                      <span className="spec-value">{inverterLine.component.brand} {inverterLine.component.model}</span>
                    </div>
                    <div className="as-pkg-spec-row">
                      Inverter Capacity
                      <span className="spec-value">{formatCapacity(inverterLine.component.loadCapacityKw, "power", { unit: "kW" })}</span>
                    </div>
                  </div>
                </div>
              )}

              {}
              {isHybrid && batteryLine && (
                <div className="as-pkg-spec-section">
                  <div className="as-pkg-spec-sec-header">
                    <span className="as-pkg-spec-sec-title">Battery Specification</span>
                    <a
                      href={batteryLine.component.dataSheetUrl ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`as-pkg-spec-datasheet${!batteryLine.component.dataSheetUrl ? " is-disabled" : ""}`}
                      aria-disabled={!batteryLine.component.dataSheetUrl}
                    >
                      Download Data Sheet
                    </a>
                  </div>
                  <div className="as-pkg-spec-rows">
                    <div className="as-pkg-spec-row">
                      Model Name
                      <span className="spec-value">{batteryLine.component.brand} {batteryLine.component.model}</span>
                    </div>
                    <div className="as-pkg-spec-row">
                      Battery Capacity
                      <span className="spec-value">{formatCapacity(batteryLine.component.storageCapacityKwh, "energy", { unit: "kWh" })}</span>
                    </div>
                  </div>
                </div>
              )}

              {}
              {panelLine && (
                <div className="as-pkg-spec-section">
                  <div className="as-pkg-spec-sec-header">
                    <span className="as-pkg-spec-sec-title">Solar Panel Specification</span>
                    <a
                      href={panelLine.component.dataSheetUrl ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`as-pkg-spec-datasheet${!panelLine.component.dataSheetUrl ? " is-disabled" : ""}`}
                      aria-disabled={!panelLine.component.dataSheetUrl}
                    >
                      Download Data Sheet
                    </a>
                  </div>
                  <div className="as-pkg-spec-rows">
                    <div className="as-pkg-spec-row">
                      Model Name
                      <span className="spec-value">{panelLine.component.brand} {panelLine.component.model}</span>
                    </div>
                    <div className="as-pkg-spec-row">
                      Production Capacity
                      <span className="spec-value">{Math.round(panelLine.component.productionCapacityKwp * 1000)}W</span>
                    </div>
                  </div>
                </div>
              )}

              {}
              {(() => {
                const CORE = ["Inverter", "Battery", "Solar Panel"];
                const TYPE_ORDER: Record<string, number> = {
                  'Mounting & Racking': 0,
                  'Wiring & Protection': 1,
                  'Monitoring': 2,
                };
                const otherPcs = (pkg.components ?? [])
                  .filter((pc) => !CORE.includes(pc.component.category))
                  .sort((a, b) => {
                    const oa = TYPE_ORDER[a.component.category] ?? 3;
                    const ob = TYPE_ORDER[b.component.category] ?? 3;
                    return oa - ob;
                  });
                if (otherPcs.length === 0) return null;

                if (!showOtherComponents) {
                  return (
                    <div className="as-pkg-modal-see-more">
                      <button className="as-pkg-modal-see-more-btn" onClick={() => setShowOtherComponents(true)}>
                        See more details
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="as-pkg-spec-section">
                    <div className="as-pkg-spec-sec-header">
                      <span className="as-pkg-spec-sec-title">Components</span>
                    </div>
                    <div className="as-pkg-spec-others-list">
                      {otherPcs.map((pc) => {
                        const comp = pc.component;
                        const capacityStr =
                          comp.loadCapacityKw > 0
                            ? formatCapacity(comp.loadCapacityKw, "power", { unit: "kW" })
                            : comp.storageCapacityKwh > 0
                            ? formatCapacity(comp.storageCapacityKwh, "energy", { unit: "kWh" })
                            : comp.productionCapacityKwp > 0
                            ? `${Math.round(comp.productionCapacityKwp * 1000)}W`
                            : null;
                        return (
                          <div key={pc.componentId} className="as-pkg-spec-other-item">
                            <span className="other-name">
                              <span>{comp.brand} {comp.name}</span>
                              {comp.model && <span className="other-model">{comp.model}</span>}
                              {capacityStr && <span className="other-cap">{capacityStr}</span>}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="as-pkg-modal-see-more">
                      <button className="as-pkg-modal-see-more-btn" onClick={() => setShowOtherComponents(false)}>
                        See less details
                      </button>
                    </div>
                  </div>
                );
              })()}

            </div>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

type PackageGroup = { label: string; packages: ApiSolarPackage[] };

function groupByType(packages: ApiSolarPackage[], phase: Phase): PackageGroup[] {
  const active = packages
    .filter((p) => p.phase === phase && p.isActive)
    .sort((a, b) =>
      (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0) ||
      (a.sortOrder ?? Infinity) - (b.sortOrder ?? Infinity) ||
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const hybrid = active.filter((p) => p.storageKwh > 0);
  const gridTied = active.filter((p) => p.storageKwh === 0);
  const phaseLabel = phase === "three" ? "Three Phase" : "Single Phase";
  const groups: PackageGroup[] = [];
  if (hybrid.length) groups.push({ label: `${phaseLabel} · Hybrid`, packages: hybrid });
  if (gridTied.length) groups.push({ label: `${phaseLabel} · Grid-Tied`, packages: gridTied });
  return groups;
}

function PkgCardSkeleton() {
  return (
    <div className="as-pkg-card-skeleton" aria-hidden="true">
      <div className="as-pkg-skeleton-top">
        <div className="as-pkg-skeleton-line as-pkg-skeleton-line--name" />
        <div className="as-pkg-skeleton-line as-pkg-skeleton-line--price" />
        <div className="as-pkg-skeleton-line as-pkg-skeleton-line--meta" />
        <div className="as-pkg-skeleton-line as-pkg-skeleton-line--meta" />
        <div className="as-pkg-skeleton-btn" />
      </div>
      <div className="as-pkg-skeleton-divider" />
      <div className="as-pkg-skeleton-features">
        <div className="as-pkg-skeleton-feature" />
        <div className="as-pkg-skeleton-feature" />
        <div className="as-pkg-skeleton-feature" />
        <div className="as-pkg-skeleton-feature as-pkg-skeleton-feature--short" />
      </div>
      <div className="as-pkg-skeleton-line as-pkg-skeleton-line--note" />
      <div className="as-pkg-skeleton-steppers">
        <div className="as-pkg-skeleton-stepper" />
        <div className="as-pkg-skeleton-stepper" />
        <div className="as-pkg-skeleton-stepper" />
      </div>
    </div>
  );
}

export default function ASPackages() {
  useSeoMeta({
    title: "Affordable Solar Packages in Bohol, Philippines",
    description: "Browse affordable residential & commercial solar packages in Bohol. Hybrid, grid-tie & off-grid systems with full installation — single & three phase available.",
    canonical: "https://azari.solar/packages",
  });
  const navigate = useNavigate();
  const pageVis = useContent<{ packages?: boolean }>("section-visibility", { packages: true });

  useEffect(() => {
    if (pageVis.packages === false) navigate("/", { replace: true });
  }, [pageVis.packages, navigate]);


  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = ctaMobileStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [phase, setPhase] = useState<Phase>("single");
  const [packages, setPackages] = useState<ApiSolarPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});
  const [loadingMoreGroups, setLoadingMoreGroups] = useState<Record<string, boolean>>({});
  const [selectedPkg, setSelectedPkg] = useState<ApiSolarPackage | null>(null);
  const [selectedSelection, setSelectedSelection] = useState<PackageSelection | null>(null);
  const [inquireOpen, setInquireOpen] = useState(false);
  const [ctaModalOpen, setCtaModalOpen] = useState(false);

  useEffect(() => {
    fetchPublicPackages()
      .then(setPackages)
      .finally(() => setLoading(false));
  }, []);

  const groups = groupByType(packages, phase);

  const showMore = (label: string, total: number) => {
    setLoadingMoreGroups((prev) => ({ ...prev, [label]: true }));
    window.setTimeout(() => {
      setVisibleCounts((prev) => ({
        ...prev,
        [label]: Math.min((prev[label] ?? PAGE_SIZE) + PAGE_SIZE, total),
      }));
      setLoadingMoreGroups((prev) => ({ ...prev, [label]: false }));
    }, 350);
  };

  const showLess = (label: string) => {
    setVisibleCounts((prev) => ({ ...prev, [label]: PAGE_SIZE }));
  };

  const handlePhase = (p: Phase) => {
    setPhase(p);
    setVisibleCounts({});
  };

  return (
    <div className="route-page">
      <svg style={{ display: "none" }} width="0" height="0">
        <defs>
          <filter id="pkg-ceo-sharpen">
            <feConvolveMatrix type="matrix" kernelMatrix="0 -0.5 0 -0.5 3 -0.5 0 -0.5 0" divisor="1" />
          </filter>
        </defs>
      </svg>
      <div className="ASPackages page-container">

        <div className="as-packages-header">
          <h1 className="as-packages-title">Our Residential Packages</h1>
          <p className="as-packages-subtitle">We offer a variety of packages for your home needs</p>
        </div>

        <div className={`as-packages-phase-toggle${phase === "three" ? " is-second" : ""}`}>
          <span className="as-pkg-phase-slider" aria-hidden="true" />
          <button
            className={`as-pkg-phase-btn${phase === "single" ? " is-active" : ""}`}
            onClick={() => handlePhase("single")}
          >
            Single Phase
          </button>
          <button
            className={`as-pkg-phase-btn${phase === "three" ? " is-active" : ""}`}
            onClick={() => handlePhase("three")}
          >
            Three Phase
          </button>
        </div>

        {loading ? (
          <div className="as-packages-skeleton" aria-busy="true">
            {[0, 1].map((g) => (
              <div key={g} className="as-pkg-skeleton-group">
                <div className="as-pkg-skeleton-group-label" aria-hidden="true" />
                <div className="as-packages-grid">
                  {[0, 1, 2].map((i) => <PkgCardSkeleton key={i} />)}
                </div>
              </div>
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="as-packages-empty">No packages available for this phase.</div>
        ) : (
          groups.map((group) => {
            const total = group.packages.length;
            const visibleCount = visibleCounts[group.label] ?? PAGE_SIZE;
            const visible = group.packages.slice(0, visibleCount);
            const allShown = visibleCount >= total;
            const isLoadingMore = loadingMoreGroups[group.label] ?? false;
            const skeletonCount = Math.min(PAGE_SIZE, total - visibleCount);
            return (
              <div key={group.label} className="as-packages-group">
                <h2 className="as-packages-group-label">{group.label}</h2>
                <div className="as-packages-grid">
                  {visible.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} onInquire={(sel) => { setSelectedPkg(pkg); setSelectedSelection(sel); setInquireOpen(true); }} ipRating={pkg.ipRating ?? null} />
                  ))}
                  {isLoadingMore && Array.from({ length: skeletonCount }).map((_, i) => (
                    <PkgCardSkeleton key={`more-skeleton-${i}`} />
                  ))}
                </div>
                {total > PAGE_SIZE && (
                  <button
                    className="as-packages-show-more"
                    disabled={isLoadingMore}
                    onClick={() => allShown ? showLess(group.label) : showMore(group.label, total)}
                  >
                    {allShown ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            );
          })
        )}

        <div className="as-packages-cta">
          <div className="as-packages-cta-content">
            <h2 className="as-packages-cta-title">
              <span className="as-packages-cta-accent">Future-proof</span> your business infrastructure.
            </h2>
            <p className="as-packages-cta-tagline">
              Turn your operational overhead into a strategic advantage.
            </p>
            <p className="as-packages-cta-sub">
              Commercial and industrial energy demands require sophisticated, scalable engineering. Get in touch
              with our specialist team for a comprehensive energy audit, financial feasibility breakdown, and
              custom system design.
            </p>
            <div className="as-packages-cta-actions">
              <button className="as-packages-cta-btn is-primary" onClick={() => setCtaModalOpen(true)}>
                Contact Our C&amp;I Team →
              </button>
              <button className="as-packages-cta-btn is-secondary" onClick={() => setCtaModalOpen(true)}>
                Schedule a Consultation
              </button>
            </div>
          </div>
          <div className="as-packages-cta-visual" aria-hidden="true" />
        </div>

      </div>

      <ASPackageInquiry
        isOpen={inquireOpen}
        pkg={selectedPkg}
        selection={selectedSelection}
        onClose={() => { setInquireOpen(false); setSelectedPkg(null); setSelectedSelection(null); }}
      />
      <Suspense fallback={null}>
        <ASTalkToAnExpert isOpen={ctaModalOpen} onClose={() => setCtaModalOpen(false)} />
      </Suspense>
    </div>
  );
}
