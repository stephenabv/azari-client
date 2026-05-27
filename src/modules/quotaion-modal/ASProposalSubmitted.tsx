import type { EngineResult } from "../../models/calculation";

type ProposalSubmittedModalProps = {
  onClose: () => void;
  engineResult: EngineResult | null;
};

export default function ProposalSubmittedModal({
  onClose,
  engineResult,
}: ProposalSubmittedModalProps) {
  const systemLabel = engineResult?.systemType === "grid-tied" ? "Grid-Tied" : "Hybrid";

  const systemSummary = engineResult
    ? `~${engineResult.solarKwp.toFixed(2)} kWp ${systemLabel}`
    : "Custom Solar System";

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="as-modal-backdrop">
      <div className="as-modal as-success-modal">
        <div className="as-success-icon">✓</div>

        <h2>Request Submitted</h2>

        <p>
          Thank you! Our renewable energy advisor will review your system
          profile and contact you shortly with a detailed solar proposal.
        </p>

        <div className="as-success-summary">
          <strong>{systemSummary}</strong>
          <span>Recommended system package</span>
          {engineResult && engineResult.inverterKw > 0 && (
            <span>{engineResult.inverterKw} kW Inverter</span>
          )}
          {engineResult && engineResult.storageKwh > 0 && (
            <span>{engineResult.storageKwh} kWh Battery Storage</span>
          )}
          <span>5-year performance warranty</span>
        </div>

        <div className="as-modal-actions">
          <button className="as-btn-secondary" onClick={onClose} type="button">
            Close
          </button>
          <button className="as-btn-primary" onClick={handleDownload} type="button">
            Download Quotation
          </button>
        </div>
      </div>
    </div>
  );
}
