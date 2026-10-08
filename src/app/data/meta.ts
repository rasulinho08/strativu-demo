/**
 * Hər səhifənin <title> və description-u — bir mənbə.
 *  - Saytda: Layout → useRouteMeta() (Seo.tsx) səhifə dəyişəndə bunları yazır.
 *  - Build zamanı: vite.config.ts (strativuStaticHeads) hər route üçün dist/<route>/index.html yaradır
 *    (öz title, description ≤160 simvol, canonical, og:*, twitter:*), sitemap.xml və JSON-LD.
 * Yeni səhifə əlavə edəndə: App.tsx-də route + burada STATIC_META-da bir sətir.
 * Description-larda yalnız təsdiqlənmiş faktlar.
 */
import { site } from "./site";
import { frameworks, statusLabel, type Framework } from "./coverage";

export type PageMeta = {
  /** null → ana səhifə formatı ("Strativu · <tagline>"). */
  title: string | null;
  description: string;
  /** Sosial önizləmə üçün daha uzun mətn (yoxdursa description). */
  ogDescription?: string;
  /** Axtarışda göstərilməsin (404). Canonical da yazılmır. */
  noindex?: boolean;
};

export const STATIC_META: Record<string, PageMeta> = {
  "/": { title: null, description: site.descriptionShort, ogDescription: site.description },
  "/platform": {
    title: "Platform",
    description:
      "One model for governance, risk and compliance: registers, controls, links, workflow and reporting. Strativu GRC 360 is the first product built on it.",
  },
  "/platform/grc": {
    title: "Strativu GRC 360: governance, risk and compliance software",
    description:
      "Strativu GRC 360 brings risks, assets, vendors, controls, audits and incidents into one system, in Azerbaijani and English, in the cloud or on your own servers.",
  },
  "/platform/architecture": {
    title: "Architecture",
    description:
      "How Strativu GRC 360 is built: deployment, tenant isolation, sign-in, permissions, system log and API, for the engineer doing the vendor review.",
  },
  "/coverage": {
    title: "Coverage",
    description:
      "Frameworks and regulations Strativu GRC 360 works with, and the status of each: works as a compliance package today, or planned.",
  },
  "/company/about": {
    title: "About",
    description:
      "Strativu is a software company in Baku. Its first product, Strativu GRC 360, connects risks, controls, policies and compliance in one system.",
  },
  "/company/contact": {
    title: "Contact",
    description: "Product questions, partnerships, press, or a framework you need. A person from our team replies within two working days.",
  },
  "/trust": {
    title: "Trust",
    description:
      "How Strativu handles data before it is certified: architecture, hosting, subprocessors, certifications and the vulnerability disclosure policy.",
  },
  "/changelog": { title: "Changelog", description: "Public build log for Strativu GRC 360: what shipped, with real dates." },
  "/early-access": {
    title: "Early access",
    description:
      "Early access to Strativu GRC 360 opens Q1 2027, for banks, public bodies and growing companies that run risk and compliance work.",
  },
};

/** Hüquqi səhifələr: başlıq, yenilənmə tarixi (YYYY-MM-DD) və description. Mətnin özü Misc.tsx-dədir. */
export const legalDocs: Record<string, { title: string; updated: string; description: string }> = {
  privacy: {
    title: "Privacy policy",
    updated: "2026-09-01",
    description: "How Strativu handles the details you send through strativu.com: what we collect, why, how long we keep it and your rights.",
  },
  terms: {
    title: "Terms of use",
    updated: "2026-10-08",
    description: "Terms of use for strativu.com, the website of Strativu LLC in Baku.",
  },
  dpa: {
    title: "Data processing agreement",
    updated: "2026-10-08",
    description:
      "Data processing agreement for Strativu GRC 360 early-access tenants, signed before any personal data is processed. Request the draft.",
  },
};

export const NOT_FOUND_META: PageMeta = { title: "Page not found", description: "The page you asked for does not exist.", noindex: true };

function frameworkMeta(f: Framework): PageMeta {
  const short = f.id.split(" (")[0];
  const label = f.name === short ? short : `${f.name} (${short})`;
  const status =
    f.status === "package"
      ? "Works as a compliance package in Strativu GRC 360: you build it or import it from CSV."
      : `${statusLabel[f.status]} for Strativu GRC 360; early-access teams help set the order.`;
  return { title: f.id, description: `${label}. ${status}` };
}

/** Pathname → meta. Naməlum yol → null (səhifə 404 göstərir). */
export function metaFor(pathname: string): PageMeta | null {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (STATIC_META[path]) return STATIC_META[path];
  const fw = path.match(/^\/coverage\/([^/]+)$/);
  if (fw) {
    const f = frameworks.find((x) => x.slug === fw[1]);
    return f ? frameworkMeta(f) : null;
  }
  const legal = path.match(/^\/legal\/([^/]+)$/);
  if (legal && legalDocs[legal[1]]) return { title: legalDocs[legal[1]].title, description: legalDocs[legal[1]].description };
  return null;
}

/** Brauzer başlığı. "Strativu" ilə başlayan başlıqlara " · Strativu" əlavə olunmur. */
export function fullTitle(meta: PageMeta): string {
  if (!meta.title) return `${site.name} · ${site.tagline.replace(/\.$/, "")}`;
  return meta.title.startsWith(site.name) ? meta.title : `${meta.title} · ${site.name}`;
}

/** İndekslənən bütün route-lar (sitemap və statik başlıqlar üçün). */
export const ROUTES: string[] = [
  ...Object.keys(STATIC_META),
  ...frameworks.map((f) => `/coverage/${f.slug}`),
  ...Object.keys(legalDocs).map((d) => `/legal/${d}`),
];
