import { RouterProvider } from "react-router-dom";
import { ASAppRoute } from "./router/ASRouter";

export default function AzariSolar() {
  return <RouterProvider router={ASAppRoute} />
}