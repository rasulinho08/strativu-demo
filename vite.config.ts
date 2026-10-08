import { defineConfig, type Plugin } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { ROUTES, STATIC_META, fullTitle, metaFor } from "./src/app/data/meta";
import { site } from "./src/app/data/site";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Structured data: only real company facts (no address/registration number until they are provided, no ratings or prices). */
function jsonLd(route: string): object[] {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.domain}/#organization`,
    name: site.name,
    legalName: site.company.legalName,
    url: `${site.domain}/`,
    logo: `${site.domain}${site.logo.src}`,
    email: site.company.email,
    sameAs: [site.company.linkedin, site.company.instagram, site.company.github].filter(Boolean),
  };
  if (route === "/") {
    return [
      org,
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${site.domain}/#website`,
        name: site.name,
        url: `${site.domain}/`,
        inLanguage: "en",
        publisher: { "@id": org["@id"] },
      },
    ];
  }
  if (route === "/platform/grc") {
    return [
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Strativu GRC 360",
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Governance, risk and compliance (GRC)",
        operatingSystem: "Web browser",
        inLanguage: ["az", "en"],
        description: STATIC_META["/platform/grc"].description,
        url: `${site.domain}/platform/grc`,
        publisher: { "@type": "Organization", name: site.name, url: `${site.domain}/` },
      },
    ];
  }
  return [];
}

function setMeta(html: string, attr: "name" | "property", key: string, value: string) {
  const re = new RegExp(`(<meta ${attr}="${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}" content=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`[strativu-site] index.html has no <meta ${attr}="${key}">`);
  return html.replace(re, `$1${esc(value)}$2`);
}

/**
 * Build-time SEO from src/app/data/meta.ts (the same data the app uses at runtime):
 *  - preloads the Manrope latin font file;
 *  - writes dist/<route>/index.html for every route with its own title, description, canonical, og:* and twitter:* tags
 *    (+ JSON-LD on / and /platform/grc, + a short <noscript> text);
 *  - writes dist/sitemap.xml from the same route list, with today's date as lastmod;
 *  - fails the build if a page route in App.tsx has no meta.
 */
/** Which page file serves which route (for <link rel="modulepreload"> on the route's static HTML). */
const PAGE_FOR_ROUTE: [RegExp, string][] = [
  [/^\/platform(\/|$)/, "src/app/pages/Platform.tsx"],
  [/^\/coverage(\/|$)/, "src/app/pages/Coverage.tsx"],
  [/^\/(company\/|trust$|early-access$)/, "src/app/pages/Company.tsx"],
  [/^\/(changelog$|legal\/)/, "src/app/pages/Misc.tsx"],
];

function strativuSite(): Plugin {
  let outDir = "dist";
  let root = process.cwd();
  /** page file (relative to root) → its chunk and the chunks it imports */
  const pageChunks = new Map<string, string[]>();
  return {
    name: "strativu-site",
    apply: "build",
    configResolved(c) {
      root = c.root;
      outDir = path.resolve(c.root, c.build.outDir);
    },
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const font = ctx.bundle
          ? Object.values(ctx.bundle).find((a) => a.type === "asset" && /manrope-latin-wght-normal-[\w-]+\.woff2$/.test(a.fileName))
          : undefined;
        if (!font) return html;
        return html.replace(
          "</title>",
          `</title>\n    <link rel="preload" href="/${font.fileName}" as="font" type="font/woff2" crossorigin />`
        );
      },
    },
    generateBundle(_options, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== "chunk" || !chunk.facadeModuleId || !chunk.isDynamicEntry) continue;
        const rel = path.relative(root, chunk.facadeModuleId).split(path.sep).join("/");
        pageChunks.set(rel, [chunk.fileName, ...chunk.imports]);
      }
    },
    closeBundle() {
      // every page route declared in App.tsx must have meta
      const app = fs.readFileSync(path.join(root, "src/app/App.tsx"), "utf8");
      for (const m of app.matchAll(/<Route path="([^"]+)" element=\{<(\w+)/g)) {
        const [, p, el] = m;
        if (el === "Navigate" || p === "*" || p.includes(":")) continue;
        if (!ROUTES.includes(p)) throw new Error(`[strativu-site] route ${p} in App.tsx has no entry in src/app/data/meta.ts`);
      }

      const template = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
      for (const route of ROUTES) {
        const meta = metaFor(route);
        if (!meta) throw new Error(`[strativu-site] no meta for ${route}`);
        if (meta.description.length > 160) console.warn(`[strativu-site] description over 160 characters on ${route}`);
        const title = fullTitle(meta);
        const url = `${site.domain}${route}`;
        let html = template.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
        html = setMeta(html, "name", "description", meta.description);
        html = setMeta(html, "property", "og:title", title);
        html = setMeta(html, "property", "og:description", meta.ogDescription ?? meta.description);
        html = setMeta(html, "name", "twitter:title", title);
        html = setMeta(html, "name", "twitter:description", meta.description);
        html = html.replace(
          /(<meta name="description" content="[^"]*" \/>)/,
          `$1\n    <link rel="canonical" href="${url}" />\n    <meta property="og:url" content="${url}" />`
        );
        const page = PAGE_FOR_ROUTE.find(([re]) => re.test(route))?.[1];
        const preload = page ? pageChunks.get(page) : undefined;
        if (page && !preload) throw new Error(`[strativu-site] no chunk found for ${page}`);
        if (preload) {
          const links = preload
            .filter((f) => !template.includes(`/${f}"`))
            .map((f) => `<link rel="modulepreload" crossorigin href="/${f}">`)
            .join("\n    ");
          if (links) html = html.replace("</head>", `    ${links}\n  </head>`);
        }
        const ld = jsonLd(route);
        if (ld.length) {
          const scripts = ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`);
          html = html.replace("</head>", `    ${scripts.join("\n    ")}\n  </head>`);
        }
        html = html.replace(
          '<div id="root"></div>',
          `<div id="root"></div>\n    <noscript><div style="max-width:640px;margin:120px auto;padding:0 20px;font-family:system-ui,sans-serif"><h1>${esc(
            title
          )}</h1><p>${esc(meta.description)}</p><p>Email <a href="mailto:${site.company.email}">${site.company.email}</a></p></div></noscript>`
        );
        const file = route === "/" ? path.join(outDir, "index.html") : path.join(outDir, route.slice(1), "index.html");
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, html);
      }

      const today = new Date().toISOString().slice(0, 10);
      const urls = ROUTES.map((r) => `  <url><loc>${site.domain}${r}</loc><lastmod>${today}</lastmod></url>`).join("\n");
      fs.writeFileSync(
        path.join(outDir, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
      );
    },
  };
}

/** `vite preview` only: serve dist/<route>/index.html for /<route> (as Vercel does), so local checks see the per-route heads. */
function previewRouteIndex(): Plugin {
  return {
    name: "strativu-preview-route-index",
    configurePreviewServer(server) {
      const dist = path.resolve(server.config.root, server.config.build.outDir);
      server.middlewares.use((req, _res, next) => {
        const url = (req.url ?? "").split("?")[0];
        if (url.length > 1 && !path.extname(url) && fs.existsSync(path.join(dist, url, "index.html"))) {
          req.url = `${url.replace(/\/$/, "")}/index.html${(req.url ?? "").slice(url.length)}`;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), strativuSite(), previewRouteIndex()],
  build: {
    // three.js is a lazy-loaded decorative chunk (LogoScene); its size is expected.
    chunkSizeWarningLimit: 800,
    // Fonts are never inlined as base64 into the render-blocking CSS; the browser downloads only the subsets it needs.
    assetsInlineLimit: (file) => (/\.(woff2?|ttf|otf)$/i.test(file) ? false : undefined),
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          motion: ["motion"],
          router: ["react-router"],
        },
      },
    },
  },
});
