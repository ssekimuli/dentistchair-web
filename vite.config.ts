import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

import { buildSitemapXml } from "./scripts/sitemap.mjs";
import type { IncomingMessage, ServerResponse } from "node:http";

// Vite config — https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: false,
    minify: true,
  },
  plugins: [react(), tailwindcss(), seoSitemap()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: parseInt(process.env.PORT || "8443"),
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: parseInt(process.env.PORT || "8443"),
  },
});

/**
 * Serves /sitemap.xml built from seo/keywords.json and seo/countries.json on every
 * request, in dev and preview. The build writes the same XML to dist/sitemap.xml.
 */
function seoSitemap(): Plugin {
  function serve(req: IncomingMessage, res: ServerResponse, next: () => void) {
    if (req.url?.split("?")[0] !== "/sitemap.xml") return next();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.end(buildSitemapXml());
  }
  return {
    name: "seo-sitemap",
    configureServer(server) {
      server.middlewares.use(serve);
    },
    configurePreviewServer(server) {
      server.middlewares.use(serve);
    },
  };
}
