import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "dist/bundle-report.html",
      gzipSize: true,
      brotliSize: true,
      open: false,
    }),
  ],

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React ecosystem — always in the initial bundle
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "react-vendor";
          }
          // React Router
          if (id.includes("node_modules/react-router")) {
            return "router-vendor";
          }
          // react-helmet-async
          if (id.includes("node_modules/react-helmet-async") || id.includes("node_modules/react-fast-compare") || id.includes("node_modules/invariant")) {
            return "helmet-vendor";
          }
          // Firebase — large, only needed for analytics; defer into its own chunk
          if (id.includes("node_modules/firebase") || id.includes("node_modules/@firebase")) {
            return "firebase-vendor";
          }
          // D3 geo + topojson — used only on the client-journey page
          if (id.includes("node_modules/d3-") || id.includes("node_modules/topojson")) {
            return "map-vendor";
          }
        },
      },
    },
  },
});
