import { createContext, useContext } from "react";
import type { LegalDocumentId } from "../config/legalDocuments";

export interface LegalModalController {
  open(id: LegalDocumentId): void;
  close(): void;
}

/**
 * Null outside ASLegalModalProvider, so links rendered elsewhere (the admin
 * console, an error page) fall back to plain navigation instead of failing.
 */
export const LegalModalContext = createContext<LegalModalController | null>(null);

export function useLegalModal(): LegalModalController | null {
  return useContext(LegalModalContext);
}
