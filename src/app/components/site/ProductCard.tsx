import { Link } from "react-router";
import { moreToCome, productLink, products, type Product } from "../../data/products";
import { Reveal } from "./Reveal";

/**
 * Product card (Website Blueprint v2): name, status, one-sentence description, link.
 * The corporate site is monochrome; a product's own colour (products.ts → color) shows only here, as a thin top line
 * and the status dot. A card linking to the product's own site (href) opens it in a new tab and shows ↗.
 * The whole card is clickable (stretched link), but only the link text is the focus target.
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

/** All products + the "More to come" card. One column on phones, three from md. */
export function ProductGrid({ compact = false, headingLevel = 3 }: { compact?: boolean; headingLevel?: 2 | 3 }) {
  const list = [...products, moreToCome];
  return (
    <ul className={`grid grid-cols-1 gap-4 md:grid-cols-3 ${compact ? "" : "md:gap-5"}`}>
      {list.map((p, i) => (
        <Reveal as="li" key={p.name} delay={i * 0.06} className="min-w-0">
          <ProductCard p={p} compact={compact} headingLevel={headingLevel} />
        </Reveal>
      ))}
    </ul>
  );
}
