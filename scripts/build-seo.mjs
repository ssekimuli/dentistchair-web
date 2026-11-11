// Generates static SEO landing pages, sitemap.xml and robots.txt into dist/.
// Runs after `vite build`. Inputs live in seo/:
//   keywords.json  - search phrases (add a keyword here and rebuild)
//   countries.json - target countries (54 UN-recognised African states)
//   features.json  - product features shown on every page
// Set SITE_URL to the public domain, e.g. SITE_URL=https://www.example.com

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSitemapXml, siteUrl } from "./sitemap.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const SITE_URL = siteUrl();

const read = (file) => JSON.parse(fs.readFileSync(path.join(root, "seo", file), "utf8"));
const keywords = read("keywords.json");
const countries = read("countries.json");
const features = read("features.json");

if (countries.length !== 54) {
  console.warn(`Expected 54 African countries, found ${countries.length}.`);
}

// Reuse the stylesheet(s) and favicon Vite emitted so generated pages match the app.
const indexHtml = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const styleTags = indexHtml.match(/<link[^>]+rel="stylesheet"[^>]*>/g) ?? [];

const esc = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const REGION_LEAD = {
  North: "For dental clinics across North Africa, the priority is one system that organizes every chair, patient and invoice.",
  West: "For dental clinics across West Africa, the priority is one system that keeps every chair, patient and invoice organized.",
  Central: "For dental clinics across Central Africa, the priority is one system that keeps every chair, patient and invoice in order.",
  East: "For dental clinics across East Africa, the priority is one system that organizes every chair, patient and invoice.",
  Southern: "For dental clinics across Southern Africa, the priority is one system that keeps every chair, patient and invoice organized.",
};

const SYNC_LINE =
  "DentiChair runs on your own computers and syncs securely to the cloud the moment you’re back online.";

const SEO_CSS = `
body{margin:0}
.seo-header{border-bottom:1px solid #e5e7eb;padding:16px 0}
.seo-bar{display:flex;justify-content:space-between;align-items:center;gap:16px}
.seo-brand{font-weight:700;text-decoration:none;color:inherit}
.seo-hero{padding:64px 0 40px}
.seo-hero h1{font-size:clamp(2rem,5vw,3.25rem);line-height:1.1;margin:12px 0 16px;letter-spacing:-0.02em}
.seo-hero p{font-size:1.1rem;max-width:720px;color:#4b5563;line-height:1.6;margin:0 0 12px}
.seo-crumbs{font-size:.875rem;color:#6b7280}
.seo-crumbs a{color:inherit}
.seo-section{padding:32px 0}
.seo-section h2{font-size:1.5rem;margin:0 0 16px}
.seo-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
.seo-card{border:1px solid #e5e7eb;border-radius:14px;padding:20px;background:#fff}
.seo-card h3{margin:0 0 8px;font-size:1.05rem}
.seo-card p{margin:0;color:#4b5563;line-height:1.5}
.seo-cta{background:#0f766e;color:#fff;border-radius:18px;padding:32px}
.seo-cta h2{color:#fff;margin:0 0 8px}
.seo-cta p{margin:0 0 20px;opacity:.9}
.seo-links{display:flex;flex-wrap:wrap;gap:8px;list-style:none;padding:0;margin:0 0 24px}
.seo-links a{display:inline-block;padding:6px 12px;border:1px solid #e5e7eb;border-radius:999px;text-decoration:none;color:inherit;font-size:.9rem}
.seo-footer{border-top:1px solid #e5e7eb;padding:24px 0;color:#6b7280;font-size:.9rem}
.seo-footer a{color:inherit}
`;

function layout({ title, description, urlPath, jsonLd, body }) {
  const canonical = `${SITE_URL}${urlPath}`;
  const ld = JSON.stringify(jsonLd).replace(/</g, "\\u003c");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="${esc(canonical)}" />
<link rel="icon" href="/favicon.png" />
<meta property="og:type" content="website" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${esc(canonical)}" />
${styleTags.join("\n")}
<style>${SEO_CSS}</style>
<script type="application/ld+json">${ld}</script>
</head>
<body>
<header class="seo-header"><div class="container seo-bar"><a class="seo-brand" href="/">DentiChair</a><a class="button button-primary" href="/#/contact">Request trial</a></div></header>
<main>${body}</main>
<footer class="seo-footer"><div class="container">DentiChair · <a href="/">Home</a> · <a href="/#/contact">Request a 2-month trial</a> · <a href="mailto:info@dentichair.com">info@dentichair.com</a></div></footer>
</body>
</html>
`;
}

const breadcrumbs = (items) => `<nav class="seo-crumbs" aria-label="Breadcrumb">${items
  .map((item, i) =>
    i === items.length - 1 ? esc(item.name) : `<a href="${esc(item.href)}">${esc(item.name)}</a>`,
  )
  .join(" › ")}</nav>`;

const breadcrumbLd = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: `${SITE_URL}${item.href}`,
  })),
});

const featureCards = () =>
  features
    .map((f) => `<div class="seo-card"><h3>${esc(f.title)}</h3><p>${esc(f.copy)}</p></div>`)
    .join("");

const ctaBlock = () => `<section class="seo-section"><div class="container"><div class="seo-cta">
<h2>Request your 2-month trial</h2>
<p>Try every DentiChair feature free for two months, then continue with a plan priced for your clinic.</p>
<a class="button button-light" href="/#/contact">Request my trial</a>
</div></div></section>`;

const writePage = (urlPath, html) => {
  const dir = path.join(dist, urlPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
};

const urls = ["/"];
let pageCount = 0;

for (const kw of keywords) {
  const kwPath = `/${kw.slug}/`;
  urls.push(kwPath);

  // Keyword hub: every country, grouped by region.
  const regions = [...new Set(countries.map((c) => c.region))];
  const hubRegions = regions
    .map((region) => {
      const links = countries
        .filter((c) => c.region === region)
        .map((c) => `<li><a href="${kwPath}${c.slug}/">${esc(c.name)}</a></li>`)
        .join("");
      return `<h2>${esc(region)} Africa</h2><ul class="seo-links">${links}</ul>`;
    })
    .join("");

  const hubTitle = `${kw.title} for African Dental Clinics | DentiChair`;
  const hubDesc = `${kw.title} for dental clinics across Africa. Choose your country and request a free two-month trial of DentiChair.`;
  writePage(
    kwPath,
    layout({
      title: hubTitle,
      description: hubDesc,
      urlPath: kwPath,
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "CollectionPage",
            name: hubTitle,
            url: `${SITE_URL}${kwPath}`,
            description: hubDesc,
          },
          breadcrumbLd([
            { name: "Home", href: "/" },
            { name: kw.title, href: kwPath },
          ]),
        ],
      },
      body: `<section class="seo-hero"><div class="container">
${breadcrumbs([
  { name: "Home", href: "/" },
  { name: kw.title, href: kwPath },
])}
<h1>${esc(kw.title)} for African dental clinics</h1>
<p>${esc(kw.intro)}</p>
<p>${esc(SYNC_LINE)}</p>
</div></section>
<section class="seo-section"><div class="container"><h2>Choose your country</h2>${hubRegions}</div></section>
${ctaBlock()}`,
    }),
  );
  pageCount++;

  for (const c of countries) {
    const urlPath = `${kwPath}${c.slug}/`;
    urls.push(urlPath);

    const title = `${kw.title} in ${c.name} | DentiChair`;
    const description = `${kw.title} for dental clinics in ${c.name}. Patients, appointments, charting, billing and labs in one app. Request a free two-month trial.`;

    const otherKeywords = keywords
      .filter((other) => other.slug !== kw.slug)
      .map((other) => `<li><a href="/${other.slug}/${c.slug}/">${esc(other.title)} in ${esc(c.name)}</a></li>`)
      .join("");
    const otherCountries = countries
      .filter((other) => other.slug !== c.slug)
      .map((other) => `<li><a href="${kwPath}${other.slug}/">${esc(other.name)}</a></li>`)
      .join("");

    writePage(
      urlPath,
      layout({
        title,
        description,
        urlPath,
        jsonLd: {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "SoftwareApplication",
              name: "DentiChair",
              applicationCategory: "BusinessApplication",
              description,
              url: SITE_URL,
              featureList: features.map((f) => f.title),
            },
            breadcrumbLd([
              { name: "Home", href: "/" },
              { name: kw.title, href: kwPath },
              { name: c.name, href: urlPath },
            ]),
          ],
        },
        body: `<section class="seo-hero"><div class="container">
${breadcrumbs([
  { name: "Home", href: "/" },
  { name: kw.title, href: kwPath },
  { name: c.name, href: urlPath },
])}
<h1>${esc(kw.title)} in ${esc(c.name)}</h1>
<p>${esc(kw.intro)}</p>
<p>${esc(REGION_LEAD[c.region])} ${esc(SYNC_LINE)}</p>
<p>Dental clinics in ${esc(c.name)} can request a free two-month trial to see how DentiChair fits their workflows.</p>
<p><a class="button button-primary" href="/#/contact">Request your 2-month trial</a></p>
</div></section>
<section class="seo-section"><div class="container"><h2>Everything in one app for your ${esc(c.name)} clinic</h2>
<div class="seo-grid">${featureCards()}</div></div></section>
${ctaBlock()}
<section class="seo-section"><div class="container">
<h2>More in ${esc(c.name)}</h2>
<ul class="seo-links">${otherKeywords}</ul>
<h2>${esc(kw.title)} in other African countries</h2>
<ul class="seo-links">${otherCountries}</ul>
</div></section>`,
      }),
    );
    pageCount++;
  }
}

// Sitemap comes from the same module the dev/preview server uses, so both always match.
const sitemap = buildSitemapXml();
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);
fs.writeFileSync(
  path.join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
);

console.log(
  `SEO build: ${pageCount} pages (${keywords.length} keywords x ${countries.length} countries + hubs), ${urls.length} sitemap URLs.`,
);
