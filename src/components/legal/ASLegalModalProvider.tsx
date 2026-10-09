import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { LegalDocumentId } from "../../config/legalDocuments";
import { LegalModalContext, type LegalModalController } from "../../context/legalModal";
import { legalDocuments } from "../../services/ASLegalDocuments";
import ASLegalModal from "./ASLegalModal";

type ModalState = { id: LegalDocumentId | null; isOpen: boolean };

/**
 * Owns the one legal modal on the page and lets any descendant open it.
 *
 * The modal mounts on first use rather than with the page, and stays mounted
 * after closing so its close animation can finish and a reopen is instant.
 */
export default function ASLegalModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ModalState>({ id: null, isOpen: false });

  const open = useCallback((id: LegalDocumentId) => setState({ id, isOpen: true }), []);
  const close = useCallback(() => setState((prev) => ({ ...prev, isOpen: false })), []);

  const controller = useMemo<LegalModalController>(() => ({ open, close }), [open, close]);
  const definition = state.id ? legalDocuments.get(state.id) : null;

  return (
    <LegalModalContext.Provider value={controller}>
      {children}
      {definition && <ASLegalModal definition={definition} isOpen={state.isOpen} onClose={close} />}
    </LegalModalContext.Provider>
  );
}
