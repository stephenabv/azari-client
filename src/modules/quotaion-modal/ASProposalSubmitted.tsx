import type { EngineResult } from "../../models/calculation";
import { findMatchingPackages, type SolarPackage } from "../../models/packages";

type ProposalSubmittedModalProps = {
  onClose: () => void;
  engineResult: EngineResult | null;
  propertyType: string;
};

function formatPeso(value: number) {
  return `₱${value.toLocaleString("en-PH")}`;
}

function phaseLabel(phase: SolarPackage["phase"]) {
  return phase === "single" ? "Single Phase" : "Three Phase";
}

export default function ProposalSubmittedModal({
  onClose,
  engineResult,
  propertyType,
}: ProposalSubmittedModalProps) {
  const preferredPhase =
    propertyType === "Residential" ? "single" : "three";

  const packages = engineResult
    ? findMatchingPackages(engineResult, preferredPhase)
    : [];

  const systemLabel = engineResult
    ? `${engineResult.solarKwp.toFixed(2)} kWp ${engineResult.systemType === "grid-tied" ? "Grid-Tied" : "Hybrid"}`
    : "Custom Solar System";

  return (
    <div className="as-modal-backdrop">
      <div className="as-modal as-submitted-modal">
        <div className="as-success-icon">✓</div>

        <h2>Request Submitted</h2>

        <p>
          Our renewable energy advisor will review your profile and reach out
          shortly with a tailored proposal.
        </p>

        <div className="as-submitted-requirement">
          <span>Your estimated system requirement</span>
          <div className="as-submitted-req-specs">
            <span>{engineResult?.solarKwp.toFixed(2) ?? "—"} kWp Solar</span>
            <span>{engineResult?.inverterKw ?? "—"} kW Inverter</span>
            {engineResult && engineResult.storageKwh > 0 && (
              <span>{engineResult.storageKwh} kWh Battery</span>
            )}
            {engineResult && engineResult.storageKwh === 0 && (
              <span>No Battery (Grid-Tied)</span>
            )}
          </div>
        </div>

        {packages.length > 0 && (
          <div className="as-pkg-section">
            <p className="as-pkg-section-label">
              Matching packages for your {systemLabel}
            </p>

            <div className="as-pkg-grid">
              {packages.map((pkg, i) => (
                <div
                  key={pkg.id}
                  className={`as-pkg-card${i === 0 ? " is-recommended" : ""}`}
                >
                  {i === 0 && (
                    <span className="as-pkg-badge">Best Match</span>
                  )}

                  <div className="as-pkg-name">{pkg.name}</div>

                  <div className="as-pkg-specs">
                    <div>
                      <span>Solar</span>
                      <strong>{pkg.solarKwp} kWp</strong>
                    </div>
                    <div>
                      <span>Inverter</span>
                      <strong>{pkg.inverterKw} kW</strong>
                    </div>
                    <div>
                      <span>Battery</span>
                      <strong>{pkg.storageKwh} kWh</strong>
                    </div>
                  </div>

                  <div className="as-pkg-phase">{phaseLabel(pkg.phase)} · Hybrid</div>

                  <div className="as-pkg-price">
                    <span>Starting at</span>
                    <strong>{formatPeso(pkg.totalPrice)}</strong>
                  </div>

                  <div className="as-pkg-bill-range">
                    For bills {formatPeso(pkg.monthlyBillRange[0])}–{formatPeso(pkg.monthlyBillRange[1])}/mo
                  </div>
                </div>
              ))}
            </div>

            <p className="as-pkg-disclaimer">
              Prices are indicative and based on standard configurations.
              Final pricing is subject to site survey and specific requirements.
            </p>
          </div>
        )}

        {packages.length === 0 && engineResult && (
          <div className="as-pkg-custom">
            <p>
              Your system requirement (<strong>{systemLabel}</strong>) exceeds our
              standard catalog. Our engineers will design a custom solution for you.
            </p>
          </div>
        )}

        <div className="as-modal-actions">
          <button className="as-btn-primary" onClick={onClose} type="button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
