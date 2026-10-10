/**
 * Hər səhifənin <title> və description-u — bir mənbə.
 *  - Saytda: Layout → useRouteMeta() (Seo.tsx) səhifə dəyişəndə bunları yazır.
 *  - Build zamanı: vite.config.ts (strativuSite) hər route üçün dist/<route>/index.html yaradır
 *    (öz title, description ≤160 simvol, canonical, og:*, twitter:*), sitemap.xml və JSON-LD.
 * Yeni səhifə əlavə edəndə: App.tsx-də route + burada STATIC_META-da bir sətir.
 * Description-larda yalnız təsdiqlənmiş faktlar.
 * URL-lər dilsizdir (/products, /about …): Azərbaycan dili sonra /az/... prefiksi ilə əlavə oluna bilər.
 */
import { site } from "./site";
import { frameworks, statusLabel, type Framework } from "./coverage";
import { GRC, frameworkPath } from "./grc360";

export type PageMeta = {
  /** null → ana səhifə formatı ("Strativu · <manifest>"). */
  title: string | null;
  description: string;
  /** Sosial önizləmə üçün daha uzun mətn (yoxdursa description). */
  ogDescription?: string;
  /** Axtarışda göstərilməsin (404, /contact/thank-you). Canonical yazılmır, sitemap-a düşmür. */
  noindex?: boolean;
};

/** Hüquqi səhifələr: başlıq, yenilənmə tarixi (YYYY-MM-DD) və description. Mətnin özü pages/Legal.tsx-dədir. */
export const legalDocs = {
  privacy: {
    path: "/privacy",
    title: "Privacy Policy",
    updated: "2026-10-10",
    description: "How Strativu handles the details you send through strativu.com: what we collect, why, how long we keep it and your rights.",
  },
  terms: {
    path: "/terms",
    title: "Terms of Use",
    updated: "2026-10-10",
    description: "Terms of use for strativu.com, the website of Strativu LLC in Baku.",
  },
} as const;
export type LegalDoc = keyof typeof legalDocs;

export const STATIC_META: Record<string, PageMeta> = {
  "/": { title: null, description: site.descriptionShort, ogDescription: site.description },
  "/products": {
    title: "Products",
    description:
      "Every product in the Strativu ecosystem starts with a real problem. GRC360 for governance, risk and compliance; AI Proxy is planned.",
  },
  "/about": {
    title: "About Us",
    description:
      "Why Strativu exists: technology only matters when it creates value. Our mission, our vision and the principles we build by.",
  },
  "/contact": {
    title: "Contact",
    description:
      "A product question, a partnership idea or a problem you'd like solved? Send Strativu a message and the right person will get back to you.",
  },
  "/contact/thank-you": {
    title: "Message sent",
    description: "Thanks. We've received your message and will reply soon.",
    noindex: true,
  },
  [GRC.base]: {
    title: "GRC360 by Strativu: governance, risk and compliance",
    description:
      "GRC360 by Strativu brings risks, assets, vendors, controls, audits and incidents into one platform, in Azerbaijani and English. Early access opens Q1 2027.",
  },
  [GRC.architecture]: {
    title: "GRC360 architecture",
    description:
      "How GRC360 by Strativu is built: deployment, tenant isolation, sign-in, permissions, system log and API, for the engineer doing the vendor review.",
  },
  [GRC.frameworks]: {
    title: "GRC360 frameworks",
    description:
      "Frameworks and regulations GRC360 by Strativu works with, and the status of each: works as a compliance package today, or planned.",
  },
  [GRC.changelog]: { title: "GRC360 changelog", description: "Public build log for GRC360 by Strativu: what shipped, with real dates." },
  [GRC.earlyAccess]: {
    title: "GRC360 early access",
    description:
      "Early access to GRC360 by Strativu opens Q1 2027, for banks, public bodies and growing companies that run risk and compliance work.",
  },
  "/trust": {
    title: "Security",
    description:
      "How Strativu handles data before it is certified: architecture, hosting, subprocessors, certifications and the vulnerability disclosure policy.",
  },
  ...Object.fromEntries(Object.values(legalDocs).map((d) => [d.path, { title: d.title, description: d.description }])),
};

export const NOT_FOUND_META: PageMeta = { title: "Page not found", description: "The page you asked for does not exist.", noindex: true };

function frameworkMeta(f: Framework): PageMeta {
  const short = f.id.split(" (")[0];
  const label = f.name === short ? short : `${f.name} (${short})`;
  const status =
    f.status === "package"
      ? "Works as a compliance package in GRC360 by Strativu: you build it or import it from CSV."
      : `${statusLabel[f.status]} for GRC360 by Strativu; early-access teams help set the order.`;
  return { title: `${f.id} in GRC360`, description: `${label}. ${status}` };
}

const FRAMEWORK_RE = new RegExp(`^${GRC.frameworks}/([^/]+)$`);

/** Pathname → meta. Naməlum yol → null (səhifə 404 göstərir). */
export function metaFor(pathname: string): PageMeta | null {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (STATIC_META[path]) return STATIC_META[path];
  const fw = path.match(FRAMEWORK_RE);
  if (fw) {
    const f = frameworks.find((x) => x.slug === fw[1]);
    return f ? frameworkMeta(f) : null;
  }
  return null;
}

/**
 * Brauzer başlığı: "<title> · Strativu". "Strativu" ilə başlayan və "by Strativu" olan başlıqlara
 * " · Strativu" əlavə olunmur.
 */
export function fullTitle(meta: PageMeta): string {
  if (!meta.title) return `${site.name} · ${site.tagline}`;
  return meta.title.startsWith(site.name) || meta.title.includes(`by ${site.name}`) ? meta.title : `${meta.title} · ${site.name}`;
}

/** Statik başlığı yaradılan bütün route-lar (noindex olanlar da). */
export const ROUTES: string[] = [...Object.keys(STATIC_META), ...frameworks.map((f) => frameworkPath(f.slug))];

/** Sitemap: yalnız indekslənən route-lar. */
export const SITEMAP_ROUTES: string[] = ROUTES.filter((r) => !metaFor(r)?.noindex);
