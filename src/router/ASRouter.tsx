import { createBrowserRouter } from "react-router-dom";
import ASMainLayout from "../layout/ASMainLayout";
import ASDashboard from "../pages/ASDashboard";
import ASAdmin from "../pages/ASAdmin";
import ASPackages from "../pages/ASPackages";
import ASQuotationEngine from "../components/ASQuotationEngine";
import ASProjects from "../components/ASProjects";
import ASProjectDetails from "../pages/ASProjectDetail";
import ASNotFound from "../components/ASNotFound";
import ASClientJourneyPage from "../pages/ASClientJourneyPage";

const normalizeRoutePath = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

const ADMIN_ROUTE_PATH =
  normalizeRoutePath(import.meta.env.VITE_ADMIN_ROUTE ?? "") ||
  "/ops-console-a9f4c31e";

export const ASAppRoute = createBrowserRouter([
  {
    path: "/",
    element: <ASMainLayout />,
    children: [
      {
        path: "/",
        element: <ASDashboard />
      },
      {
        path: "/projects",
        element: <ASProjects />
      },
      {
        path: "/projects/:id",
        element: <ASProjectDetails />
      },
      {
        path: "/packages",
        element: <ASPackages />
      },
      {
        path: "/quotation-engine",
        element: <ASQuotationEngine />
      },
      {
        path: "/client-journey",
        element: <ASClientJourneyPage />
      },
      {
        path: "*",
        element: <ASNotFound />
      }
    ]
  },
  {
    path: ADMIN_ROUTE_PATH,
    element: <ASAdmin />,
  },
  {
    path: "*",
    element: <ASNotFound />,
  },
]);
