// Zero-dependency static build: src/pages/*.html + partials -> site/
// Each page starts with a <!--meta ... --> block (key: value per line).
//   node build.mjs          local build -> site/ (served at /)
//   node build.mjs --pages  GitHub Pages preview -> docs/ (served at /mas-international/, hidden from search)
import { readFileSync, writeFileSync, mkdirSync, readdirSync, cpSync, rmSync } from "node:fs";
import { join } from "node:path";

const PAGES = process.argv.includes("--pages");
const SITE_URL = PAGES ? "https://playcamhq.github.io/mas-international" : "https://www.mas-international.example"; // [OWNER: real domain at launch]
const BASE = PAGES ? "/mas-international" : "";
const NOINDEX = PAGES; // work-in-progress preview: keep it out of search engines
const SRC = "src";
const OUT = PAGES ? "docs" : "site";

const partial = (name) => readFileSync(join(SRC, "partials", `${name}.html`), "utf8");
const layout = partial("layout");
const header = partial("header");
const footer = partial("footer");
const icons = partial("icons");

// Prefix root-relative URLs ("/jobs/", "/assets/…") with the base path; leave "//cdn" and "#" alone.
const withBase = (html) => (BASE ? html.replace(/(href|src|content)="\/(?!\/)/g, `$1="${BASE}/`) : html);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(join(SRC, "assets"), join(OUT, "assets"), { recursive: true });

const urls = [];
for (const file of readdirSync(join(SRC, "pages")).filter((f) => f.endsWith(".html"))) {
  const raw = readFileSync(join(SRC, "pages", file), "utf8");
  const m = raw.match(/^<!--meta\n([\s\S]*?)-->\n?/);
  const meta = Object.fromEntries(
    (m ? m[1] : "").split("\n").filter(Boolean).map((l) => {
      const i = l.indexOf(":");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
  );
  const body = m ? raw.slice(m[0].length) : raw;
  const slug = file.replace(/\.html$/, "");
  const path = slug === "index" ? "/" : `/${slug}/`;
  const nav = meta.nav || slug;

  // mark the active nav link
  const hdr = header.replace(new RegExp(`data-nav="${nav}"`, "g"), `data-nav="${nav}" aria-current="page"`);

  const html = layout
    .replaceAll("{{title}}", meta.title || "MAS International")
    .replaceAll("{{description}}", meta.description || "")
    .replaceAll("{{canonical}}", SITE_URL + path)
    .replaceAll("{{bodyClass}}", meta.bodyClass || "")
    .replace("{{base}}", BASE)
    .replace("{{robots}}", NOINDEX || meta.noindex === "true" ? '  <meta name="robots" content="noindex, nofollow">' : "")
    .replace("{{icons}}", icons)
    .replace("{{header}}", hdr)
    .replace("{{footer}}", footer)
    .replace("{{content}}", body);

  const dir = slug === "index" ? OUT : join(OUT, slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), withBase(html).replaceAll(`="${BASE}${SITE_URL}`, `="${SITE_URL}`));
  if (meta.noindex !== "true") urls.push(SITE_URL + path);
}

writeFileSync(
  join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${u}</loc></url>`)
    .join("\n")}\n</urlset>\n`
);
writeFileSync(
  join(OUT, "robots.txt"),
  NOINDEX ? "User-agent: *\nDisallow: /\n" : `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`
);
if (PAGES) writeFileSync(join(OUT, ".nojekyll"), "");
console.log(`Built ${urls.length} pages -> ${OUT}/${PAGES ? " (GitHub Pages preview, noindex)" : ""}`);
