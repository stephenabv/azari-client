import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPublicPackages, type ApiSolarPackage } from "../services/ASContent";
import { useContent } from "../hooks/useContent";
import ASTalkToAnExpert from "../modules/talk-to-expert-modal/ASTalkToAnExpert";
import ASPackageInquiry from "../modules/package-inquiry/ASPackageInquiry";
import ceoPerson from "../assets/images/ceo.svg";
import ceoPersonLight from "../assets/images/ceo-light.svg";

// Mobile responsive styles for CEO image
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

const INITIAL_VISIBLE = 6;

type Phase = "single" | "three";
type QtyState = { inverter: number; batteries: number; panels: number };

function getSystemType(storageKwh: number): string {
  return storageKwh > 0 ? "Hybrid" : "Grid-Tied";
}

function getFeatures(pkg: ApiSolarPackage): string[] {
  const sysType = getSystemType(pkg.storageKwh);
  const list = [
    `${sysType === "Hybrid" ? "Hybrid" : "Grid Tied"} System`,
    "Mobile Device Monitoring",
    `${pkg.inverterKw} kW Load Capacity`,
    `${pkg.solarKwp} kWp Production Capacity`,
  ];
  if (pkg.storageKwh > 0) list.push(`${pkg.storageKwh} kWh Storage Capacity`);
  return list;
}

function defaultQty(pkg: ApiSolarPackage): QtyState {
  const qty = { inverter: 0, batteries: 0, panels: 0 };
  pkg.components?.forEach((pc) => {
    if (pc.component.category === "Inverter") qty.inverter += pc.quantity;
    else if (pc.component.category === "Battery") qty.batteries += pc.quantity;
    else if (pc.component.category === "Solar Panel") qty.panels += pc.quantity;
  });
  return qty;
}

function pesoFmt(v: number): string {
  return `₱${v.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function QuantityStepper({
  label,
  value,
  min,
  onBump,
}: {
  label: string;
  value: number;
  min: number;
  onBump: (delta: number) => void;
}) {
  return (
    <div className="as-pkg-qty-row">
      <span className="as-pkg-qty-label">{label}</span>
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
          aria-label={`Increase ${label}`}
        >+</button>
      </div>
    </div>
  );
}

function PackageCard({
  pkg,
  onInquire,
}: {
  pkg: ApiSolarPackage;
  onInquire: () => void;
}) {
  const defaults = defaultQty(pkg);
  const [qty, setQty] = useState<QtyState>(defaults);
  const [showDetails, setShowDetails] = useState(false);
  const [displayPrice, setDisplayPrice] = useState<number | null>(null);
  const features = getFeatures(pkg);

  const bump = (key: keyof QtyState, delta: number) => {
    setQty((prev) => ({ ...prev, [key]: Math.max(defaults[key], prev[key] + delta) }));
  };

  // Calculate dynamic pricing based on actual component quantities
  const calculateDynamicPrice = (): { price: number | null; breakdown: Array<{ name: string; qty: number; unitPrice: number; total: number }> } => {
    if (!pkg.components || pkg.components.length === 0) {
      return { price: pkg.totalPrice, breakdown: [] };
    }

    const breakdown: Array<{ name: string; qty: number; unitPrice: number; total: number }> = [];
    let totalPrice = 0;
    let allPriced = true;
    const defaults = defaultQty(pkg);

    // Calculate price based on actual component quantities adjusted by user
    pkg.components.forEach((pc) => {
      const comp = pc.component;
      if (!comp.pricingEnabled || comp.unitPrice === null) {
        allPriced = false;
        return;
      }

      // Calculate multiplier: (current qty / default qty per category)
      let multiplier = 1;
      if (comp.category === "Solar Panel" && defaults.panels > 0) {
        multiplier = qty.panels / defaults.panels;
      } else if (comp.category === "Inverter" && defaults.inverter > 0) {
        multiplier = qty.inverter / defaults.inverter;
      } else if (comp.category === "Battery" && defaults.batteries > 0) {
        multiplier = qty.batteries / defaults.batteries;
      }

      // Total quantity = base quantity in package * multiplier
      const componentQty = pc.quantity * multiplier;
      const componentTotal = componentQty * comp.unitPrice;
      totalPrice += componentTotal;
      breakdown.push({
        name: `${comp.name} (${comp.brand})`,
        qty: componentQty,
        unitPrice: comp.unitPrice,
        total: componentTotal,
      });
    });

    return { price: allPriced ? totalPrice : null, breakdown };
  };

  const { price: dynamicPrice, breakdown } = calculateDynamicPrice();

  // Animate price changes
  useEffect(() => {
    if (dynamicPrice === null) {
      setDisplayPrice(null);
      return;
    }

    const startPrice = displayPrice ?? (pkg.totalPrice ?? dynamicPrice);
    const targetPrice = dynamicPrice;
    const difference = targetPrice - startPrice;
    const duration = 500; // ms
    const startTime = Date.now();

    const animatePrice = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function: ease-out
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentPrice = startPrice + difference * easeProgress;
      setDisplayPrice(Math.round(currentPrice));

      if (progress < 1) {
        requestAnimationFrame(animatePrice);
      } else {
        setDisplayPrice(targetPrice);
      }
    };

    requestAnimationFrame(animatePrice);
  }, [dynamicPrice, displayPrice, pkg.totalPrice]);

  const priceToDisplay = displayPrice ?? dynamicPrice ?? pkg.totalPrice;

  return (
    <div className={`as-pkg-card${pkg.isRecommended ? " is-recommended" : ""}`}>
      {pkg.isRecommended && (
        <div className="as-pkg-recommended-badge">Recommended</div>
      )}

      <div className="as-pkg-top">
        <div className="as-pkg-name">{pkg.name}</div>
        {(priceToDisplay != null) && (
          <div className="as-pkg-price">
            {pesoFmt(priceToDisplay)}
          </div>
        )}
        <div className="as-pkg-size-label">{pkg.solarKwp} kWp System</div>
        <div className="as-pkg-savings">
          Approx. Monthly Saving: {pesoFmt(pkg.billRangeMin)} – {pesoFmt(pkg.billRangeMax)}
        </div>
        <button
          className={`as-pkg-inquire${pkg.isRecommended ? " is-featured" : ""}`}
          onClick={onInquire}
        >
          Inquire
        </button>
      </div>

      <div className="as-pkg-divider" />

      <ul className="as-pkg-features">
        {features.map((f) => (
          <li key={f} className="as-pkg-feature-row">
            <span className="as-pkg-check" aria-hidden="true">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <p className="as-pkg-customize-note">*You can customize your system</p>

      <div className="as-pkg-qty-table">
        <QuantityStepper label="Inverter" value={qty.inverter} min={defaults.inverter} onBump={(d) => bump("inverter", d)} />
        {pkg.storageKwh > 0 && (
          <QuantityStepper label="Batteries" value={qty.batteries} min={defaults.batteries} onBump={(d) => bump("batteries", d)} />
        )}
        <QuantityStepper label="Solar Panels" value={qty.panels} min={defaults.panels} onBump={(d) => bump("panels", d)} />
      </div>

      <button className="as-pkg-details-link" onClick={() => setShowDetails((v) => !v)}>
        {showDetails ? "See less details" : "See more details"}
        <svg
          width="10" height="6" viewBox="0 0 10 6" fill="none"
          style={{ transform: showDetails ? "rotate(180deg)" : undefined, transition: "transform 0.2s ease" }}
        >
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {showDetails && (
        <div className="as-pkg-detail-panel">
          {[
            ["Phase", pkg.phase === "single" ? "Single Phase" : "Three Phase"],
            ["Production Capacity", `${pkg.solarKwp} kWp`],
            ["Load Capacity", `${pkg.inverterKw} kW`],
            ...(pkg.storageKwh > 0 ? [["Storage Capacity", `${pkg.storageKwh} kWh`]] : []),
            ...(priceToDisplay != null ? [["Total Price", pesoFmt(priceToDisplay)]] : []),
            ["Suitable for Bills", `${pesoFmt(pkg.billRangeMin)} – ${pesoFmt(pkg.billRangeMax)}/mo`],
          ].map(([label, val]) => (
            <div key={label} className="as-pkg-detail-row">
              <span>{label}</span>
              <strong>{val}</strong>
            </div>
          ))}

          {breakdown.length > 0 && (
            <>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 12, paddingTop: 12 }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Component Breakdown
                </div>
                {breakdown.map((item) => (
                  <div key={item.name} style={{ fontSize: "12px", marginBottom: 6, color: "rgba(255,255,255,0.8)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>{item.name}</span>
                      <span style={{ opacity: 0.7 }}>×{item.qty}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", opacity: 0.6, marginTop: 2 }}>
                      <span>{pesoFmt(item.unitPrice)} each</span>
                      <span>{pesoFmt(item.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

type PackageGroup = { label: string; packages: ApiSolarPackage[] };

function groupByType(packages: ApiSolarPackage[], phase: Phase): PackageGroup[] {
  const active = packages
    .filter((p) => p.phase === phase && p.isActive)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const hybrid = active.filter((p) => p.storageKwh > 0);
  const gridTied = active.filter((p) => p.storageKwh === 0);
  const phaseLabel = phase === "three" ? "Three Phase" : "Single Phase";
  const groups: PackageGroup[] = [];
  if (hybrid.length) groups.push({ label: `${phaseLabel} · Hybrid`, packages: hybrid });
  if (gridTied.length) groups.push({ label: `${phaseLabel} · Grid-Tied`, packages: gridTied });
  return groups;
}

export default function ASPackages() {
  const navigate = useNavigate();
  const pageVis = useContent<{ packages?: boolean }>("section-visibility", { packages: true });

  useEffect(() => {
    if (pageVis.packages === false) navigate("/", { replace: true });
  }, [pageVis.packages, navigate]);

  // Inject mobile styles for CEO image background
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
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [selectedPkg, setSelectedPkg] = useState<ApiSolarPackage | null>(null);
  const [inquireOpen, setInquireOpen] = useState(false);
  const [ctaModalOpen, setCtaModalOpen] = useState(false);

  useEffect(() => {
    fetchPublicPackages()
      .then((data) => setPackages(data))
      .finally(() => setLoading(false));
  }, []);

  const groups = groupByType(packages, phase);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const handlePhase = (p: Phase) => {
    setPhase(p);
    setExpandedGroups(new Set());
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
          <h1 className="as-packages-title">Our Housing Packages</h1>
          <p className="as-packages-subtitle">We offer a variety of packages for your home needs</p>
        </div>

        <div className="as-packages-phase-toggle">
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
          <div className="as-packages-loading">Loading packages…</div>
        ) : groups.length === 0 ? (
          <div className="as-packages-empty">No packages available for this phase.</div>
        ) : (
          groups.map((group) => {
            const isExpanded = expandedGroups.has(group.label);
            const visible = isExpanded ? group.packages : group.packages.slice(0, INITIAL_VISIBLE);
            const surplus = group.packages.length - INITIAL_VISIBLE;
            const groupType = group.label.split("·")[1]?.trim() ?? "";

            return (
              <div key={group.label} className="as-packages-group">
                <h2 className="as-packages-group-label">{group.label}</h2>
                <div className="as-packages-grid">
                  {visible.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} onInquire={() => { setSelectedPkg(pkg); setInquireOpen(true); }} />
                  ))}
                </div>
                {surplus > 0 && (
                  <button className="as-packages-show-more" onClick={() => toggleGroup(group.label)}>
                    {isExpanded
                      ? `See less ${groupType} packages`
                      : `See ${surplus} more ${groupType} packages`}
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
          <div className="as-packages-cta-visual" aria-hidden="true">
            <img src={ceoPerson}      alt="" className="as-packages-cta-person as-ceo-dark" />
            <img src={ceoPersonLight} alt="" className="as-packages-cta-person as-ceo-light" />
          </div>
        </div>

      </div>

      <ASPackageInquiry
        isOpen={inquireOpen}
        pkg={selectedPkg}
        onClose={() => { setInquireOpen(false); setSelectedPkg(null); }}
      />
      <ASTalkToAnExpert isOpen={ctaModalOpen} onClose={() => setCtaModalOpen(false)} />
    </div>
  );
}
