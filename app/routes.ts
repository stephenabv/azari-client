import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

const ADMIN_PATH =
  (process.env["VITE_ADMIN_ROUTE"] ?? "").replace(/^\//, "") ||
  "ops-console-a9f4c31e";

export default [
  layout("layouts/main-layout.tsx", [
    index("routes/_index.tsx"),
    route("projects", "routes/projects._index.tsx"),
    route("projects/:id", "routes/projects.$id.tsx"),
    route("packages", "routes/packages.tsx"),
    route("solar-calculator", "routes/solar-calculator.tsx"),
    route("client-journey", "routes/client-journey.tsx"),
    route("privacy-policy", "routes/privacy-policy.tsx"),
    route("terms-and-conditions", "routes/terms-and-conditions.tsx"),
    route("sitemap.xml", "routes/sitemap-xml.tsx"),
    route("*", "routes/$.tsx"),
  ]),
  route(ADMIN_PATH, "routes/admin.tsx"),
] satisfies RouteConfig;
