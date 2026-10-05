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
import { SiteSchemaBuilder } from "./lib/business-schema";

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
  { rel: "preload", href: "/fonts/inter-normal-latin-ext.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "preload", href: "/fonts/inter-normal-latin.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "preload", href: "/fonts/outfit-normal-latin-ext.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "preload", href: "/fonts/outfit-normal-latin.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
];

// nginx already sets X-Content-Type-Options, X-Frame-Options, Referrer-Policy,
// Permissions-Policy, COOP, and HSTS for all responses from this server.
// Only the two headers below are NOT covered by nginx and must be set here.
export const headers: HeadersFunction = () => ({
  // Legacy XSS filter hint — checked by security scanners; ignored by modern
  // browsers that honour CSP instead.
  'X-XSS-Protection': '1; mode=block',
  // Content Security Policy — nginx does not set this, so it is owned here.
  // Notes on directives that need 'unsafe-inline':
  //   script-src: the anti-flash theme script and JSON-LD block both use
  //     dangerouslySetInnerHTML and cannot use nonces without an invasive refactor.
  //   style-src: React applies inline style props that would be blocked otherwise.
  // connect-src covers same-origin /api/* calls (nginx-proxied) and the network
  // requests made by the Firebase Analytics SDK bundled into the app.
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://*.googleapis.com https://*.gstatic.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.googleapis.com https://*.google-analytics.com https://*.googletagmanager.com https://firebaselogging.googleapis.com",
    "media-src 'self' https:",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
});

// Applied before React hydration to prevent a dark/light flash
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark-theme':'light-theme');document.body.classList.add(t);}catch(e){}})();`;


const SITE_JSONLD = new SiteSchemaBuilder().toInlineJson();

const { address: BUSINESS_ADDRESS, geo: BUSINESS_GEO } = BUSINESS;

export function Layout({ children }: { children: React.ReactNode }) {
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
        <Links />
        {/* Site-wide structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: SITE_JSONLD }}
        />
        {/* Anti-flash: applies saved theme class before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body suppressHydrationWarning>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <html lang="en-PH">
        <head>
          <title>Page Not Found — Azari Solar</title>
          <meta name="robots" content="noindex" />
          <Meta />
          <Links />
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
          <Scripts />
        </body>
      </html>
    );
  }

  return (
    <html lang="en-PH">
      <head>
        <title>Error — Azari Solar</title>
        <Meta />
        <Links />
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
        <Scripts />
      </body>
    </html>
  );
}
