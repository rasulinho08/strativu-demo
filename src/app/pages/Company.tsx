import { Link } from "react-router";
import { Duo, Eyebrow, PageHeader, Rows, Section, TextLink } from "../components/site/primitives";
import { Reveal } from "../components/site/Reveal";
import { InstagramFeed } from "../components/site/InstagramFeed";
import { site } from "../data/site";
import { GRC } from "../data/grc360";
import { Split, SystemLog } from "../components/site/Visuals";

/**
 * About Us (/about) and Security (/trust).
 * About: Story, Mission · Vision, Principles — copy from the Website Blueprint v2, verbatim. No team section.
 * Two-sided layouts (Duo / Split). Facts are hairline Rows; no cards, no icon boxes.
 */

const BODY = "max-w-[52ch] text-[17px] leading-[1.65] text-ink-2";
/** Links inside running text: always underlined (not by colour alone, WCAG 1.4.1). */
const INLINE_LINK =
  "text-brand-ink underline decoration-[color-mix(in_srgb,currentColor_45%,transparent)] underline-offset-4 transition-colors hover:decoration-current";
const MAILTO = `mailto:${site.company.email}`;

/** Mission · Vision and Principles (Website Blueprint v2 → 05 About Us). */
const MISSION_VISION = [
  { k: "Mission", v: "To find meaningful problems across markets and build products that create real, measurable value." },
  {
    k: "Vision",
    v: "A trusted ecosystem of products, each solving one problem well, together improving how people and businesses work.",
  },
];

const PRINCIPLES = [
  { n: "01", title: "Problem first", body: "We start with the problem, never the technology." },
  { n: "02", title: "Value is measured", body: "If we can't show the value, we're not done." },
  { n: "03", title: "Simplicity", body: "We handle the complexity so users don't have to." },
  { n: "04", title: "Trust", body: "We build responsibly and say what's ready and what isn't." },
];

export function About() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Why Strativu exists"
        lead="Strativu is built on one belief: technology only matters when it creates value. Too many products start with what technology can do. We start with what people and businesses need."
      />

      <Section>
        <Duo
          head={
            <Reveal>
              <Eyebrow>Story</Eyebrow>
              <h2 className="t-h2 text-ink">Why an ecosystem</h2>
            </Reveal>
          }
        >
          <Reveal delay={0.06}>
            <p className={BODY}>
              That's why Strativu is an ecosystem, not a single product or a single industry. Wherever we find a meaningful problem,
              we build a focused product to solve it. Today our products serve organisations in governance and digital security.
              Tomorrow, they may serve entirely different markets.
            </p>
          </Reveal>
        </Duo>
      </Section>

      <Section className="pt-0 md:pt-0">
        <Reveal>
          <h2 className="eyebrow">Mission · Vision</h2>
        </Reveal>
        <dl className="mt-10 grid grid-cols-1 border-t border-line md:grid-cols-2">
          {MISSION_VISION.map((m, i) => (
            <Reveal key={m.k} delay={i * 0.08} className={`border-b border-line py-10 md:border-b-0 md:py-12 ${i ? "md:border-l md:pl-12" : "md:pr-12"}`}>
              <dt className="mono-label">{m.k}</dt>
              <dd className="mt-5 max-w-[30ch] text-[clamp(22px,2.3vw,30px)] font-medium leading-[1.3] tracking-[-0.015em] text-ink">{m.v}</dd>
            </Reveal>
          ))}
        </dl>
      </Section>

      <Section className="pt-0 md:pt-0">
        <Duo
          sticky
          head={
            <Reveal>
              <Eyebrow>Principles</Eyebrow>
              <h2 className="t-h2 text-ink">How we work</h2>
            </Reveal>
          }
        >
          <Rows headingLevel={3} items={PRINCIPLES} />
        </Duo>
      </Section>

      {/* Instagram postları — token yoxdursa bu bölmə görünmür (bax: api/instagram.ts) */}
      <InstagramFeed />
    </>
  );
}

/** "At a glance" on /trust — only facts that are verified or already stated on this site. Review with every change. */
const TRUST_REVIEWED = "2026-10-08";
const TRUST_GLANCE: { k: string; status?: "Yes" | "Not yet" | "Planned"; v?: string }[] = [
  { k: "Certification (ISO 27001, SOC 2)", status: "Not yet" },
  { k: "External penetration test", status: "Not yet" },
  { k: "Data processing agreement", v: "Signed before any personal data is processed. Draft on request." },
  { k: "Vulnerability disclosure policy", status: "Yes", v: "See below." },
  { k: "Deletion on request", v: "Tenant data, within 30 days." },
  { k: "Data export", status: "Yes", v: "CSV export on every register." },
  { k: "Single sign-on", status: "Yes", v: "SAML, OAuth, LDAP / Active Directory." },
  { k: "On-premise and air-gapped install", status: "Yes", v: "Docker Compose." },
  { k: "Public status page", status: "Not yet" },
];

export function Trust() {
  return (
    <>
      <PageHeader
        eyebrow="Security"
        title="How we handle data, before we are certified."
        lead="Our products serve organisations in governance and digital security, so we should model the behaviour we build for. Here is what is true now, what we are pursuing, and when."
      />
      <Section className="pt-0 md:pt-0">
        <Duo
          head={
            <Reveal>
              <Eyebrow>At a glance</Eyebrow>
              <h2 className="t-h2 text-ink">Short answers first.</h2>
              <p className="mt-5 text-[14px] text-ink-3">
                Last reviewed: <time dateTime={TRUST_REVIEWED}>{TRUST_REVIEWED}</time>
              </p>
              <p className="mt-2 max-w-[40ch] text-[14px] leading-[1.6] text-ink-3">Product rows refer to GRC360 by Strativu.</p>
            </Reveal>
          }
        >
          <Reveal>
            <dl className="border-t border-line">
              {TRUST_GLANCE.map((g) => (
                <div key={g.k} className="grid grid-cols-1 gap-x-8 gap-y-1 border-b border-line py-4 sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
                  <dt className="text-[15px] font-medium text-ink">{g.k}</dt>
                  <dd className="text-[15px] leading-[1.6] text-ink-2">
                    {g.status && <span className={`mr-2 font-medium ${g.status === "Yes" ? "text-ink" : "text-ink-2"}`}>{g.status}</span>}
                    {g.v}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Duo>
      </Section>
      <Section className="pt-0 md:pt-0">
        <Split sticky visual={<Reveal><SystemLog /></Reveal>}>
          <Rows
            headingLevel={2}
            items={[
              {
                title: "Architecture",
                body: (
                  <>
                    Tenant isolation at the query level, covered by regression tests; permissions per module and action, checked on the server; and a per-tenant system log.{" "}
                    <Link to={GRC.architecture} className={INLINE_LINK}>
                      Architecture notes
                    </Link>
                  </>
                ),
              },
              {
                title: "Hosting",
                body: "Multi-tenant cloud, or on-premise and air-gapped in your own data centre.",
              },
              {
                title: "Subprocessors",
                body: "The named list goes to early-access tenants and will be public at launch.",
              },
              {
                title: "Certifications",
                body: "None yet. We are pursuing ISO/IEC 27001:2022 certification and a SOC 2 Type II report, targeted within twelve months of general availability.",
              },
              {
                id: "vulnerability-disclosure",
                title: "Vulnerability disclosure",
                body: (
                  <>
                    Email{" "}
                    <a href={MAILTO} className={INLINE_LINK}>
                      {site.company.email}
                    </a>{" "}
                    with “security” in the subject. Acknowledgement within two working days, a status update within ten. No
                    legal action against good-faith research.
                  </>
                ),
              },
              {
                title: "Data handling pre-launch",
                body: "Early-access tenants will run on the development build. Tenant data will be used only to operate the service and deleted on request within 30 days.",
              },
            ]}
          />
          <Reveal className="mt-10">
            <TextLink to="/contact?topic=Other">Ask a security question</TextLink>
          </Reveal>
        </Split>
      </Section>
    </>
  );
}
