import {
  ContentSecurityPolicy,
  type CspHeaderName,
  type CspNonce,
} from "./content-security-policy.ts";

/**
 * The site's Content-Security-Policy, in two variants that share every
 * directive except script-src:
 *
 * - {@link EnforcedSitePolicy}: what browsers enforce today. Inline scripts
 *   are allowed by 'unsafe-inline', as before this policy had nonces.
 * - {@link ReportOnlySitePolicy}: the strict target. Scripts run only with
 *   this response's nonce ('strict-dynamic' extends trust to scripts those
 *   load, e.g. Firebase's gtag.js). Browsers report violations without
 *   blocking anything.
 *
 * docs/content-security-policy.md explains how to move from one to the other.
 */
export abstract class SitePolicy {
  /** Google Analytics / Firebase Analytics, loaded after first interaction. */
  protected static readonly ANALYTICS_SCRIPT_HOSTS = [
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://*.googleapis.com",
    "https://*.gstatic.com",
  ] as const;

  abstract readonly headerName: CspHeaderName;

  protected abstract scriptSources(): readonly string[];

  /** The full policy for one response. */
  build(): ContentSecurityPolicy {
    return ContentSecurityPolicy.empty()
      .with("default-src", "'self'")
      .with("script-src", ...this.scriptSources())
      // React writes `style` attributes, which only 'unsafe-inline' allows.
      .with("style-src", "'self'", "'unsafe-inline'")
      .with("img-src", "'self'", "data:", "blob:", "https:")
      .with("font-src", "'self'", "data:")
      .with(
        "connect-src",
        "'self'",
        "https://*.googleapis.com",
        "https://*.google-analytics.com",
        "https://*.googletagmanager.com",
        "https://firebaselogging.googleapis.com",
        // Address search in the quotation form and the admin console.
        "https://nominatim.openstreetmap.org",
      )
      .with("media-src", "'self'", "https:")
      // Project and client-story videos play in a YouTube embed.
      .with("frame-src", "https://www.youtube.com", "https://www.youtube-nocookie.com")
      .with("frame-ancestors", "'none'")
      .with("object-src", "'none'")
      .with("base-uri", "'self'")
      .with("form-action", "'self'");
  }

  /** Sets this policy's header on `headers`. */
  applyTo(headers: Headers): void {
    headers.set(this.headerName, this.build().toString());
  }
}

export class EnforcedSitePolicy extends SitePolicy {
  readonly headerName = "Content-Security-Policy";

  protected scriptSources(): readonly string[] {
    return ["'self'", "'unsafe-inline'", ...SitePolicy.ANALYTICS_SCRIPT_HOSTS];
  }
}

/** Where browsers send violation reports (Reporting API and the legacy form). */
export class CspReportEndpoint {
  /** The Reporting-Endpoints group name used by `report-to`. */
  static readonly GROUP = "csp";

  readonly url: string;

  private constructor(url: string) {
    this.url = url;
  }

  /**
   * Parses the configured endpoint. Only an absolute https URL with no
   * credentials is accepted; anything else is rejected rather than echoed
   * into a response header.
   */
  static parse(raw: string | undefined): CspReportEndpoint | undefined {
    if (!raw) return undefined;
    let url: URL;
    try {
      url = new URL(raw);
    } catch {
      throw new Error("CSP report endpoint is not a valid URL");
    }
    if (url.protocol !== "https:" || url.username || url.password) {
      throw new Error("CSP report endpoint must be an https URL without credentials");
    }
    const href = url.href;
    if (/[\s;,"]/.test(href)) {
      throw new Error("CSP report endpoint contains characters a header cannot carry");
    }
    return new CspReportEndpoint(href);
  }

  /** Sets the Reporting-Endpoints header that `report-to` refers to. */
  applyTo(headers: Headers): void {
    headers.set("Reporting-Endpoints", `${CspReportEndpoint.GROUP}="${this.url}"`);
  }
}

export class ReportOnlySitePolicy extends SitePolicy {
  readonly headerName = "Content-Security-Policy-Report-Only";

  private readonly nonce: CspNonce;
  private readonly reportEndpoint: CspReportEndpoint | undefined;

  constructor(nonce: CspNonce, reportEndpoint?: CspReportEndpoint) {
    super();
    this.nonce = nonce;
    this.reportEndpoint = reportEndpoint;
  }

  protected scriptSources(): readonly string[] {
    // With a nonce and 'strict-dynamic', CSP3 browsers ignore 'self' and the
    // host list; they remain as the fallback for CSP2-only browsers.
    return [
      this.nonce.source,
      "'strict-dynamic'",
      "'self'",
      ...SitePolicy.ANALYTICS_SCRIPT_HOSTS,
    ];
  }

  override build(): ContentSecurityPolicy {
    const policy = super.build();
    return this.reportEndpoint
      ? policy
          .with("report-uri", this.reportEndpoint.url)
          .with("report-to", CspReportEndpoint.GROUP)
      : policy;
  }

  override applyTo(headers: Headers): void {
    super.applyTo(headers);
    this.reportEndpoint?.applyTo(headers);
  }
}

/** Both policies for one HTML response, enforced first. */
export function sitePoliciesFor(
  nonce: CspNonce,
  reportEndpoint?: CspReportEndpoint,
): readonly SitePolicy[] {
  return [new EnforcedSitePolicy(), new ReportOnlySitePolicy(nonce, reportEndpoint)];
}
