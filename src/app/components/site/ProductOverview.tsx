import type { ReactNode } from "react";
import { Duo, Eyebrow, Rows, Section } from "./primitives";
import { Reveal } from "./Reveal";

/**
 * Building blocks of the short product pages (GRC360, HackOS, UniAz): what it does, the figures, and the closing
 * band that sends the visitor to the product's own website, where the details live.
 */

export function ProductPoints({ eyebrow, title, items }: { eyebrow: string; title: string; items: { title: string; body: string }[] }) {
  return (
    <Section className="pt-0 md:pt-0">
      <Duo
        head={
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="t-h2 max-w-[18ch] text-ink">{title}</h2>
          </Reveal>
        }
      >
        <Rows headingLevel={3} items={items} />
      </Duo>
    </Section>
  );
}

export function ProductFigures({
  items,
  note,
  extra,
  lang,
}: {
  items: { value: string; label: string }[];
  note?: string;
  extra?: string;
  lang: "en" | "az";
}) {
  return (
    <Section className="pt-0 md:pt-0">
      <dl className={`grid grid-cols-2 gap-x-8 gap-y-10 border-t border-line pt-10 ${items.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
        {items.map((f, i) => (
          <Reveal key={f.label} delay={i * 0.06}>
            <dt className="sr-only">{f.label}</dt>
            <dd>
              <span className="block text-[clamp(44px,5vw,72px)] font-semibold leading-none tracking-[-0.04em] text-ink">{f.value}</span>
              <span aria-hidden className="mt-3 block font-mono text-[12px] uppercase leading-[1.5] tracking-[0.12em] text-ink-3">
                {f.label.toLocaleUpperCase(lang)}
              </span>
            </dd>
          </Reveal>
        ))}
      </dl>
      {(extra || note) && (
        <div className="mt-10 max-w-[70ch] space-y-2">
          {extra && <p className="text-[16px] leading-[1.6] text-ink-2">{extra}</p>}
          {note && <p className="text-[13.5px] leading-[1.6] text-ink-3">{note}</p>}
        </div>
      )}
    </Section>
  );
}

export function ProductClosing({ title, body, children }: { title: string; body: string; children: ReactNode }) {
  return (
    <Section className="pt-0 md:pt-0">
      <Reveal>
        <div className="rounded-[var(--r-xl)] border border-line bg-surface px-6 py-12 text-center shadow-[var(--e1)] sm:px-12 md:py-16">
          <h2 className="t-h2 mx-auto max-w-[22ch] text-ink">{title}</h2>
          <p className="mx-auto mt-4 max-w-[52ch] text-[17px] leading-[1.65] text-ink-2">{body}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-3">{children}</div>
        </div>
      </Reveal>
    </Section>
  );
}
