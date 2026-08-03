import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";

export default defineConfig({
  plugins: [reactRouter()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
  esbuild: {
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
  },
  build: {
    target: "esnext",
    cssCodeSplit: true,
    assetsInlineLimit: 8192,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("d3-geo") || id.includes("topojson")) {
            return "vendor-geo";
          }
          if (id.includes("node_modules/firebase")) {
            return "vendor-firebase";
          }
        },
      },
    },
  },
});
