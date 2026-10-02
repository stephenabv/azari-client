import { useT } from "../../i18n";
import "./as_system_error.less";

type ASSystemErrorProps = {
  onClose: () => void;
};

export default function ASSystemError({ onClose }: ASSystemErrorProps) {
  const t = useT();

  return (
    <div className="as-system-error-overlay">
      <div
        className="as-system-error-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="as-system-error-title"
      >
        <div className="as-system-error-icon" aria-hidden="true">!</div>

        <p className="as-system-error-eyebrow">{t("system.systemError.eyebrow")}</p>

        <h2 id="as-system-error-title">{t("system.systemError.title")}</h2>

        <p>{t("system.systemError.message")}</p>

        <div className="as-system-error-notes">
          <span>{t("system.systemError.checkConnection")}</span>
          <span>{t("system.systemError.verifyForm")}</span>
          <span>{t("system.systemError.trySubmitting")}</span>
        </div>

        <button type="button" onClick={onClose}>
          {t("system.systemError.close")}
        </button>
      </div>
    </div>
  );
}
