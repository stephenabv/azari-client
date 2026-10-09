import { useEffect, useId, useRef, type MouseEvent, type SyntheticEvent } from "react";
import { Link } from "react-router";
import type { LegalDocumentDefinition } from "../../config/legalDocuments";
import { useContentResource } from "../../hooks/useContentResource";
import { useScrollLock } from "../../hooks/useScrollLock";
import { DEFAULT_DISCLAIMER, type LegalContent, type LegalDisclaimer } from "../../models/legal";
import { ASLegalBody, ASLegalMeta } from "./ASLegalDocument";
import "../../assets/styles/contents/as_legal_page.less";
import "../../assets/styles/contents/as_legal_modal.less";

/** Matches the close animation in as_legal_modal.less. */
const CLOSE_ANIMATION_MS = 200;

export interface ASLegalModalProps {
  definition: LegalDocumentDefinition;
  isOpen: boolean;
  onClose: () => void;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

/**
 * Reads a legal document over the current page.
 *
 * Built on the native <dialog> opened with showModal(): the browser puts it in
 * the top layer, makes the rest of the page inert (which is the focus trap),
 * gives it dialog semantics, and returns focus to the link on close. Escape
 * arrives as the dialog's `cancel` event and is routed through onClose so the
 * provider's state stays the single source of truth for whether it is open.
 *
 * On phones the dialog fills the screen; from tablet up it is a centred sheet.
 * Only the document body scrolls, so the title and close button stay in reach.
 */
export default function ASLegalModal({ definition, isOpen, onClose }: ASLegalModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const legal = useContentResource<LegalContent>(definition.contentKey, { enabled: isOpen });
  const disclaimerResource = useContentResource<LegalDisclaimer>("legalDisclaimer", { enabled: isOpen });
  const disclaimer = disclaimerResource.data ?? DEFAULT_DISCLAIMER;

  useScrollLock(isOpen);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      delete dialog.dataset.state;
      if (!dialog.open) dialog.showModal();
      // The scroll region takes focus rather than the close button, so arrow
      // keys and Page Down scroll the document straight away and a mouse
      // click on the link doesn't paint a keyboard focus ring on the button.
      scrollRef.current?.scrollTo({ top: 0 });
      scrollRef.current?.focus({ preventScroll: true });
      return;
    }

    if (!dialog.open) return;

    if (prefersReducedMotion()) {
      dialog.close();
      return;
    }

    dialog.dataset.state = "closing";
    const timer = window.setTimeout(() => {
      delete dialog.dataset.state;
      dialog.close();
    }, CLOSE_ANIMATION_MS);

    return () => window.clearTimeout(timer);
  }, [isOpen, definition.id]);

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose();
  };

  // A click on the ::backdrop is reported on the dialog itself, outside its box.
  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target !== dialogRef.current) return;

    const rect = dialogRef.current.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left && event.clientX <= rect.right &&
      event.clientY >= rect.top && event.clientY <= rect.bottom;

    if (!inside) onClose();
  };

  const title = (legal.status === "ready" && legal.data.title) || definition.fallbackTitle;

  return (
    <dialog
      ref={dialogRef}
      className="as-legal-modal"
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <header className="as-legal-modal-header">
        <div className="as-legal-modal-heading">
          <h2 id={titleId} className="as-legal-modal-title">{title}</h2>
          {legal.status === "ready" && (
            <ASLegalMeta effectiveDate={legal.data.effectiveDate} lastUpdated={legal.data.lastUpdated} />
          )}
        </div>

        <button type="button" className="as-legal-modal-close" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <div
        ref={scrollRef}
        className="as-legal-modal-body"
        tabIndex={0}
        role="document"
        aria-busy={legal.status === "loading"}
      >
        {legal.status === "loading" && (
          <div className="as-legal-modal-status" role="status">
            <span className="as-legal-modal-spinner" aria-hidden="true" />
            Loading {definition.fallbackTitle}…
          </div>
        )}

        {legal.status === "error" && (
          <div className="as-legal-modal-status" role="alert">
            We couldn't load the {definition.fallbackTitle} just now.{" "}
            <Link to={definition.path} onClick={onClose}>Open the full page</Link> instead.
          </div>
        )}

        {legal.status === "ready" && <ASLegalBody legal={legal.data} disclaimer={disclaimer} />}
      </div>

      <footer className="as-legal-modal-footer">
        <Link className="as-legal-modal-fullpage" to={definition.path} onClick={onClose}>
          Open full page
        </Link>
        <button type="button" className="as-legal-modal-done" onClick={onClose}>
          Close
        </button>
      </footer>
    </dialog>
  );
}
