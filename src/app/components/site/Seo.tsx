import { useEffect } from "react";
import { useLocation } from "react-router";
import { site } from "../../data/site";
import { fullTitle, metaFor, NOT_FOUND_META } from "../../data/meta";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Per-route <title>, description, canonical, robots and Open Graph tags, from src/app/data/meta.ts
 * (the same data the build uses for the static per-route heads). Called once, in Layout.
 * Unknown paths get the 404 meta: robots noindex and no canonical.
 */
export function useRouteMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = metaFor(pathname) ?? NOT_FOUND_META;
    const title = fullTitle(meta);
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
    const url = `${site.domain}${path}`;
    const image = `${site.domain}${site.ogImage}`;
    document.title = title;
    upsertMeta("name", "description", meta.description);
    upsertMeta("name", "robots", meta.noindex ? "noindex" : "index, follow");
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", meta.ogDescription ?? meta.description);
    upsertMeta("property", "og:image", image);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", meta.description);
    upsertMeta("name", "twitter:image", image);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    let ogUrl = document.head.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (meta.noindex) {
      canonical?.remove();
      ogUrl?.remove();
      return;
    }
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
    if (!ogUrl) {
      ogUrl = document.createElement("meta");
      ogUrl.setAttribute("property", "og:url");
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute("content", url);
  }, [pathname]);
}
