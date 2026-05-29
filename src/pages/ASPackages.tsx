import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPublicPackages, type ApiSolarPackage } from "../services/ASContent";
import { SOLAR_PACKAGES } from "../models/packages";
import { useContent } from "../hooks/useContent";
import ASTalkToAnExpert from "../modules/talk-to-expert-modal/ASTalkToAnExpert";
import ASPackageInquiry from "../modules/package-inquiry/ASPackageInquiry";

const PANEL_KWP = 0.5;
const BATTERY_KWH = 5.12;
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
  return {
    inverter: 1,
    batteries: pkg.storageKwh > 0 ? Math.max(1, Math.round(pkg.storageKwh / BATTERY_KWH)) : 0,
    panels: Math.max(1, Math.round(pkg.solarKwp / PANEL_KWP)),
  };
}

function pesoFmt(v: number): string {
  return `₱${v.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function toApiPackages(pkgs: typeof SOLAR_PACKAGES): ApiSolarPackage[] {
  return pkgs.map((p, i) => ({
    id: p.id,
    name: p.name,
    solarKwp: p.solarKwp,
    inverterKw: p.inverterKw,
    storageKwh: p.storageKwh,
    phase: p.phase,
    totalPrice: p.totalPrice,
    billRangeMin: p.monthlyBillRange[0],
    billRangeMax: p.monthlyBillRange[1],
    isActive: true,
    isRecommended: p.isRecommended ?? false,
    sortOrder: i,
    createdAt: "",
    updatedAt: "",
  }));
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
  const features = getFeatures(pkg);

  const bump = (key: keyof QtyState, delta: number) => {
    setQty((prev) => ({ ...prev, [key]: Math.max(defaults[key], prev[key] + delta) }));
  };

  return (
    <div className={`as-pkg-card${pkg.isRecommended ? " is-recommended" : ""}`}>
      {pkg.isRecommended && (
        <div className="as-pkg-recommended-badge">Recommended</div>
      )}

      <div className="as-pkg-top">
        <div className="as-pkg-name">{pkg.name}</div>
        <div className="as-pkg-price">{pesoFmt(pkg.totalPrice)}</div>
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
            ["Solar Array", `${pkg.solarKwp} kWp`],
            ["Inverter", `${pkg.inverterKw} kW`],
            ...(pkg.storageKwh > 0 ? [["Battery Storage", `${pkg.storageKwh} kWh`]] : []),
            ["Total Price", pesoFmt(pkg.totalPrice)],
            ["Suitable for Bills", `${pesoFmt(pkg.billRangeMin)} – ${pesoFmt(pkg.billRangeMax)}/mo`],
          ].map(([label, val]) => (
            <div key={label} className="as-pkg-detail-row">
              <span>{label}</span>
              <strong>{val}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type PackageGroup = { label: string; packages: ApiSolarPackage[] };

function groupByType(packages: ApiSolarPackage[], phase: Phase): PackageGroup[] {
  const active = packages
    .filter((p) => p.phase === phase && p.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

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

  const [phase, setPhase] = useState<Phase>("single");
  const [packages, setPackages] = useState<ApiSolarPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [selectedPkg, setSelectedPkg] = useState<ApiSolarPackage | null>(null);
  const [inquireOpen, setInquireOpen] = useState(false);
  const [ctaModalOpen, setCtaModalOpen] = useState(false);

  useEffect(() => {
    fetchPublicPackages()
      .then((data) => setPackages(data.length ? data : toApiPackages(SOLAR_PACKAGES)))
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
          <h2 className="as-packages-cta-title">
            <span className="as-packages-cta-accent">Future-proof</span> your business infrastructure.
          </h2>
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
