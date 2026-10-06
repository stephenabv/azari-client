# Content-Security-Policy

Every HTML response carries two policies:

| Header | Mode | Scripts allowed |
|---|---|---|
| `Content-Security-Policy` | Enforced | `'self'`, `'unsafe-inline'`, Google Analytics hosts (as before) |
| `Content-Security-Policy-Report-Only` | Reported, not blocked | Only scripts with this response's nonce, plus what they load (`'strict-dynamic'`) |

All other directives are identical in both. The Report-Only policy is the
target: once it reports nothing for real traffic, it replaces the enforced one
and inline script injection (XSS) stops working.

## Where it comes from

- **Policy:** `app/lib/security/site-policy.ts`. `SitePolicy` holds the shared
  directives; `EnforcedSitePolicy` and `ReportOnlySitePolicy` differ only in
  `script-src`. `ContentSecurityPolicy` rejects any source containing
  whitespace, `;` or `,`, so nothing can inject into the header.
- **Server-rendered pages:** `app/entry.server.tsx` creates a 128-bit nonce per
  response (`RandomNonceSource`), sets both headers and passes the nonce to
  React (`<ServerRouter nonce>`, `renderToPipeableStream({ nonce })`) and to
  `root.tsx` through `CspNonceContext`. Every `<script>`, module preload and
  the inline theme script gets it.
- **Prerendered pages** (`/solar-calculator`, `/privacy-policy`,
  `/terms-and-conditions`): nginx serves these from disk, so the build writes
  the placeholder `__AZARI_CSP_NONCE__` (`PrerenderNonceSource`). nginx swaps
  it for `$request_id` with `sub_filter` and sends the same value in the
  header. The header values live in a generated block in `nginx.conf`.
- **JSON-LD** blocks need no nonce: CSP does not apply to data blocks.

Before this change prerendered pages had no CSP at all, and YouTube embeds and
the address search (`nominatim.openstreetmap.org`) were blocked by the enforced
policy. Both are fixed in the shared directives.

## Changing the policy

1. Edit `app/lib/security/site-policy.ts`.
2. Run `npm run csp:nginx` to regenerate the nginx block.
3. Run `npm run build && npm run audit:csp`. It fails if `nginx.conf` is out of
   date or a prerendered page has a script without the placeholder nonce.

## Seeing violations

Without a reporting endpoint, violations appear only in the browser console
(`[Report Only] Refused to execute …`). To collect them from real visitors:

1. Pick a collector (for example a report-uri.com account, or an endpoint of
   your own). TODO(owner): choose one if you want reports from real traffic.
2. Set `CSP_REPORT_URI=https://…` in the `env` of `ecosystem.config.cjs` on the
   VM and run `pm2 reload ecosystem.config.cjs --update-env`. Only an `https`
   URL without credentials is accepted; anything else is logged and ignored.
3. Server-rendered pages then send `report-uri`, `report-to` and a
   `Reporting-Endpoints` header. Prerendered pages report to the console only.

## Switching to enforcing

Do this after at least a week of real traffic with no unexplained reports,
including a visit that loads Firebase Analytics (it loads after the first
interaction).

1. In `sitePoliciesFor()` (`site-policy.ts`), return only the strict policy and
   make it the enforced one: change `ReportOnlySitePolicy.headerName` to
   `"Content-Security-Policy"` (or rename the class to `StrictSitePolicy`) and
   drop `EnforcedSitePolicy`.
2. Update `scripts/audit-csp.ts` so it generates a single
   `$azari_csp` map from the strict policy, and remove the
   `Content-Security-Policy-Report-Only` `add_header` in `nginx.conf`.
3. `npm run csp:nginx && npm run build && npm run audit:csp`, then load every
   page with the browser console open: a violation now blocks the script.
4. Deploy. To roll back, revert the commit; nginx and the SSR server pick up
   the old policy on the next deploy.

## Caching

A nonce is only secret if every response gets a fresh one:

- nginx's `sub_filter` drops `ETag` and `Last-Modified` on prerendered pages,
  so browsers fetch them again rather than reuse a copy with an old nonce.
- Do not cache HTML at a CDN edge (see `docs/cloudflare.md`) while nonces are
  enforced. A cached page shares one nonce among every visitor, which an
  attacker can read and reuse. Cache static assets only, or bypass the edge
  cache for HTML.
