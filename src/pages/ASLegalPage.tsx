import { useContent } from "../hooks/useContent";
import type { ContentKey } from "../services/ASContent";
import { ASLegalBody, ASLegalMeta } from "../components/legal/ASLegalDocument";
import {
  DEFAULT_DISCLAIMER,
  EMPTY_LEGAL,
  type LegalContent,
  type LegalDisclaimer,
} from "../models/legal";

export default function ASLegalPage({ contentKey }: { contentKey: ContentKey }) {
  const legal = useContent<LegalContent>(contentKey, EMPTY_LEGAL);
  const disclaimer = useContent<LegalDisclaimer>("legalDisclaimer", DEFAULT_DISCLAIMER);

  return (
    <div className="as-legal-page">
      <div className="as-legal-header">
        <h1 className="as-legal-title">{legal.title || " "}</h1>
        <ASLegalMeta effectiveDate={legal.effectiveDate} lastUpdated={legal.lastUpdated} />
      </div>

      <ASLegalBody legal={legal} disclaimer={disclaimer} />
    </div>
  );
}
