import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";
import type { LinksFunction } from "react-router";

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

// Applied before React hydration to prevent a dark/light flash
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark-theme':'light-theme');document.body.classList.add(t);}catch(e){}})();`;


const SITE_JSONLD = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://azari.solar/#website",
      name: "Azari Solar",
      alternateName: "azari.solar",
      url: "https://azari.solar/",
    },
    {
      "@type": ["LocalBusiness", "Electrician"],
      "@id": "https://azari.solar/#business",
      name: "Azari Solar",
      url: "https://azari.solar",
      logo: {
        "@type": "ImageObject",
        url: "https://azari.solar/favicon-96x96.png",
        width: 96,
        height: 96,
      },
      image: "https://azari.solar/preview.jpg",
      description:
        "Azari Solar installs affordable solar panel systems for residential and commercial properties in Bohol and across the Philippines.",
      telephone: "+63-961-618-3465",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Tagbilaran City",
        addressRegion: "Bohol",
        addressCountry: "PH",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 9.6571,
        longitude: 123.8543,
      },
      areaServed: [
        { "@type": "City", name: "Tagbilaran City" },
        { "@type": "AdministrativeArea", name: "Bohol" },
        { "@type": "AdministrativeArea", name: "Visayas" },
        { "@type": "Country", name: "Philippines" },
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "00:00",
          closes: "23:59",
        },
      ],
      priceRange: "₱₱",
      currenciesAccepted: "PHP",
      paymentAccepted: "Cash, Bank Transfer, GCash",
      sameAs: [],
    },
    {
      "@type": "Service",
      "@id": "https://azari.solar/#solar-installation",
      name: "Solar Panel Installation",
      serviceType: "Solar Panel Installation",
      provider: { "@id": "https://azari.solar/#business" },
      areaServed: [
        { "@type": "AdministrativeArea", name: "Bohol" },
        { "@type": "Country", name: "Philippines" },
      ],
      description:
        "Professional solar panel installation for residential and commercial properties. We offer hybrid, grid-tie, and off-grid solar systems with full after-sales support.",
      url: "https://azari.solar/packages",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Does Azari Solar offer installation across the Philippines?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Azari Solar is based in Tagbilaran City, Bohol, and primarily serves Bohol and the Visayas region. We also take on projects nationwide across the Philippines.",
          },
        },
        {
          "@type": "Question",
          name: "What types of solar systems does Azari Solar install?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We install hybrid solar systems, grid-tied (on-grid) solar systems, and off-grid solar systems for both residential and commercial customers.",
          },
        },
        {
          "@type": "Question",
          name: "How do I get a quote for solar installation in Bohol?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Use our free Solar Savings Calculator at azari.solar/solar-calculator or browse our packages at azari.solar/packages. You can submit an inquiry directly from any package page.",
          },
        },
        {
          "@type": "Question",
          name: "How long does solar installation take?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A typical residential solar installation takes 1–3 days depending on system size and site conditions. Our team handles everything from design to commissioning.",
          },
        },
        {
          "@type": "Question",
          name: "Do your solar packages include installation?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. All Azari Solar packages are supply-and-install — the quoted price covers the solar equipment and professional installation by our certified technicians.",
          },
        },
      ],
    },
  ],
});

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-PH">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Geo / local signals */}
        <meta name="geo.region" content="PH-BOH" />
        <meta name="geo.placename" content="Tagbilaran City, Bohol, Philippines" />
        <meta name="geo.position" content="9.6571;123.8543" />
        <meta name="ICBM" content="9.6571, 123.8543" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="author" content="Azari Solar" />
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
