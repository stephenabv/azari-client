import { Link } from "react-router";
import { useLocalizedPath, useT } from "../i18n";

import "../assets/styles/contents/as_not_found.less";

export default function ASNotFound() {
  const t = useT();
  const localize = useLocalizedPath();

  return (
    <section className="as-not-found">
      <div className="as-not-found-card">
        <div className="as-not-found-visual" aria-hidden="true">
          <div className="as-not-found-sun">
            <span />
          </div>

          <div className="as-not-found-orbit as-not-found-orbit-one" />
          <div className="as-not-found-orbit as-not-found-orbit-two" />

          <div className="as-not-found-energy-path">
            <span className="as-not-found-energy-dot" />
          </div>

          <div className="as-not-found-panel-array">
            <i />
            <i />
            <i />
            <i />
          </div>

          <div className="as-not-found-storage-unit">
            <span className="as-not-found-storage-cap" />
            <span className="as-not-found-storage-level" />
          </div>

          <div className="as-not-found-home-link">
            <span className="as-not-found-home-roof" />
            <span className="as-not-found-home-body" />
            <span className="as-not-found-home-window" />
          </div>
        </div>

        <p className="as-not-found-eyebrow">404</p>
        <h1>{t("notFound.title")}</h1>
        <p>{t("notFound.body")}</p>

        <div className="as-not-found-actions">
          <Link to={localize("/")}>{t("common.backHome")}</Link>
          <Link to={localize("/projects")} className="secondary">{t("common.viewProjects")}</Link>
        </div>
      </div>
    </section>
  );
}
