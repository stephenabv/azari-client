import { createContext, useContext } from "react";

/**
 * The current response's CSP nonce, provided by the SSR entry.
 *
 * In the browser the value is "": once a page with a CSP header has loaded,
 * browsers hide nonces and report the attribute as empty, so rendering ""
 * during hydration matches the DOM. The nonce is only needed on the server.
 */
export const CspNonceContext = createContext<string>("");

export function useCspNonce(): string {
  return useContext(CspNonceContext);
}
