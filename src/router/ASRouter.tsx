import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import ASMainLayout from "../layout/ASMainLayout";
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

const normalizeRoutePath = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

const ADMIN_ROUTE_PATH =
  normalizeRoutePath(import.meta.env.VITE_ADMIN_ROUTE ?? "") ||
  "/ops-console-a9f4c31e";

function withSuspense(node: React.ReactNode, fallback: React.ReactNode = <PageSkeleton />) {
  return (
    <ChunkErrorBoundary>
      <Suspense fallback={fallback}>{node}</Suspense>
    </ChunkErrorBoundary>
  );
}

export const ASAppRoute = createBrowserRouter([
  {
    path: "/",
    element: <ASMainLayout />,
    children: [
      {
        index: true,
        element: withSuspense(<LazyDashboard />),
      },
      {
        path: "projects",
        element: withSuspense(<LazyProjects />),
      },
      {
        path: "projects/:id",
        element: withSuspense(<LazyProjectDetail />),
      },
      {
        path: "packages",
        element: withSuspense(<LazyPackages />),
      },
      {
        path: "quotation-engine",
        element: withSuspense(<LazyQuotation />),
      },
      {
        path: "client-journey",
        element: withSuspense(<LazyClientJourney />),
      },
      {
        path: "*",
        element: withSuspense(<LazyNotFound />),
      },
    ],
  },
  {
    path: ADMIN_ROUTE_PATH,
    element: withSuspense(<LazyAdmin />, <AdminSkeleton />),
  },
  {
    path: "*",
    element: withSuspense(<LazyNotFound />),
  },
]);
