/**
 * vite-react-ssg entry point.
 * Used only during `build:ssg`; the regular `main.tsx` handles runtime hydration.
 */
import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./router/ssgRoutes";

import "./index.css";
import "./assets/styles/main.less";

export const createRoot = ViteReactSSG({ routes });
