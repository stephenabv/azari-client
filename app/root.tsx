import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";
import type { HeadersFunction, LinksFunction } from "react-router";

import { BUSINESS } from "../src/config/business";
import { siteSchemaGraph } from "./lib/schema/site-schemas";
import { useCspNonce } from "./lib/security/nonce-context";

import "../src/index.css";
import "../src/assets/styles/main.less";

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon.png" },
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg", sizes: "any" },
  { rel: "icon", href: "/favicon.ico", sizes: "any" },
  { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
  { rel: "manifest", href: "/site.webmanifest" },
  // Resolve DNS for Firebase Analytics before it lazily initialises
  { rel: "dns-prefetch", href: "//www.google-analytics.com" },
  { rel: "dns-prefetch", href: "//www.googletagmanager.com" },
  { rel: "dns-prefetch", href: "//firebaselogging.googleapis.com" },
  // Only the latin subsets used above the fold. The latin-ext files still
  // load on demand (unicode-range) if a page needs them.
  { rel: "preload", href: "/fonts/inter-normal-latin.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "preload", href: "/fonts/outfit-normal-latin.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
];

// nginx already sets X-Content-Type-Options, X-Frame-Options, Referrer-Policy,
// Permissions-Policy, COOP, and HSTS for all responses from this server.
// The headers below are NOT covered by nginx and must be set here.
export const headers: HeadersFunction = () => ({
  // Server-rendered HTML: browsers revalidate on every visit. No shared-cache
  // TTL (s-maxage) here, because this also covers 404/503 documents; an edge
  // cache in front of the origin sets its own HTML TTL (see docs/cloudflare.md).
  'Cache-Control': 'public, max-age=0, must-revalidate',
  // Legacy XSS filter hint — checked by security scanners; ignored by modern
  // browsers that honour CSP instead.
  'X-XSS-Protection': '1; mode=block',
  // Content-Security-Policy (enforced and Report-Only) is set per response in
  // entry.server.tsx, because the Report-Only policy carries that response's
  // nonce. See app/lib/security/site-policy.ts.
});

// Applied before React hydration to prevent a dark/light flash
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark-theme':'light-theme');document.body.classList.add(t);}catch(e){}})();`;


const SITE_JSONLD = siteSchemaGraph().toInlineJson();

const { address: BUSINESS_ADDRESS, geo: BUSINESS_GEO } = BUSINESS;

export function Layout({ children }: { children: React.ReactNode }) {
  const nonce = useCspNonce();
  return (
    <html lang="en-PH">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Geo / local signals */}
        <meta name="geo.region" content={BUSINESS_ADDRESS.regionCode} />
        <meta
          name="geo.placename"
          content={`${BUSINESS_ADDRESS.locality}, ${BUSINESS_ADDRESS.region}, Philippines`}
        />
        <meta name="geo.position" content={`${BUSINESS_GEO.latitude};${BUSINESS_GEO.longitude}`} />
        <meta name="ICBM" content={`${BUSINESS_GEO.latitude}, ${BUSINESS_GEO.longitude}`} />
        <meta name="theme-color" content="#0f172a" />
        <meta name="author" content={BUSINESS.name} />
        <meta
          name="google-site-verification"
          content="WAIKncjPdupwkR3Gq8LFWOko2B_5dwlGkjAM0xVBbzs"
        />
        <meta
          name="google-site-verification"
          content="c1kBhgFmKOOWKG7D8H0IUfttihFyXZIbAeHP8CNcFWE"
        />
        <Meta />
        <Links nonce={nonce} />
        {/* Site-wide structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: SITE_JSONLD }}
        />
      </head>
      <body suppressHydrationWarning>
        {/* Anti-flash: applies the saved theme class before first paint. It has
            to run inside <body>; in <head>, document.body does not exist yet. */}
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const nonce = useCspNonce();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <html lang="en-PH">
        <head>
          <title>Page Not Found — Azari Solar</title>
          <meta name="robots" content="noindex" />
          <Meta />
          <Links nonce={nonce} />
        </head>
        <body>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              fontFamily: "sans-serif",
              textAlign: "center",
              padding: "2rem",
            }}
          >
            <h1>404 — Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <a href="/">Return to Home</a>
          </div>
          <Scripts nonce={nonce} />
        </body>
      </html>
    );
  }

  return (
    <html lang="en-PH">
      <head>
        <title>Error — Azari Solar</title>
        <Meta />
        <Links nonce={nonce} />
      </head>
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontFamily: "sans-serif",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <h1>Something went wrong</h1>
          <p>Please try again later.</p>
          <a href="/">Return to Home</a>
        </div>
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}
