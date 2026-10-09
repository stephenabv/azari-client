import { Fragment } from "react";
import type { LegalContent, LegalDisclaimer } from "../../models/legal";

/**
 * Renders the CMS's plain-text body format: blank lines separate blocks, and a
 * block whose every line starts with "- " is a bullet list. Text is rendered
 * as React children, never as HTML, so CMS content cannot inject markup.
 */
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

export interface ASLegalMetaProps {
  effectiveDate: string;
  lastUpdated: string;
}

export function ASLegalMeta({ effectiveDate, lastUpdated }: ASLegalMetaProps) {
  if (!effectiveDate && !lastUpdated) return null;

  return (
    <div className="as-legal-meta">
      {effectiveDate && <span>Effective Date: {effectiveDate}</span>}
      {effectiveDate && lastUpdated && <span className="as-legal-meta-dot">•</span>}
      {lastUpdated && <span>Last Updated: {lastUpdated}</span>}
    </div>
  );
}

export interface ASLegalBodyProps {
  legal: LegalContent;
  disclaimer: LegalDisclaimer;
}

/**
 * The document below its title: disclaimer, intro and sections. Shared by the
 * standalone legal pages and the legal modal so both read identically.
 */
export function ASLegalBody({ legal, disclaimer }: ASLegalBodyProps) {
  return (
    <>
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
    </>
  );
}
