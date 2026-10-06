/**
 * A small, immutable Content-Security-Policy model.
 *
 * Policies are built from validated parts, so nothing that reaches the header
 * can contain a directive separator, a list separator or a line break. This
 * module has no runtime dependencies: the SSR entry, the root route and the
 * nginx drift check (scripts/audit-csp.ts, run directly by Node) all share it.
 */

/** The directives this site uses (CSP Level 3). */
export type CspDirective =
  | "default-src"
  | "script-src"
  | "style-src"
  | "img-src"
  | "font-src"
  | "connect-src"
  | "media-src"
  | "frame-src"
  | "frame-ancestors"
  | "object-src"
  | "base-uri"
  | "form-action"
  | "report-uri"
  | "report-to";

export type CspHeaderName =
  | "Content-Security-Policy"
  | "Content-Security-Policy-Report-Only";

/**
 * A per-response script nonce. 128 bits from a CSPRNG is the recommended
 * minimum; the pattern is base64 / base64url, which is what CSP accepts.
 */
export class CspNonce {
  private static readonly PATTERN = /^[A-Za-z0-9+/_-]{16,}={0,2}$/;

  readonly value: string;

  constructor(value: string) {
    if (!CspNonce.PATTERN.test(value)) {
      throw new Error("CspNonce: value must be at least 16 base64 characters");
    }
    this.value = value;
    Object.freeze(this);
  }

  /** The source expression for script-src, e.g. `'nonce-abc…'`. */
  get source(): string {
    return `'nonce-${this.value}'`;
  }
}

export class ContentSecurityPolicy {
  /** One source expression or token: no whitespace, `;` or `,`. */
  private static readonly SOURCE = /^[^\s;,]+$/;

  private readonly directives: ReadonlyMap<CspDirective, readonly string[]>;

  private constructor(directives: ReadonlyMap<CspDirective, readonly string[]>) {
    this.directives = directives;
  }

  static empty(): ContentSecurityPolicy {
    return new ContentSecurityPolicy(new Map());
  }

  /** A copy with `sources` appended to `directive` (duplicates dropped). */
  with(directive: CspDirective, ...sources: readonly string[]): ContentSecurityPolicy {
    for (const source of sources) {
      if (!ContentSecurityPolicy.SOURCE.test(source)) {
        throw new Error(`ContentSecurityPolicy: invalid source "${source}" for ${directive}`);
      }
    }
    const next = new Map(this.directives);
    const current = next.get(directive) ?? [];
    next.set(directive, [...current, ...sources.filter((s) => !current.includes(s))]);
    return new ContentSecurityPolicy(next);
  }

  /** The header value, directives in insertion order. */
  toString(): string {
    return [...this.directives]
      .map(([directive, sources]) => [directive, ...sources].join(" "))
      .join("; ");
  }
}
