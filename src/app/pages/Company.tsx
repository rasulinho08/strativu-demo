import { Link } from "react-router";
import { Duo, Eyebrow, PageHeader, Rows, Section, TextLink } from "../components/site/primitives";
import { Reveal } from "../components/site/Reveal";
import { InstagramFeed } from "../components/site/InstagramFeed";
import { EarlyAccessForm } from "../components/site/EarlyAccessForm";
import { site } from "../data/site";
import { usePageMeta } from "../components/site/Seo";
import { Split, SystemLog } from "../components/site/Visuals";

/**
 * About, Contact, Early access and Trust.
 * Everything sits in the left Lane so the 3D logo on the right stays clear.
 * Facts are hairline Rows; no cards, no icon boxes.
 */

const BODY = "max-w-[52ch] text-[17px] leading-[1.65] text-ink-2";
const INLINE_LINK = "text-brand-ink link-line";
const MAILTO = `mailto:${site.company.email}`;

export function About() {
  usePageMeta("About", "Strativu is a small company in Baku building a GRC platform where the control register is the system of record.");
  return (
    <>
      <PageHeader
        eyebrow="Company"
        title="We are building the GRC tool we wanted to use ourselves."
        lead="A small company in Baku, founded by people who have run security and compliance programmes, sat across the table from auditors and built platforms that hold other companies’ data."
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
                On both sides of the audit we kept finding tools that automate screenshot collection instead of removing the
                need for it, with a separate control register for every framework.
              </p>
              <p className={BODY}>
                We start from the model instead: risks, controls, policies and requirements linked as one record set, frameworks loaded as packages,
                and every change in a log an auditor can read. It is slower to build, and the only version we would trust with our
                own programme.
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
              <h2 className="t-h2 text-ink">Baku, building for Europe.</h2>
            </Reveal>
          }
        >
            <Reveal>
              <dl className="grid gap-x-8 gap-y-5 border-t border-line pt-8 md:grid-cols-[180px_1fr]">
                <dt className="mono-label pt-1">Company</dt>
                <dd className="text-[17px] leading-[1.6] text-ink">{`${site.company.legalName}. ${site.company.jurisdiction}.`}</dd>
                <dt className="mono-label pt-1">Working hours</dt>
                <dd className="text-[17px] leading-[1.6] text-ink">
                  09:00–18:00 AZT (UTC+4), covering the European morning and early afternoon.
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
  usePageMeta("Contact", "Product questions, partnerships, press, or a framework you need mapped. A named person replies within two working days.");
  return (
    <>
      <PageHeader
        eyebrow="Company · Contact"
        title="Talk to a person."
        lead="Product questions, partnerships, press, or a framework you need mapped. A named person replies within two working days."
      />
      <Section className="pt-0 md:pt-0">
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
  usePageMeta("Early access", "Early access to GRC 360 for teams that run a compliance programme against a supported framework.");
  return (
    <>
      <PageHeader
        eyebrow={site.status.detail}
        title="Shape the product before it ships."
        lead="Open to a small number of teams that run a compliance programme against a supported framework."
      />
      <Section className="pt-0 md:pt-0">
        <Duo
          sticky
          head={
            <Rows
            items={[
              {
                title: "Who it is for",
                body: (
                  <>
                    Security, compliance or platform leads at organisations audited against ISO 27001, SOC 2 or a framework on the{" "}
                    <Link to="/coverage" className={INLINE_LINK}>
                      coverage list
                    </Link>
                    . A real audit window matters; team size does not.
                  </>
                ),
              },
              {
                title: "What you get",
                body: "A tenant on the development build, a direct line to the engineers and mapping priority for your frameworks. No cost during early access.",
              },
              {
                title: "What we ask",
                body: "One 45-minute call a month, honest feedback on what breaks, and permission to use what we learn (never your data) to shape the product.",
              },
              {
                title: "What happens next",
                body: "We review requests weekly. A named person replies within five working days, and if it is not a fit yet, we say why.",
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

export function Trust() {
  usePageMeta("Trust", "How Strativu handles data before it has a certification: architecture, hosting, subprocessors, disclosure policy.");
  return (
    <>
      <PageHeader
        eyebrow="Trust"
        title="How we handle data, before we have a badge to show for it."
        lead="A GRC vendor should model the behaviour it sells. Here is what is true now, what we are pursuing, and when."
      />
      <Section className="pt-0 md:pt-0">
        <Split sticky visual={<Reveal><SystemLog /></Reveal>}>
          <Rows
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
                body: "Multi-tenant cloud, or on-premise in your own data centre.",
              },
              {
                title: "Subprocessors",
                body: "The named list goes to early-access tenants and will be public at launch.",
              },
              {
                title: "Certifications",
                body: "None yet. We are pursuing ISO/IEC 27001:2022 certification and a SOC 2 Type II report, targeted within twelve months of general availability. We run the programme on our own product.",
              },
              {
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
                body: "Early-access tenants run on the development build. Tenant data is used only to operate the service and is deleted on request within 30 days.",
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
