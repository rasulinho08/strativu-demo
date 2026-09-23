import { Btn, Container, Section, SectionHead, TextLink, Eyebrow, Index } from "../components/site/primitives";
import { Reveal, Stagger, WordsIn, ScrollLift } from "../components/site/Reveal";
import { Ambience, Strip, SpotlightCard, StatusPill, GradientRule } from "../components/site/fx";
import { HeroMock, MockById } from "../components/site/ProductMock";
import { CoverageGrid } from "../components/site/CoverageGrid";
import { LogoWall, StatsRow, TestimonialBand } from "../components/site/Proof";
import { ClosingCTA } from "../components/site/ClosingCTA";
import { usePageMeta } from "../components/site/Seo";
import { capabilities } from "../data/capabilities";
import { frameworks } from "../data/coverage";
import { site } from "../data/site";

const THESIS = [
  {
    n: "01",
    title: "Evidence should be collected by the system, not the team.",
    body: "If a control is proved by a configuration, the platform should read that configuration on a schedule. People review exceptions; they do not take screenshots.",
  },
  {
    n: "02",
    title: "One control set is enough. Frameworks are views on it.",
    body: "ISO 27001, SOC 2 and NIST CSF ask overlapping questions. Maintaining a register per framework is how the same control ends up with three different answers.",
  },
  {
    n: "03",
    title: "The audit trail is the product, not a feature of it.",
    body: "In GRC software every other screen is a projection of what changed, by whom, and when. That log has to be complete and tamper-evident from the first commit.",
  },
];

/** Bento: two wide cells lead, four standard cells follow. */
const BUILT = [
  {
    k: "Tenancy",
    v: "Row-level isolation with a per-tenant encryption key, enforced at the data layer. No tenant identifier is ever a request parameter.",
    span: "lg:col-span-3",
    mono: "isolation: row-level · key: per-tenant",
  },
  {
    k: "Audit trail",
    v: "Append-only, hash-chained log of every write. Actor, tenant, object, before/after diff. Verifiable without trusting the application.",
    span: "lg:col-span-3",
    mono: "chain: sha256 · gaps: 0",
  },
  {
    k: "Permissions",
    v: "Role- and attribute-based. Auditors get scoped, read-only, time-boxed sessions that are themselves logged.",
    span: "lg:col-span-2",
    mono: "rbac + abac",
  },
  {
    k: "API-first",
    v: "Every screen is built on the public API. Nothing in the UI is possible that is not possible through the API.",
    span: "lg:col-span-2",
    mono: "openapi 3.1",
  },
  {
    k: "Data residency",
    v: "EU (Frankfurt) at launch. Region is fixed per tenant at creation and cannot move silently.",
    span: "lg:col-span-2",
    mono: "eu-central-1",
  },
  {
    k: "Evidence integrity",
    v: "Every artefact is hashed on ingest and re-verified on read. A changed file is flagged, never quietly replaced.",
    span: "lg:col-span-6",
    mono: "verify on ingest · verify on read",
  },
];

export default function Home() {
  usePageMeta(
    null,
    "Strativu is building a GRC platform where one control set satisfies every framework and evidence is collected by the system, not the team. In development. Early access opening 2027."
  );

  return (
    <>
      {/* ── 01 Hero ── */}
      <section className="relative isolate overflow-hidden pb-14 pt-28 md:pb-16 md:pt-36">
        <Ambience className="-z-10" />
        <Container>
          <div className="max-w-[760px]">
            <Stagger>
              <StatusPill label={site.status.label} detail={site.status.detail} />
              <div className="mt-6">
                <WordsIn text="Compliance evidence, engineered." className="t-display text-ink" />
              </div>
              <p className="t-lead mt-5 max-w-[60ch]">
                Strativu is building a GRC platform where one control set satisfies every framework and evidence is
                collected by the system, not the team. First product: GRC. The same model underneath everything that
                follows.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Btn to="/early-access" size="lg" arrow>
                  Request early access
                </Btn>
                <Btn to="/platform" size="lg" variant="secondary">
                  See the platform
                </Btn>
              </div>
            </Stagger>
          </div>

          <ScrollLift className="mt-14 md:mt-20">
            <HeroMock />
          </ScrollLift>
          <p className="mt-4 font-mono text-[11px] text-ink-3">
            Target interface: control register and control detail. Names and IDs are illustrative.
          </p>
        </Container>

        {/* frameworks */}
        <div className="mt-14 border-y border-line bg-surface/50 py-5 md:mt-20">
          <Container>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
              <span className="shrink-0 text-[12.5px] font-medium text-ink-3">Frameworks</span>
              <Strip items={frameworks.map((f) => f.id.split(" (")[0])} />
            </div>
          </Container>
        </div>
      </section>

      {/* ── 02 Logo wall (mock; toggle in site.ts) ── */}
      <LogoWall />

      {/* ── 03 Positions ── */}
      <Section>
        <SectionHead
          eyebrow="What we believe"
          title={
            <>
              Three positions the product is built on.
            </>
          }
        />
        <ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {THESIS.map((t, i) => (
            <Reveal as="li" key={t.n} delay={i * 0.08}>
              <SpotlightCard className="flex h-full flex-col p-7 md:p-8">
                <span className="font-mono text-[12px] text-ink-3">{t.n}</span>
                <h3 className="mt-5 text-[19px] leading-[1.3] tracking-[-0.015em] text-ink">{t.title}</h3>
                <p className="mt-4 text-[15px] leading-[1.6] text-ink-2">{t.body}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* ── 04 The problem — the one dark band on the page ── */}
      <section className="relative isolate overflow-hidden border-y border-transparent bg-[#080B12]/88 py-20 text-[#E7ECF4] backdrop-blur-md dark:border-line dark:bg-[#111826]/85 md:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="eyebrow mb-4 !text-white/60">The problem</p>
                <h2 className="t-h2 text-white">
                  The register lives in a spreadsheet, and the spreadsheet is the product.
                </h2>
                <div className="mt-10 hidden lg:block">
                  <div className="rounded-[var(--r-md)] border border-white/10 bg-white/[0.04] p-5 font-mono text-[12px] leading-[1.9] text-white/60">
                    <div>iso-27001-controls-v7-FINAL.xlsx</div>
                    <div>soc2-matrix-2026-copy.xlsx</div>
                    <div>evidence-q3/screenshots/…</div>
                    <div className="text-white/30">access-review-final-final.pdf</div>
                  </div>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal delay={0.1}>
                <div className="measure space-y-6 text-[16.5px] leading-[1.7] text-white/65">
                  <p>
                    A team audited against ISO 27001 and SOC 2 keeps two control matrices. Each row says roughly the same
                    thing in a different vocabulary: <span className="font-mono text-[14px] text-white">A.5.17</span>{" "}
                    here, <span className="font-mono text-[14px] text-white">CC6.1</span> there. When the MFA policy
                    changes, both rows have to change, and one of them will not.
                  </p>
                  <p>
                    Six weeks before the audit window, evidence collection starts. Screenshots of IAM consoles, exports of
                    access reviews, PDFs of policies with a date typed into the footer. Each artefact is named by whoever
                    collected it and filed in a folder only they understand.
                  </p>
                  <p>
                    The auditor asks for a population and a sample. Nobody can say with certainty that the population is
                    complete, because the system of record is a folder. The finding is not that a control failed. It is
                    that the control cannot be shown.
                  </p>
                  <GradientRule className="!my-8 !bg-white/15" />
                  <p className="text-[18px] leading-[1.6] text-white">
                    Strativu starts from the other end: a control register that is the system of record, evidence attached
                    by machines, and a log that answers “can you show me?” without a scramble.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 05 Capabilities ── */}
      <Section tone="surface" id="capabilities">
        <div className="space-y-20 md:space-y-28">
          {capabilities.map((c, i) => {
            const Mock = MockById[c.id];
            const flip = i % 2 === 1;
            return (
              <div key={c.id} className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
                <Reveal className={`lg:col-span-5 ${flip ? "lg:order-2 lg:col-start-8" : ""}`}>
                  <div className="flex items-center gap-3">
                    <Index n={`0${i + 1}`} />
                    <span className="eyebrow !mb-0">{c.eyebrow}</span>
                  </div>
                  <h2 className="t-h2 mt-5 text-ink">{c.title}</h2>
                  <p className="mt-5 text-[16.5px] leading-[1.65] text-ink-2">{c.body}</p>
                  {site.proof.stats && c.metric && (
                    <p className="mt-8 flex items-baseline gap-3 border-t border-line pt-6">
                      <span className="tabular text-[32px] font-semibold leading-none tracking-[-0.03em] text-ink">{c.metric.value}</span>
                      <span className="text-[14px] text-ink-2">{c.metric.label}</span>
                    </p>
                  )}
                  <div className="mt-7">
                    <TextLink to={c.link.href}>{c.link.label}</TextLink>
                  </div>
                </Reveal>
                <Reveal className={`lg:col-span-7 ${flip ? "lg:order-1" : ""}`} delay={0.12}>
                  <Mock />
                </Reveal>
              </div>
            );
          })}
        </div>
        <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-8">
          <TextLink to="/platform">The platform model</TextLink>
          <TextLink to="/platform/grc">The GRC product in detail</TextLink>
        </div>
      </Section>

      {/* ── 06 Coverage ── */}
      <Section id="coverage">
        <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>Coverage</Eyebrow>
            <h2 className="t-h2 text-ink">
              Navigate by the standard your auditor asks about.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-[16px] leading-[1.6] text-ink-2">
              Each framework maps onto the shared control set. Status is stated honestly per framework: supported now,
              being mapped, or planned.
            </p>
            <div className="mt-5">
              <TextLink to="/coverage">All {frameworks.length} frameworks</TextLink>
            </div>
          </div>
        </div>
        <CoverageGrid limit={4} />
      </Section>

      {/* ── 07 Stats + testimonials (mock; toggle in site.ts) ── */}
      {(site.proof.stats || site.proof.testimonials) && (
        <Section tone="surface">
          <div className="space-y-10">
            <StatsRow />
            <TestimonialBand />
          </div>
        </Section>
      )}

      {/* ── 08 How it is built — bento ── */}
      <Section id="architecture">
        <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>How it is built</Eyebrow>
            <h2 className="t-h2 text-ink">
              Engineered, not assembled.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-[16px] leading-[1.6] text-ink-2">
              Written for the engineer who has to sign off on the vendor review. The full design notes are on the
              architecture page.
            </p>
            <div className="mt-5">
              <TextLink to="/platform/architecture">Architecture</TextLink>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {BUILT.map((b, i) => (
            <Reveal key={b.k} delay={Math.min(i, 5) * 0.05} className={b.span}>
              <SpotlightCard className="flex h-full flex-col justify-between p-7">
                <div>
                  <h3 className="text-[17px] font-medium tracking-[-0.015em] text-ink">{b.k}</h3>
                  <p className="mt-3 text-[15px] leading-[1.6] text-ink-2">{b.v}</p>
                </div>
                <p className="mt-6 border-t border-line-soft pt-4 font-mono text-[12px] text-ink-3">
                  {b.mono}
                </p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-8">
          <TextLink to="/changelog">Public build log</TextLink>
          <TextLink to="/company/about">Who is building this</TextLink>
          <TextLink to="/trust">Trust and data handling</TextLink>
        </div>
      </Section>

      {/* ── 09 Closing ── */}
      <ClosingCTA />
    </>
  );
}
