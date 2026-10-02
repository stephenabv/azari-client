import { useEffect, useMemo, useState } from "react";
import { splitAtSlot, useSecondsLabel } from "../hooks/useSecondsLabel";
import { useLocalizedNavigate, useT } from "../i18n";

export default function ASComingSoon() {
  const navigate = useLocalizedNavigate();
  const t = useT();
  const seconds = useSecondsLabel();
  const redirectSeconds = 10;
  const [countdown, setCountdown] = useState(redirectSeconds);

  const progress = useMemo(() => {
    return ((redirectSeconds - countdown) / redirectSeconds) * 100;
  }, [countdown]);

  const goHome = () => navigate("/");
  const [redirectBefore, redirectAfter] = splitAtSlot(t("system.comingSoon.redirect"), "time");

  useEffect(() => {
    if (countdown <= 0) {
      navigate("/");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <section className="as-coming-soon">
      <div className="as-coming-soon-bg">
        <span />
        <span />
        <span />
      </div>

      <div className="as-coming-soon-card">
        <div className="as-coming-soon-visual" aria-hidden="true">
          <div className="as-sun-core">
            <span />
          </div>

          <div className="as-energy-ring as-energy-ring-one" />
          <div className="as-energy-ring as-energy-ring-two" />

          <div className="as-solar-panel-grid">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>

          <div className="as-battery-card">
            <span className="as-battery-head" />
            <span className="as-battery-level" />
          </div>

          <div className="as-energy-line as-energy-line-one" />
          <div className="as-energy-line as-energy-line-two" />
        </div>

        <p className="as-coming-soon-eyebrow">Azari Solar</p>

        <h1 className="as-coming-soon-title">{t("system.comingSoon.title")}</h1>

        <p className="as-coming-soon-text">
          {t("system.comingSoon.body")}{" "}
          {redirectBefore}
          <strong>{seconds.count(countdown)}</strong>
          {redirectAfter}
        </p>

        <div className="as-countdown-progress">
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className="as-coming-soon-actions">
          <button type="button" className="as-coming-soon-button" onClick={goHome}>
            {t("system.comingSoon.backHome")}
          </button>
        </div>
      </div>
    </section>
  );
}
