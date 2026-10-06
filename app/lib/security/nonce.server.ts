import { randomBytes } from "node:crypto";

import { CspNonce } from "./content-security-policy.ts";

/** Where a response's script nonce comes from. */
export interface NonceSource {
  next(): CspNonce;
}

/** A fresh 128-bit nonce from the CSPRNG for every server-rendered response. */
export class RandomNonceSource implements NonceSource {
  next(): CspNonce {
    return new CspNonce(randomBytes(16).toString("base64"));
  }
}

/**
 * Prerendered pages are written to disk once at build time, so they cannot
 * carry a real nonce. They get this fixed placeholder instead, and nginx
 * swaps it for the request id on every response (sub_filter), using the same
 * value in that response's policy header. See nginx.conf.
 */
export class PrerenderNonceSource implements NonceSource {
  static readonly PLACEHOLDER = "__AZARI_CSP_NONCE__";

  next(): CspNonce {
    return new CspNonce(PrerenderNonceSource.PLACEHOLDER);
  }
}

/**
 * React Router sets IS_RR_BUILD_REQUEST while it prerenders at build time;
 * every other render is a live request.
 */
export function nonceSourceFor(env: NodeJS.ProcessEnv = process.env): NonceSource {
  return env.IS_RR_BUILD_REQUEST === "yes"
    ? new PrerenderNonceSource()
    : new RandomNonceSource();
}
