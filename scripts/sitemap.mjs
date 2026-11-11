// Builds sitemap.xml from seo/keywords.json and seo/countries.json.
// Called on every request in dev/preview (see vite.config.ts) and once per build
// (see scripts/build-seo.mjs), so the sitemap always reflects the current data.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function siteUrl() {
  return (process.env.SITE_URL || "https://dentichair.com").replace(/\/+$/, "");
}

function readSeoFile(file) {
  return JSON.parse(fs.readFileSync(path.join(root, "seo", file), "utf8"));
}

/** Every indexable path: home, each keyword hub, and each keyword × country page. */
export function seoPaths() {
  const keywords = readSeoFile("keywords.json");
  const countries = readSeoFile("countries.json");
  const paths = ["/"];
  for (const kw of keywords) {
    paths.push(`/${kw.slug}/`);
    for (const c of countries) paths.push(`/${kw.slug}/${c.slug}/`);
  }
  return paths;
}

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** lastmod is the date the sitemap is generated, so it is never hard-coded. */
export function buildSitemapXml(now = new Date()) {
  const base = siteUrl();
  const lastmod = now.toISOString().slice(0, 10);
  const entries = seoPaths()
    .map(
      (p) => `  <url>
    <loc>${escapeXml(`${base}${p}`)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}
