import { site } from "../../data/site";
import { logoWall, stats, testimonials } from "../../data/proof";
import { Container } from "./primitives";
import { Reveal } from "./Reveal";
import { SpotlightCard } from "./fx";

/**
 * MOCK sübut blokları. Hər biri site.ts → proof ilə söndürülə bilər.
 * Söndürüləndə yerində boşluq qalmır; layout dəyişmir.
 */

export function LogoWall() {
  if (!site.proof.logoWall) return null;
  return (
    <div className="border-b border-line py-10 md:py-12">
      <Container>
        <Reveal>
          <p className="mb-6 text-center text-[12.5px] font-medium text-ink-3">{logoWall.heading}</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {logoWall.logos.map((name) => (
              <li key={name} className="text-[16px] font-semibold tracking-[-0.01em] text-ink-3">
                {name}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </div>
  );
}

export function StatsRow() {
  if (!site.proof.stats) return null;
  return (
    <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.04}>
          <SpotlightCard className="h-full p-6">
            <dd className="tabular text-[36px] font-semibold leading-none tracking-[-0.03em] text-ink md:text-[44px]">{s.value}</dd>
            <dt className="mt-4 text-[14px] leading-[1.5] text-ink-2">{s.label}</dt>
          </SpotlightCard>
        </Reveal>
      ))}
    </dl>
  );
}

export function TestimonialBand() {
  if (!site.proof.testimonials) return null;
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {testimonials.map((t, i) => (
        <Reveal as="li" key={i} delay={i * 0.05}>
          <SpotlightCard className="flex h-full flex-col p-6 md:p-7">
            <blockquote className="flex-1 text-[15.5px] leading-[1.6] text-ink">“{t.quote}”</blockquote>
            <div className="mt-6 border-t border-line-soft pt-4">
              <div className="text-[14px] font-medium text-ink">{t.name}</div>
              <div className="mt-0.5 text-[13px] text-ink-3">{t.company}</div>
            </div>
          </SpotlightCard>
        </Reveal>
      ))}
    </ul>
  );
}
