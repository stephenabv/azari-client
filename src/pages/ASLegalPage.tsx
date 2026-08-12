import { Fragment } from "react";
import { useContent } from "../hooks/useContent";
import type { ContentKey } from "../services/ASContent";

type LegalSection = { heading: string; body: string };

type LegalContent = {
  title: string;
  effectiveDate: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

type LegalDisclaimer = { enabled: boolean; text: string };

const EMPTY_LEGAL: LegalContent = {
  title: "",
  effectiveDate: "",
  lastUpdated: "",
  intro: "",
  sections: [],
};

const DEFAULT_DISCLAIMER: LegalDisclaimer = { enabled: false, text: "" };

function renderBody(body: string) {
  const blocks = body.split(/\n\s*\n/);

  return blocks.map((block, i) => {
    const lines = block.split("\n").filter((l) => l.trim().length > 0);
    const isBulletBlock = lines.length > 0 && lines.every((l) => l.trim().startsWith("- "));

    if (isBulletBlock) {
      return (
        <ul className="as-legal-list" key={i}>
          {lines.map((l, j) => (
            <li key={j}>{l.trim().replace(/^-\s*/, "")}</li>
          ))}
        </ul>
      );
    }

    return (
      <p className="as-legal-paragraph" key={i}>
        {lines.map((l, j) => (
          <Fragment key={j}>
            {j > 0 && <br />}
            {l}
          </Fragment>
        ))}
      </p>
    );
  });
}

export default function ASLegalPage({ contentKey }: { contentKey: ContentKey }) {
  const legal = useContent<LegalContent>(contentKey, EMPTY_LEGAL);
  const disclaimer = useContent<LegalDisclaimer>("legalDisclaimer", DEFAULT_DISCLAIMER);

  return (
    <div className="as-legal-page">
      <div className="as-legal-header">
        <h1 className="as-legal-title">{legal.title || " "}</h1>
        {(legal.effectiveDate || legal.lastUpdated) && (
          <div className="as-legal-meta">
            {legal.effectiveDate && <span>Effective Date: {legal.effectiveDate}</span>}
            {legal.effectiveDate && legal.lastUpdated && <span className="as-legal-meta-dot">•</span>}
            {legal.lastUpdated && <span>Last Updated: {legal.lastUpdated}</span>}
          </div>
        )}
      </div>

      {disclaimer.enabled && disclaimer.text && (
        <div className="as-legal-disclaimer" role="note">
          <span className="as-legal-disclaimer-icon" aria-hidden="true">!</span>
          <p>{disclaimer.text}</p>
        </div>
      )}

      {legal.intro && <div className="as-legal-intro">{renderBody(legal.intro)}</div>}

      <div className="as-legal-sections">
        {legal.sections.map((section, i) => (
          <section className="as-legal-section" key={i}>
            <h2 className="as-legal-heading">{section.heading}</h2>
            {renderBody(section.body)}
          </section>
        ))}
      </div>
    </div>
  );
}
