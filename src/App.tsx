import { RouterProvider } from "react-router-dom";
import { ASAppRoute } from "./router/ASRouter";
import ASErrorBoundary from "./components/ASErrorBoundary";

export default function AzariSolar() {
  return (
    <ASErrorBoundary context="the application">
      <RouterProvider router={ASAppRoute} />
    </ASErrorBoundary>
  );
}
