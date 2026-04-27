type ProposalSubmittedModalProps = {
  onClose: () => void;
};

export default function ProposalSubmittedModal({
  onClose,
}: ProposalSubmittedModalProps) {
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
          <strong>Family 3.2MWp Hybrid</strong>
          <span>Estimated system package</span>
          <span>Expected annual savings</span>
          <span>5-year performance warranty</span>
        </div>

        <div className="as-modal-actions">
          <button className="as-btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="as-btn-primary" onClick={onClose}>
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
}