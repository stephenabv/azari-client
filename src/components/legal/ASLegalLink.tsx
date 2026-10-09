import type { MouseEvent, ReactNode } from "react";
import { useLegalModal } from "../../context/legalModal";
import { legalDocuments } from "../../services/ASLegalDocuments";

export interface ASLegalLinkProps {
  href: string | undefined;
  children: ReactNode;
  className?: string;
}

/** A click the browser would handle itself: new tab, new window, download. */
function isModifiedClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

/**
 * Link to a legal document that opens it in the legal modal.
 *
 * It stays a real link to the standalone page, so crawlers, middle-click,
 * "open in new tab" and visitors without JavaScript still reach the document;
 * only a plain click is turned into the modal. A URL that is not one of this
 * site's legal documents (an external policy set in the CMS) keeps the old
 * behaviour and opens in a new tab.
 */
export default function ASLegalLink({ href, children, className }: ASLegalLinkProps) {
  const modal = useLegalModal();
  const definition = legalDocuments.resolve(href);

  if (!definition) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!modal || event.defaultPrevented || isModifiedClick(event)) return;

    event.preventDefault();
    modal.open(definition.id);
  };

  return (
    <a
      href={definition.path}
      className={className}
      onClick={handleClick}
      aria-haspopup={modal ? "dialog" : undefined}
    >
      {children}
    </a>
  );
}
