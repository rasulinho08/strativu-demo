import { Link } from "react-router";
import { Duo, Eyebrow, PageHeader, Rows, Section, TextLink } from "../components/site/primitives";
import { Reveal } from "../components/site/Reveal";
import { InstagramFeed } from "../components/site/InstagramFeed";
import { EarlyAccessForm } from "../components/site/EarlyAccessForm";
import { site } from "../data/site";
import { Split, SystemLog } from "../components/site/Visuals";

/**
 * About, Contact, Early access and Trust.
 * Two-sided layouts (Duo / Split). Form sections carry `data-logo-hide`, so the 3D logo fades out while a form is on screen.
 * Facts are hairline Rows; no cards, no icon boxes.
 */

const BODY = "max-w-[52ch] text-[17px] leading-[1.65] text-ink-2";
/** Links inside running text: always underlined (not by colour alone, WCAG 1.4.1). */
const INLINE_LINK =
  "text-brand-ink underline decoration-[color-mix(in_srgb,currentColor_45%,transparent)] underline-offset-4 transition-colors hover:decoration-current";
const MAILTO = `mailto:${site.company.email}`;

export function About() {
  return (
    <>
      <PageHeader
        eyebrow="Company"
        title="We are building the GRC tool we wanted to use ourselves."
        lead="A small software company in Baku. Our first product, Strativu GRC 360, brings risks, controls, audits and compliance into one system."
      />

      <Section>
        <Duo
          head={
            <Reveal>
              <Eyebrow>Why we exist</Eyebrow>
              <h2 className="t-h2 text-ink">The category is full. The problem is still there.</h2>
            </Reveal>
          }
        >
            <Reveal delay={0.06} className="space-y-5">
              <p className={BODY}>
                Risk registers, control lists and audit findings often live in separate spreadsheets, and the links between them
                are kept by hand until they break.
              </p>
              <p className={BODY}>
                We start from the model instead: risks, controls, policies and requirements linked as one record set, frameworks
                loaded as packages, and changes recorded in a system log an auditor can read. It takes longer to build, and it is
                the version we would want to use ourselves.
              </p>
            </Reveal>
        </Duo>
      </Section>

      {/* Instagram postları — token yoxdursa bu bölmə görünmür (bax: api/instagram.ts) */}
      <InstagramFeed />

      <Section className="pt-0 md:pt-0">
        <Duo
          head={
            <Reveal>
              <Eyebrow>Where</Eyebrow>
              <h2 className="t-h2 text-ink">Baku, building for Azerbaijan and the region.</h2>
            </Reveal>
          }
        >
            <Reveal>
              <dl className="grid gap-x-8 gap-y-5 border-t border-line pt-8 md:grid-cols-[180px_1fr]">
                <dt className="mono-label pt-1">Company</dt>
                <dd className="text-[17px] leading-[1.6] text-ink">{`${site.company.legalName}. ${site.company.jurisdiction}.`}</dd>
                <dt className="mono-label pt-1">Working hours</dt>
                <dd className="text-[17px] leading-[1.6] text-ink">
                  09:00–18:00 Baku time (UTC+4).
                </dd>
                <dt className="mono-label pt-1">Email</dt>
                <dd className="text-[17px] leading-[1.6] text-ink">
                  <a href={MAILTO} className={INLINE_LINK}>
                    {site.company.email}
                  </a>
                </dd>
              </dl>
            </Reveal>
            <Reveal className="mt-10">
              <TextLink to="/company/contact">Get in touch</TextLink>
            </Reveal>
        </Duo>
      </Section>
    </>
  );
}

export function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Company · Contact"
        title="Talk to a person."
        lead="Product questions, partnerships, press, or a framework you need. A person from our team replies within two working days."
      />
      <Section className="pt-0 md:pt-0" logoHide>
        <Duo
          sticky
          head={
            <Reveal>
              <dl className="border-t border-line">
                <div className="border-b border-line py-5">
                  <dt className="mono-label">Email</dt>
                  <dd className="mt-2 text-[16px]">
                    <a href={MAILTO} className="text-ink link-line">
                      {site.company.email}
                    </a>
                  </dd>
                </div>
                <div className="border-b border-line py-5">
                  <dt className="mono-label">Office</dt>
                  <dd className="mt-2 text-[16px] text-ink">{site.company.address}</dd>
                </div>
                <div className="border-b border-line py-5">
                  <dt className="mono-label">Reply time</dt>
                  <dd className="mt-2 text-[16px] text-ink">Within two working days</dd>
                </div>
              </dl>
            </Reveal>
          }
        >
          <Reveal>
            <EarlyAccessForm kind="contact" />
          </Reveal>
        </Duo>
      </Section>
    </>
  );
}

export function EarlyAccess() {
  return (
    <>
      <PageHeader
        eyebrow={site.status.detail}
        title="Shape the product before it ships."
        lead="Open to a small number of teams that run risk and compliance work in Azerbaijan and the region."
      />
      <Section className="pt-0 md:pt-0" logoHide>
        <Duo
          sticky
          head={
            <Rows
            headingLevel={2}
            items={[
              {
                title: "Who it is for",
                body: (
                  <>
                    Security, risk and compliance leads at banks and financial institutions, public bodies and growing companies
                    preparing for ISO 27001, PCI DSS, Azerbaijan’s Personal Data Law or another framework on our{" "}
                    <Link to="/coverage" className={INLINE_LINK}>
                      coverage list
                    </Link>
                    . An upcoming audit or regulator review matters; team size does not.
                  </>
                ),
              },
              {
                title: "What you get",
                body: "From Q1 2027: your own workspace on the development version, direct contact with our engineers, and priority for the frameworks you need. No cost during early access.",
              },
              {
                title: "What we ask",
                body: "One 45-minute call a month, honest feedback on what breaks, and permission to use what we learn (never your data) to shape the product.",
              },
              {
                title: "What happens next",
                body: "We review requests weekly. A person from our team replies within five working days, and if it is not a fit yet, we say why.",
              },
            ]}
          />
          }
        >
          <Reveal>
            <Eyebrow>Request access</Eyebrow>
          </Reveal>
          <Reveal delay={0.06} className="mt-8">
            <EarlyAccessForm kind="early-access" />
          </Reveal>
        </Duo>
      </Section>
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
        eyebrow="Trust"
        title="How we handle data, before we are certified."
        lead="A GRC vendor should model the behaviour it sells. Here is what is true now, what we are pursuing, and when."
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
                    <Link to="/platform/architecture" className={INLINE_LINK}>
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
            <TextLink to="/company/contact">Ask a security question</TextLink>
          </Reveal>
        </Split>
      </Section>
    </>
  );
}
