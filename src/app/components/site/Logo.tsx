import { Link } from "react-router";
import { site } from "../../data/site";

/**
 * Strativu logo.
 * Light theme: full PNG logo (mark + wordmark) from public/brand/logo-full.png.
 * Dark theme: the mark alone plus a CSS wordmark, because the PNG wordmark is dark blue
 * and disappears on a dark background. Set site.logo.darkSrc to a light-on-dark file to
 * override this fallback.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-semibold text-[19px] leading-none tracking-[-0.02em] text-ink ${className}`}
    >
      Strativu
    </span>
  );
}

/**
 * `animate` (header only): once per page load the mark drops in with a turn, then the wordmark wipes in from the left.
 * The full PNG is drawn twice, clipped to the mark and to the wordmark, so both parts move separately without a new
 * asset (theme.css → .logo-anim-*). Reduced motion: shown at once.
 */
export function Logo({ className = "", to = "/", animate = false }: { className?: string; to?: string; animate?: boolean }) {
  const h = site.logo.height;
  const mark = animate ? "logo-anim-mark" : "";
  const word = animate ? "logo-anim-word" : "";
  return (
    <Link to={to} aria-label={`${site.name} home`} className={`group inline-flex items-center gap-2 ${className}`}>
      <span className="relative dark:hidden">
        <img
          src={site.logo.src}
          alt={site.name}
          height={h}
          width={Math.round(h * 4.19)}
          style={{ height: h, width: "auto" }}
          className={`block ${animate ? "logo-clip-word" : ""} ${word}`}
          decoding="async"
        />
        {animate && (
          <img
            src={site.logo.src}
            alt=""
            aria-hidden
            height={h}
            width={Math.round(h * 4.19)}
            style={{ height: h, width: "auto" }}
            className={`logo-clip-mark absolute inset-0 block ${mark}`}
            decoding="async"
          />
        )}
      </span>
      {site.logo.darkSrc ? (
        <img
          src={site.logo.darkSrc}
          alt={site.name}
          height={h}
          style={{ height: h, width: "auto" }}
          className="hidden dark:block"
          decoding="async"
        />
      ) : (
        <span className="hidden items-center gap-2 dark:inline-flex">
          <img
            src={site.logo.mark}
            alt=""
            aria-hidden
            height={h}
            width={Math.round((h * 207) / 144)}
            style={{ height: h, width: "auto" }}
            className={mark}
            decoding="async"
          />
          <Wordmark className={word} />
        </span>
      )}
    </Link>
  );
}
