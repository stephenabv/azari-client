import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import AzariSolar from "./App";

import "./index.css";
import "./assets/styles/main.less";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <AzariSolar />
    </HelmetProvider>
  </StrictMode>
);
