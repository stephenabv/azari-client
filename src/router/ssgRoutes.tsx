/**
 * Flat route list for vite-react-ssg.
 * Mirrors ASRouter but uses the same lazy components — SSG renders them at build time.
 */
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import type { RouteRecord } from "vite-react-ssg";
import ASMainLayout from "../layout/ASMainLayout";

function SsgRootProvider() {
  return (
    <HelmetProvider>
      <Outlet />
    </HelmetProvider>
  );
}
import { ChunkErrorBoundary } from "../lib/ChunkErrorBoundary";
import { PageSkeleton, AdminSkeleton } from "../components/ASPageSkeleton";
import {
  LazyDashboard,
  LazyProjects,
  LazyProjectDetail,
  LazyPackages,
  LazyQuotation,
  LazyClientJourney,
  LazyAdmin,
  LazyNotFound,
} from "./routes";

function wrap(node: React.ReactNode, fallback: React.ReactNode = <PageSkeleton />) {
  return (
    <ChunkErrorBoundary>
      <Suspense fallback={fallback}>{node}</Suspense>
    </ChunkErrorBoundary>
  );
}

const ADMIN_ROUTE_PATH =
  (import.meta.env.VITE_ADMIN_ROUTE as string | undefined)?.trim() ||
  "/ops-console-a9f4c31e";

export const routes: RouteRecord[] = [
  {
    // Pathless layout route — provides HelmetProvider without affecting URL matching
    element: <SsgRootProvider />,
    children: [
      {
        path: "/",
        element: <ASMainLayout />,
        children: [
          { index: true,                  element: wrap(<LazyDashboard />) },
          { path: "projects",             element: wrap(<LazyProjects />) },
          { path: "projects/:id",         element: wrap(<LazyProjectDetail />) },
          { path: "packages",             element: wrap(<LazyPackages />) },
          { path: "quotation-engine",     element: wrap(<LazyQuotation />) },
          { path: "client-journey",       element: wrap(<LazyClientJourney />) },
          { path: "*",                    element: wrap(<LazyNotFound />) },
        ],
      },
      {
        path: ADMIN_ROUTE_PATH,
        element: wrap(<LazyAdmin />, <AdminSkeleton />),
      },
      { path: "*", element: wrap(<LazyNotFound />) },
    ],
  },
];
