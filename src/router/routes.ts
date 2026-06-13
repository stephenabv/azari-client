import { lazyWithRetry } from "../lib/lazyWithRetry";
import type { PageMeta } from "../seo/types";
import { SITE_URL } from "../seo/types";
import { organizationSchema, webSiteSchema, breadcrumbSchema } from "../seo/jsonLd";

export interface RouteConfig {
  path: string;
  label: string;
  /** Chunk key used by lazyWithRetry for retry de-dup */
  chunkKey: string;
  component: ReturnType<typeof lazyWithRetry>;
  /** Raw dynamic import — invoked by preload strategies */
  preload: () => Promise<unknown>;
  meta: PageMeta;
  /** Nav link should carry data-preload attribute */
  preloadOnHover: boolean;
  /** Included in sitemap.xml */
  indexable: boolean;
}

// ─── Lazy page imports ────────────────────────────────────────────────────────

const importDashboard    = () => import("../pages/ASDashboard");
const importProjects     = () => import("../components/ASProjects");
const importProjectDetail= () => import("../pages/ASProjectDetail");
const importPackages     = () => import("../pages/ASPackages");
const importQuotation    = () => import("../components/ASQuotationEngine");
const importClientJourney= () => import("../pages/ASClientJourneyPage");
const importAdmin        = () => import("../pages/ASAdmin");
const importNotFound     = () => import("../components/ASNotFound");

export const LazyDashboard     = lazyWithRetry(importDashboard,     "dashboard");
export const LazyProjects      = lazyWithRetry(importProjects,      "projects");
export const LazyProjectDetail = lazyWithRetry(importProjectDetail, "project-detail");
export const LazyPackages      = lazyWithRetry(importPackages,      "packages");
export const LazyQuotation     = lazyWithRetry(importQuotation,     "quotation-engine");
export const LazyClientJourney = lazyWithRetry(importClientJourney, "client-journey");
export const LazyAdmin         = lazyWithRetry(importAdmin,         "admin");
export const LazyNotFound      = lazyWithRetry(importNotFound,      "not-found");

// ─── Public route configs ─────────────────────────────────────────────────────

export const PUBLIC_ROUTES: RouteConfig[] = [
  {
    path: "/",
    label: "Home",
    chunkKey: "dashboard",
    component: LazyDashboard,
    preload: importDashboard,
    preloadOnHover: true,
    indexable: true,
    meta: {
      title: "Solar Energy Solutions for Homes & Businesses",
      description:
        "Azari Solar designs and installs residential and commercial solar systems across the Philippines. Reduce your electricity bill and achieve energy independence.",
      canonical: "/",
      robots: "index,follow",
      og: {
        type: "website",
        url: SITE_URL,
      },
      jsonLd: [organizationSchema(), webSiteSchema()],
    },
  },
  {
    path: "/projects",
    label: "Projects",
    chunkKey: "projects",
    component: LazyProjects,
    preload: importProjects,
    preloadOnHover: true,
    indexable: true,
    meta: {
      title: "Solar Project Portfolio",
      description:
        "Browse Azari Solar's completed residential and commercial solar installations. Real projects, real savings.",
      canonical: "/projects",
      robots: "index,follow",
      og: { type: "website" },
      jsonLd: [
        breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Projects", url: "/projects" },
        ]),
      ],
    },
  },
  {
    path: "/projects/:id",
    label: "Project Detail",
    chunkKey: "project-detail",
    component: LazyProjectDetail,
    preload: importProjectDetail,
    preloadOnHover: false,
    indexable: true,
    meta: {
      // Overridden per-page with project-specific data; this is the fallback
      title: "Solar Project Detail",
      description: "View details, performance metrics, and client testimonial for this Azari Solar installation.",
      robots: "index,follow",
      og: { type: "article" },
    },
  },
  {
    path: "/packages",
    label: "Packages",
    chunkKey: "packages",
    component: LazyPackages,
    preload: importPackages,
    preloadOnHover: true,
    indexable: true,
    meta: {
      title: "Solar System Packages & Pricing",
      description:
        "Explore Azari Solar's Hybrid and Grid-Tie system packages for homes and businesses. Transparent pricing, customizable configurations.",
      canonical: "/packages",
      robots: "index,follow",
      og: { type: "website" },
      jsonLd: [
        breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Packages", url: "/packages" },
        ]),
      ],
    },
  },
  {
    path: "/quotation-engine",
    label: "Get a Quote",
    chunkKey: "quotation-engine",
    component: LazyQuotation,
    preload: importQuotation,
    preloadOnHover: true,
    indexable: true,
    meta: {
      title: "Solar Quotation Engine — Get Your Custom Estimate",
      description:
        "Use our free solar quotation tool to estimate system size, monthly savings, and payback period based on your electricity bill.",
      canonical: "/quotation-engine",
      robots: "index,follow",
      og: { type: "website" },
      jsonLd: [
        breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Get a Quote", url: "/quotation-engine" },
        ]),
      ],
    },
  },
  {
    path: "/client-journey",
    label: "Client Journey",
    chunkKey: "client-journey",
    component: LazyClientJourney,
    preload: importClientJourney,
    preloadOnHover: true,
    indexable: true,
    meta: {
      title: "Your Solar Journey — Step by Step",
      description:
        "A transparent guide to every step of going solar with Azari — from consultation and quotation to installation and net-metering.",
      canonical: "/client-journey",
      robots: "index,follow",
      og: { type: "website" },
      jsonLd: [
        breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Client Journey", url: "/client-journey" },
        ]),
      ],
    },
  },
];

export const preloadableRoutes = PUBLIC_ROUTES
  .filter(r => r.preloadOnHover)
  .map(r => ({ path: r.path, preload: r.preload }));
