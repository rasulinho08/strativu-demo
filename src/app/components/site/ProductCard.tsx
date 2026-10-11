import { Link } from "react-router";
import { moreToCome, productLink, products, type Product } from "../../data/products";
import { screenSrcSet } from "../../data/grc360";
import { Reveal } from "./Reveal";

/**
 * Product card (Website Blueprint v2): name, status, one-sentence description, link.
 * A product's own colour (products.ts → color) shows as a thin top line and the status dot.
 * A card linking to the product's own site (href) opens it in a new tab and shows ↗.
 * The whole card is clickable (stretched link), but only the link text is the focus target.
 * A `featured` product gets the large card (FeaturedProductCard): full width, with a screen from the product.
 */
export function ProductCard({ p, compact = false, headingLevel = 3 }: { p: Product; compact?: boolean; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as const;
  const link = productLink(p);
  const isMore = p === moreToCome;
  const arrow = p.arrow === false ? null : link.href ? "↗" : "→";
  const linkCls =
    "relative inline-flex items-center gap-1.5 text-[14.5px] font-medium text-brand-ink after:absolute after:-inset-x-[100vw] after:-inset-y-[100vh] after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-4";
  const linkInner = (
    <>
      <span className="link-line">{link.label}</span>
      {/* names the product for screen readers ("Learn more: GRC360") */}
      {!isMore && <span className="sr-only">: {p.name}</span>}
      {arrow && (
        <span aria-hidden className="transition-transform duration-150 group-hover:translate-x-0.5">
          {arrow}
        </span>
      )}
      {link.href && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );

  return (
    <article
      className={`group relative isolate flex h-full flex-col overflow-hidden rounded-[var(--r-xl)] border bg-surface transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-[var(--e2)] ${
        isMore ? "border-dashed border-line-strong bg-transparent" : "border-line"
      } ${compact ? "p-6" : "p-6 md:p-8"}`}
    >
      {p.color && <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: p.color }} />}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="flex min-w-0 items-center gap-3">
          {p.mark && (
            <img src={p.mark.src} width={p.mark.width} height={p.mark.height} alt="" className="h-8 w-8 shrink-0" decoding="async" />
          )}
          <H className={`${compact ? "text-[22px]" : "t-h3"} font-semibold leading-[1.15] tracking-[-0.02em] text-ink`}>{p.name}</H>
        </div>
        {p.status && (
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2">
            <span
              aria-hidden
              className={`h-1.5 w-1.5 rounded-full ${p.color ? "" : "border border-ink-3"}`}
              style={p.color ? { background: p.color } : undefined}
            />
            {p.status}
          </span>
        )}
      </div>
      {p.statusNote && <p className="mt-3 font-mono text-[12px] tracking-[0.04em] text-ink-3">{p.statusNote}</p>}
      <p className={`${p.statusNote ? "mt-4" : "mt-5"} max-w-[40ch] text-[16px] leading-[1.6] text-ink-2`}>{p.summary}</p>
      <div className={`mt-auto ${compact ? "pt-8" : "pt-10"}`}>
        {link.href ? (
          <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
            {linkInner}
          </a>
        ) : (
          <Link to={link.to ?? "/products"} className={linkCls}>
            {linkInner}
          </Link>
        )}
      </div>
    </article>
  );
}

/* ── Large card for a featured product: text and a call to action on one side, a screen from the product on the other ── */
function FeaturedProductCard({ p, compact = false, headingLevel = 3 }: { p: Product; compact?: boolean; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as const;
  const link = productLink(p);
  const linkCls =
    "relative inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-[15px] font-medium text-on-brand transition-colors group-hover:bg-brand-hover after:absolute after:-inset-x-[100vw] after:-inset-y-[100vh] after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-4";
  const linkInner = (
    <>
      <span>{link.label}</span>
      <span className="sr-only">: {p.name}</span>
      <span aria-hidden className="transition-transform duration-150 group-hover:translate-x-0.5">
        {link.href ? "↗" : "→"}
      </span>
      {link.href && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );
  const tint = p.color ?? "var(--brand)";

  return (
    <article className="group relative isolate grid overflow-hidden rounded-[var(--r-xl)] border border-line bg-surface shadow-[var(--e2)] transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-[var(--e3)] md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {p.color && <span aria-hidden className="absolute inset-x-0 top-0 z-10 h-[3px]" style={{ background: p.color }} />}
      <div className={`flex flex-col ${compact ? "p-6 md:p-9" : "p-7 md:p-10 lg:p-12"}`}>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          {p.mark && (
            <img src={p.mark.src} width={p.mark.width} height={p.mark.height} alt="" className="h-11 w-11 shrink-0" decoding="async" />
          )}
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: tint }} />
            {p.status}
            {p.statusNote && <span className="normal-case tracking-[0.04em] text-ink-3">· {p.statusNote}</span>}
          </span>
        </div>
        <H className={`${compact ? "mt-7" : "mt-9"} text-[clamp(34px,3.8vw,52px)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink`}>
          {p.name}
        </H>
        <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.12em] text-ink-3">by Strativu</p>
        <p className="mt-6 max-w-[34ch] text-[18px] leading-[1.55] text-ink-2">{p.summary}</p>
        {p.facts && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {p.facts.map((f) => (
              <li key={f} className="rounded-full border border-line px-3 py-1 text-[13px] text-ink-2">
                {f}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-10">
          {link.href ? (
            <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
              {linkInner}
            </a>
          ) : (
            <Link to={link.to ?? "/products"} className={linkCls}>
              {linkInner}
            </Link>
          )}
        </div>
      </div>
      {p.image && (
        // A screen from the product, cropped at the edges. Not a link target of its own: clicks fall through to the card link.
        <div
          className={`pointer-events-none relative aspect-[16/11] overflow-hidden border-t border-line md:aspect-auto md:border-l md:border-t-0 ${
            compact ? "md:min-h-[400px]" : "md:min-h-[460px]"
          }`}
          style={{
            background: `radial-gradient(120% 90% at 100% 0%, color-mix(in srgb, ${tint} 20%, transparent), transparent 62%), var(--surface-2)`,
          }}
        >
          <img
            src={p.image.src}
            srcSet={screenSrcSet(p.image.src)}
            sizes="(min-width: 1200px) 780px, (min-width: 768px) 68vw, 115vw"
            width={p.image.width}
            height={p.image.height}
            alt={p.image.alt}
            loading={compact ? "lazy" : undefined}
            decoding="async"
            className="absolute left-[7%] top-[9%] h-auto w-[118%] max-w-none rounded-[var(--r-lg)] border border-line shadow-[var(--e3)] transition-transform duration-500 ease-out group-hover:-translate-y-1.5"
          />
        </div>
      )}
    </article>
  );
}

/** All products + the "More to come" card. A featured product spans the full width; the rest sit two to a row from md. */
export function ProductGrid({ compact = false, headingLevel = 3 }: { compact?: boolean; headingLevel?: 2 | 3 }) {
  const list = [...products.filter((p) => p.featured), ...products.filter((p) => !p.featured), moreToCome];
  return (
    <ul className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${compact ? "" : "md:gap-5"}`}>
      {list.map((p, i) => (
        <Reveal as="li" key={p.name} delay={i * 0.06} className={`min-w-0 ${p.featured ? "md:col-span-2" : ""}`}>
          {p.featured ? (
            <FeaturedProductCard p={p} compact={compact} headingLevel={headingLevel} />
          ) : (
            <ProductCard p={p} compact={compact} headingLevel={headingLevel} />
          )}
        </Reveal>
      ))}
    </ul>
  );
}
