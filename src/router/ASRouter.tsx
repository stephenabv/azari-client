import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import ASMainLayout from "../layout/ASMainLayout";
import ASErrorBoundary from "../components/ASErrorBoundary";
import ASPageLoader from "../components/ASPageLoader";
import ASNotFound from "../components/ASNotFound";

const ASDashboard         = lazy(() => import("../pages/ASDashboard"));
const ASAdmin             = lazy(() => import("../pages/ASAdmin"));
const ASPackages          = lazy(() => import("../pages/ASPackages"));
const ASQuotationEngine   = lazy(() => import("../components/ASQuotationEngine"));
const ASProjects          = lazy(() => import("../components/ASProjects"));
const ASProjectDetails    = lazy(() => import("../pages/ASProjectDetail"));
const ASClientJourneyPage = lazy(() => import("../pages/ASClientJourneyPage"));

const normalizeRoutePath = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

const ADMIN_ROUTE_PATH =
  normalizeRoutePath(import.meta.env.VITE_ADMIN_ROUTE ?? "") ||
  "/ops-console-a9f4c31e";

function RouteSlot({ context, children }: { context: string; children: ReactNode }) {
  return (
    <ASErrorBoundary context={context}>
      <Suspense fallback={<ASPageLoader />}>
        {children}
      </Suspense>
    </ASErrorBoundary>
  );
}

export const ASAppRoute = createBrowserRouter([
  {
    path: "/",
    element: <ASMainLayout />,
    children: [
      {
        path: "/",
        element: (
          <RouteSlot context="the home page">
            <ASDashboard />
          </RouteSlot>
        ),
      },
      {
        path: "/projects",
        element: (
          <RouteSlot context="the projects page">
            <ASProjects />
          </RouteSlot>
        ),
      },
      {
        path: "/projects/:id",
        element: (
          <RouteSlot context="this project">
            <ASProjectDetails />
          </RouteSlot>
        ),
      },
      {
        path: "/packages",
        element: (
          <RouteSlot context="the packages page">
            <ASPackages />
          </RouteSlot>
        ),
      },
      {
        path: "/solar-calculator",
        element: (
          <RouteSlot context="the solar calculator">
            <ASQuotationEngine />
          </RouteSlot>
        ),
      },
      {
        path: "/client-journey",
        element: (
          <RouteSlot context="the client journey page">
            <ASClientJourneyPage />
          </RouteSlot>
        ),
      },
      {
        path: "*",
        element: <ASNotFound />,
      },
    ],
  },
  {
    path: ADMIN_ROUTE_PATH,
    element: (
      <RouteSlot context="the admin console">
        <ASAdmin />
      </RouteSlot>
    ),
  },
  {
    path: "*",
    element: <ASNotFound />,
  },
]);
