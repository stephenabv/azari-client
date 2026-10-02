import type { EngineResult } from "../../models/calculation";
import { findMatchingPackages, type SolarPackage } from "../../models/packages";
import { useLocale, useT } from "../../i18n";

type ProposalSubmittedModalProps = {
  onClose: () => void;
  engineResult: EngineResult | null;
  propertyType: string;
  catalog: SolarPackage[];
};

function formatPeso(value: number, numberFormat: string) {
  return `₱${value.toLocaleString(numberFormat)}`;
}

export default function ProposalSubmittedModal({
  onClose,
  engineResult,
  propertyType,
  catalog,
}: ProposalSubmittedModalProps) {
  const t = useT();
  const { numberFormat } = useLocale();
  const peso = (value: number) => formatPeso(value, numberFormat);

  // propertyType is the English classification value ("Residential", ...), not a display label.
  const preferredPhase =
    propertyType === "Residential" ? "single" : "three";

  const packages = engineResult
    ? findMatchingPackages(engineResult, preferredPhase, catalog)
    : [];

  const systemLabel = engineResult
    ? t("quotation.submitted.systemLabel", {
        size: engineResult.solarKwp.toFixed(2),
        type: t(
          engineResult.systemType === "grid-tied"
            ? "quotation.submitted.gridTied"
            : "quotation.submitted.hybrid"
        ),
      })
    : t("quotation.submitted.customSystem");

  // Render the system label in bold inside the translated sentence.
  const [customBefore, customAfter = ""] = t("quotation.submitted.custom").split("{system}");

  return (
    <div className="as-modal-backdrop">
      <div className="as-modal as-submitted-modal">
        <div className="as-success-icon">✓</div>

        <h2>{t("quotation.submitted.title")}</h2>

        <p>{t("quotation.submitted.body")}</p>

        <div className="as-submitted-requirement">
          <span>{t("quotation.submitted.requirement")}</span>
          <div className="as-submitted-req-specs">
            <span>
              {t("quotation.submitted.solarSpec", { value: engineResult?.solarKwp.toFixed(2) ?? "—" })}
            </span>
            <span>
              {t("quotation.submitted.inverterSpec", { value: engineResult?.inverterKw ?? "—" })}
            </span>
            {engineResult && engineResult.storageKwh > 0 && (
              <span>{t("quotation.submitted.batterySpec", { value: engineResult.storageKwh })}</span>
            )}
            {engineResult && engineResult.storageKwh === 0 && (
              <span>{t("quotation.submitted.noBattery")}</span>
            )}
          </div>
        </div>

        {packages.length > 0 && (
          <div className="as-pkg-section">
            <p className="as-pkg-section-label">
              {t("quotation.submitted.matching", { system: systemLabel })}
            </p>

            <div className="as-pkg-grid">
              {packages.map((pkg, i) => (
                <div
                  key={pkg.id}
                  className={`as-pkg-card${i === 0 ? " is-recommended" : ""}`}
                >
                  {i === 0 && (
                    <span className="as-pkg-badge">{t("quotation.submitted.bestMatch")}</span>
                  )}

                  <div className="as-pkg-name">{pkg.name}</div>

                  <div className="as-pkg-specs">
                    <div>
                      <span>{t("quotation.submitted.solar")}</span>
                      <strong>{pkg.solarKwp} kWp</strong>
                    </div>
                    <div>
                      <span>{t("quotation.submitted.inverter")}</span>
                      <strong>{pkg.inverterKw} kW</strong>
                    </div>
                    <div>
                      <span>{t("quotation.submitted.battery")}</span>
                      <strong>{pkg.storageKwh} kWh</strong>
                    </div>
                  </div>

                  <div className="as-pkg-phase">
                    {t("quotation.submitted.phaseHybrid", {
                      phase: t(
                        pkg.phase === "single"
                          ? "quotation.submitted.singlePhase"
                          : "quotation.submitted.threePhase"
                      ),
                    })}
                  </div>

                  <div className="as-pkg-price">
                    <span>{t("quotation.submitted.startingAt")}</span>
                    <strong>{peso(pkg.totalPrice)}</strong>
                  </div>

                  <div className="as-pkg-bill-range">
                    {t("quotation.submitted.billRange", {
                      min: peso(pkg.monthlyBillRange[0]),
                      max: peso(pkg.monthlyBillRange[1]),
                    })}
                  </div>
                </div>
              ))}
            </div>

            <p className="as-pkg-disclaimer">{t("quotation.submitted.disclaimer")}</p>
          </div>
        )}

        {packages.length === 0 && engineResult && (
          <div className="as-pkg-custom">
            <p>
              {customBefore}
              <strong>{systemLabel}</strong>
              {customAfter}
            </p>
          </div>
        )}

        <div className="as-modal-actions">
          <button className="as-btn-primary" onClick={onClose} type="button">
            {t("quotation.common.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
