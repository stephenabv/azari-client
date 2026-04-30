import "./as_system_error.less";

type ASSystemErrorProps = {
  onClose: () => void;
};

export default function ASSystemError({ onClose }: ASSystemErrorProps) {
  return (
    <div className="as-system-error-overlay">
      <div className="as-system-error-modal" role="dialog" aria-modal="true">
        <div className="as-system-error-icon">!</div>

        <h2>Something went wrong</h2>

        <p>
          We couldn’t process your request at the moment. Please check again later, if the error persist please contact us.
        </p>

        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}