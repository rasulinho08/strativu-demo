/**
 * Two languages: English (default, no prefix) and Azerbaijani (/az/...). Plain functions (no JSX), so the build
 * (vite.config.ts) can use them too.
 * Only the pages in AZ_PATHS have an Azerbaijani version; every other page (GRC360 architecture, frameworks,
 * changelog, legal, security) stays English, and links to it from an /az page go to the English page.
 */
export type Lang = "en" | "az";
export type Pair<T = unknown> = { en: T; az: T };

/** English paths that also exist under /az. */
export const AZ_PATHS = new Set<string>([
  "/",
  "/products",
  "/products/cipher",
  "/products/grc360",
  "/products/grc360/early-access",
  "/about",
  "/contact",
  "/contact/thank-you",
]);

export const langOf = (pathname: string): Lang => (pathname === "/az" || pathname.startsWith("/az/") ? "az" : "en");
/** "/az/products" → "/products"; "/az" → "/". */
export const basePath = (pathname: string) => (langOf(pathname) === "az" ? pathname.slice(3) || "/" : pathname);
export const azPath = (base: string) => (base === "/" ? "/az" : `/az${base}`);

/** Where an internal link should go for a reader of `lang`: the /az twin when there is one, else the English page. */
export function localize(to: string, lang: Lang): string {
  if (lang !== "az" || !to.startsWith("/") || to.startsWith("//") || langOf(to) === "az") return to;
  const [path, rest = ""] = to.split(/(?=[?#])/);
  return AZ_PATHS.has(path) ? azPath(path) + rest : to;
}

/** The same page in the other language, or that language's home when the page has no twin. */
export function counterpart(pathname: string, target: Lang): string {
  const base = basePath(pathname);
  if (target === "az") return AZ_PATHS.has(base) ? azPath(base) : "/az";
  return langOf(pathname) === "en" ? pathname : base;
}

/** hreflang pair for a page: { en, az } paths when both exist, else null. */
export function alternates(pathname: string): { en: string; az: string } | null {
  const base = basePath(pathname);
  return AZ_PATHS.has(base) ? { en: base, az: azPath(base) } : null;
}
