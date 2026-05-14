import "./as_system_error.less";

type ASSystemErrorProps = {
  onClose: () => void;
};

export default function ASSystemError({ onClose }: ASSystemErrorProps) {
  return (
    <div className="as-system-error-overlay">
      <div className="as-system-error-modal" role="dialog" aria-modal="true">
        <div className="as-system-error-icon">!</div>

        <p className="as-system-error-eyebrow">Request failed</p>

        <h2>Something went wrong</h2>

        <p>
          We couldn’t process your request right now. Please try again in a moment.
        </p>

        <div className="as-system-error-notes">
          <span>Check your connection</span>
          <span>Verify the form data</span>
          <span>Try submitting again</span>
        </div>

        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}