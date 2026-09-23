import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-5 md:px-8 ${className}`}>{children}</div>;
}

/** Section rhythm: 96px desktop, 64px mobile. */
export function Section({
  children,
  className = "",
  id,
  tone = "ground",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "ground" | "surface" | "contrast";
  glow?: boolean;
}) {
  const tones = {
    ground: "",
    surface: "",
    contrast: "bg-[var(--ink)] text-[var(--ground)]",
  };
  return (
    <section id={id} className={`relative scroll-mt-24 py-20 md:py-32 ${tones[tone]} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

/**
 * Content lane. On desktop text stays in the left ~56% so the 3D logo on the right is never covered.
 * Use it for every page body; only go wider when a layout genuinely needs it.
 */
export function Lane({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`max-w-[640px] lg:max-w-[56%] ${className}`}>{children}</div>;
}

export type RowItem = {
  /** Small index shown on the left, e.g. "01". */
  n?: string;
  title: ReactNode;
  body?: ReactNode;
  /** Short right-aligned note, e.g. a status or date. */
  meta?: ReactNode;
  /** Internal route. */
  to?: string;
  /** External link. */
  href?: string;
};

/** Hairline-separated list: the default way to show a set of items (instead of cards). */
export function Rows({ items, className = "" }: { items: RowItem[]; className?: string }) {
  return (
    <ul className={`border-t border-line ${className}`}>
      {items.map((it, i) => {
        const cls = `group grid gap-x-4 border-b border-line py-7 ${
          it.n ? "grid-cols-[48px_1fr] md:grid-cols-[64px_1fr]" : "grid-cols-1"
        }`;
        const linked = Boolean(it.to || it.href);
        const inner = (
          <>
            {it.n && <span className="pt-1.5 font-mono text-[13px] text-ink-3">{it.n}</span>}
            <span className="min-w-0">
              <span className="flex items-baseline justify-between gap-4">
                <span className={`t-h3 block text-ink transition-colors duration-300 ${linked ? "group-hover:text-brand" : ""}`}>
                  {it.title}
                </span>
                {it.meta && <span className="shrink-0 text-[13px] text-ink-3">{it.meta}</span>}
              </span>
              {it.body && <span className="mt-2 block max-w-[52ch] text-[16px] leading-[1.6] text-ink-2">{it.body}</span>}
            </span>
          </>
        );
        return (
          <Reveal as="li" key={i} delay={Math.min(i, 4) * 0.06}>
            {it.to ? (
              <Link to={it.to} className={cls}>
                {inner}
              </Link>
            ) : it.href ? (
              <a href={it.href} target={it.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={cls}>
                {inner}
              </a>
            ) : (
              <div className={cls}>{inner}</div>
            )}
          </Reveal>
        );
      })}
    </ul>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow mb-4 ${className}`}>{children}</p>;
}

/** Index marker used beside section headings: 01 / 02 / 03. */
export function Index({ n, className = "" }: { n: string; className?: string }) {
  return <span className={`font-mono text-[12px] text-ink-3 tabular ${className}`}>{n}</span>;
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} mb-12 max-w-[820px] md:mb-16 ${className}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="t-h2 text-ink">{title}</h2>
      {lead && <p className={`t-lead mt-4 ${align === "center" ? "mx-auto" : ""} measure`}>{lead}</p>}
    </div>
  );
}

type BtnProps = {
  to?: string;
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "invert";
  size?: "sm" | "md" | "lg";
  className?: string;
  arrow?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

export function Btn({
  to,
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  arrow,
  type,
  disabled,
  onClick,
}: BtnProps) {
  const base =
    "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60 disabled:pointer-events-none";
  const sizes = {
    sm: "h-10 px-4.5 text-[13.5px]",
    md: "h-11 px-5 text-[14.5px]",
    lg: "h-13 px-7 text-[15.5px]",
  };
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-ink",
    secondary: "border border-line-strong text-ink hover:border-ink-3",
    ghost: "text-ink-2 hover:text-ink hover:bg-surface-2",
    invert: "bg-[var(--ground)] text-[var(--ink)] hover:bg-[var(--surface-2)]",
  };
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  const inner = (
    <>
      {children}
      {arrow && <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" strokeWidth={2} />}
    </>
  );

  if (to)
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    );
  if (href)
    return (
      <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        {inner}
      </a>
    );
  return (
    <button type={type ?? "button"} className={cls} disabled={disabled} onClick={onClick}>
      {inner}
    </button>
  );
}

export function TextLink({
  to,
  href,
  children,
  className = "",
}: {
  to?: string;
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  const cls = `group inline-flex items-center gap-1.5 text-[14.5px] font-medium text-brand-ink transition-colors hover:text-brand ${className}`;
  const inner = (
    <>
      <span className="link-line">{children}</span>
      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" strokeWidth={2} />
    </>
  );
  if (href)
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {inner}
      </a>
    );
  return (
    <Link to={to ?? "/"} className={cls}>
      {inner}
    </Link>
  );
}

export function StatusChip({ status }: { status: "supported" | "in-progress" | "planned" }) {
  const map = {
    supported: "bg-ok-soft text-ok border-transparent",
    "in-progress": "bg-brand-soft text-brand-ink border-transparent",
    planned: "bg-transparent text-ink-3 border-line",
  };
  const label = { supported: "Supported", "in-progress": "Mapping", planned: "Planned" };
  return (
    <span className={`inline-flex h-[22px] items-center rounded-[6px] border px-2 text-[11.5px] font-medium ${map[status]}`}>
      {label[status]}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="relative pb-12 pt-36 md:pb-16 md:pt-48">
      <Container>
        <Lane>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="t-h1 text-ink">{title}</h1>
          {lead && <p className="t-lead mt-6 max-w-[48ch]">{lead}</p>}
          {children && <div className="mt-10">{children}</div>}
        </Lane>
      </Container>
    </header>
  );
}

export function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`prose-strativu measure text-[16.5px] leading-[1.7] text-ink-2 [&_code]:rounded-[4px] [&_code]:bg-surface-2 [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.86em] [&_h2]:mb-4 [&_h2]:mt-14 [&_h2]:text-[26px] [&_h2]:text-ink [&_h3]:mb-3 [&_h3]:mt-9 [&_h3]:text-[19px] [&_h3]:text-ink [&_li]:mb-2 [&_p]:mb-5 [&_strong]:text-ink [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-5 ${className}`}
    >
      {children}
    </div>
  );
}
