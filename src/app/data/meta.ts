/**
 * Hər səhifənin <title> və description-u — bir mənbə.
 *  - Saytda: Layout → useRouteMeta() (Seo.tsx) səhifə dəyişəndə bunları yazır.
 *  - Build zamanı: vite.config.ts (strativuSite) hər route üçün dist/<route>/index.html yaradır
 *    (öz title, description ≤160 simvol, canonical, og:*, twitter:*), sitemap.xml və JSON-LD.
 * Yeni səhifə əlavə edəndə: App.tsx-də route + burada STATIC_META-da bir sətir.
 * Description-larda yalnız təsdiqlənmiş faktlar.
 * İngiliscə URL-lər prefikssizdir (/products …); Azərbaycan dili /az/... altındadır (AZ_META, i18n/paths.ts → AZ_PATHS).
 */
import { site } from "./site";
import { GRC } from "./grc360";

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
    updated: "2026-10-23",
    description: "How Strativu handles the details you send through strativu.com: what we collect, why, how long we keep it and your rights.",
  },
  terms: {
    path: "/terms",
    title: "Terms of Use",
    updated: "2026-10-23",
    description: "Terms of use for strativu.com, the website of Strativu LLC in Baku.",
  },
  cookies: {
    path: "/cookies",
    title: "Cookie Policy",
    updated: "2026-10-23",
    description: "strativu.com sets no cookies and runs no analytics or advertising trackers. What the site stores in your browser, and which third parties it contacts.",
  },
} as const;
export type LegalDoc = keyof typeof legalDocs;

export const STATIC_META: Record<string, PageMeta> = {
  "/": { title: null, description: site.descriptionShort, ogDescription: site.description },
  "/products": {
    title: "Products",
    description:
      "Every Strativu product starts with a real problem: GRC360 for risk and compliance, HackOS for hackathons, UniAz for school-leavers, and AI Proxy, coming soon.",
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
  "/products/ai-proxy": {
    title: "AI Proxy by Strativu: use AI at work, keep your data in",
    description:
      "AI Proxy by Strativu, coming soon: a security layer between your company and AI that keeps sensitive data in and protects your own AI from prompt attacks.",
  },
  "/products/hackos": {
    title: "HackOS by Strativu: hackathon management platform",
    description: "HackOS by Strativu runs registration, teams, mentors, judging, results and certificates for a hackathon in one system.",
  },
  "/products/uniaz": {
    title: "UniAz by Strativu: exam scores and university choice",
    description: "UniAz by Strativu: a free platform for school-leavers and students in Azerbaijan. Work out your DİM score, compare passing scores, choose a programme.",
  },
  [GRC.base]: {
    title: "GRC360 by Strativu: governance, risk and compliance",
    description:
      "GRC360 by Strativu: risks, controls, policies, audits and obligations in one platform, on your own servers. Opens January 2027: request early access or a demo.",
  },
  [GRC.earlyAccess]: {
    title: "GRC360 early access and demo",
    description:
      "GRC360 by Strativu opens in January 2027. Request early access or book a demo built around your risk and compliance process.",
  },
  "/trust": {
    title: "Security",
    description:
      "How Strativu handles data before it is certified: architecture, hosting, subprocessors, certifications and the vulnerability disclosure policy.",
  },
  ...Object.fromEntries(Object.values(legalDocs).map((d) => [d.path, { title: d.title, description: d.description }])),

  /* ── Azərbaycanca səhifələr (/az) ── */
  "/az": {
    title: "Strativu · Texnologiya alətdir. Məqsəd dəyərdir.",
    description:
      "Strativu hər biri öz bazarında real problemi həll edən məhsullar ekosistemidir. Fərqli bazarlar, fərqli problemlər, dəyər yaratmağın bir yolu.",
  },
  "/az/products": {
    title: "Məhsullar",
    description: "Hər Strativu məhsulu real problemdən başlayır: risk və uyğunluq üçün GRC360, hakatonlar üçün HackOS, abituriyentlər üçün UniAz və tezliklə AI Proxy.",
  },
  "/az/products/ai-proxy": {
    title: "AI Proxy by Strativu: işdə AI, məlumat içəridə",
    description: "AI Proxy by Strativu, tezliklə: şirkətiniz ilə AI arasında həssas məlumatı içəridə saxlayan və öz AI-nızı hücumlardan qoruyan təhlükəsizlik qatı.",
  },
  "/az/products/hackos": {
    title: "HackOS by Strativu: hakaton idarəetmə platforması",
    description: "HackOS by Strativu hakatonun qeydiyyatını, komandalarını, mentorlarını, münsifliyini, nəticələrini və sertifikatlarını bir sistemdə idarə edir.",
  },
  "/az/products/uniaz": {
    title: "UniAz by Strativu: imtahan balı və universitet seçimi",
    description: "UniAz by Strativu: abituriyent və tələbələr üçün ödənişsiz platforma. DİM balını hesabla, keçid ballarını müqayisə et, ixtisas seç.",
  },
  "/az/products/grc360": {
    title: "GRC360 by Strativu: idarəetmə, risk və uyğunluq",
    description:
      "GRC360 by Strativu: risklər, nəzarətlər, siyasətlər və auditlər bir platformada, öz serverlərinizdə. 2027-ci ilin yanvarında açılır.",
  },
  "/az/products/grc360/early-access": {
    title: "GRC360 erkən giriş və demo",
    description: "GRC360 by Strativu 2027-ci ilin yanvarında açılır. Erkən girişə yazılın və ya risk və uyğunluq prosesinizə uyğun demo sifariş edin.",
  },
  "/az/about": {
    title: "Haqqımızda",
    description: "Strativu niyə var: texnologiya yalnız dəyər yaradanda önəmlidir. Missiyamız, vizyonumuz və işlədiyimiz prinsiplər.",
  },
  "/az/contact": {
    title: "Əlaqə",
    description: "Məhsul sualı, tərəfdaşlıq ideyası və ya həll edilməsini istədiyiniz problem? Strativu-ya yazın, doğru şəxs sizə cavab verəcək.",
  },
  "/az/contact/thank-you": {
    title: "Mesaj göndərildi",
    description: "Təşəkkürlər. Mesajınızı aldıq və tezliklə cavab verəcəyik.",
    noindex: true,
  },
};

export const NOT_FOUND_META: PageMeta = { title: "Page not found", description: "The page you asked for does not exist.", noindex: true };

/** Pathname → meta. Naməlum yol → null (səhifə 404 göstərir). */
export function metaFor(pathname: string): PageMeta | null {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return STATIC_META[path] ?? null;
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
export const ROUTES: string[] = Object.keys(STATIC_META);

/** Sitemap: yalnız indekslənən route-lar. */
export const SITEMAP_ROUTES: string[] = ROUTES.filter((r) => !metaFor(r)?.noindex);
