import { createBrowserRouter } from "react-router-dom";
import ASMainLayout from "../layout/ASMainLayout";
import ASDashboard from "../pages/ASDashboard";
import ASQuotationEngine from "../components/ASQuotationEngine";
import ASProjects from "../components/ASProjects";
import ASNotFound from "../components/ASNotFound";

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
        path: "/quotation-engine",
        element: <ASQuotationEngine />
      },
      {
        path: "*",
        element: <ASNotFound />
      }
    ]
  },
]);