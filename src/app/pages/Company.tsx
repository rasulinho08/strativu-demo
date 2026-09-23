import { Link } from "react-router";
import { Eyebrow, Lane, PageHeader, Rows, Section, TextLink } from "../components/site/primitives";
import { Reveal } from "../components/site/Reveal";
import { EarlyAccessForm } from "../components/site/EarlyAccessForm";
import { site } from "../data/site";
import { usePageMeta } from "../components/site/Seo";

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
        lead="A small company in Baku, founded by people who have run security and compliance programmes, faced auditors and built multi-tenant platforms."
      />

      <Section>
        <Lane>
          <Reveal>
            <Eyebrow>Why we exist</Eyebrow>
            <h2 className="t-h2 text-ink">The category is full. The problem is still there.</h2>
          </Reveal>
          <Reveal delay={0.06} className="mt-8 space-y-5">
            <p className={BODY}>
              On both sides of the audit we kept finding tools that automate screenshot collection instead of removing the
              need for it, with a separate control register for every framework.
            </p>
            <p className={BODY}>
              We start from the model instead: controls written once and mapped to every standard, evidence read from systems and hashed on the way in,
              and a log an auditor can read directly. It is slower to build, and the only version we would trust with our
              own programme.
            </p>
          </Reveal>
        </Lane>
      </Section>

      <Section className="pt-0 md:pt-0">
        <Lane>
          <Reveal>
            <Eyebrow>Where</Eyebrow>
            <h2 className="t-h2 text-ink">Baku, building for Europe.</h2>
          </Reveal>
          <Rows
            className="mt-12"
            items={[
              { title: "Company", body: `${site.company.legalName}. ${site.company.jurisdiction}.` },
              { title: "Working hours", body: "09:00–18:00 AZT (UTC+4), overlapping the full European working day." },
              { title: "Email", body: site.company.email, href: MAILTO },
            ]}
          />
          <Reveal className="mt-10">
            <TextLink to="/company/contact">Get in touch</TextLink>
          </Reveal>
        </Lane>
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
      <Section>
        <Lane>
          <Reveal>
            <EarlyAccessForm kind="contact" />
          </Reveal>
          <Reveal className="mt-20 border-t border-line pt-8">
            <ul className="flex flex-col gap-3 text-[15px] text-ink-2 sm:flex-row sm:flex-wrap sm:gap-x-10">
              <li>
                <a href={MAILTO} className="text-ink link-line">
                  {site.company.email}
                </a>
              </li>
              <li>{site.company.address}</li>
              <li>
                Security reports:{" "}
                <Link to="/trust" className={INLINE_LINK}>
                  Trust
                </Link>
              </li>
              <li>
                Want in?{" "}
                <Link to="/early-access" className={INLINE_LINK}>
                  Early access
                </Link>
              </li>
            </ul>
          </Reveal>
        </Lane>
      </Section>
    </>
  );
}

export function EarlyAccess() {
  usePageMeta("Early access", "Early access to the Strativu GRC product for teams that run a compliance programme against a supported framework.");
  return (
    <>
      <PageHeader
        eyebrow={`Early access · ${site.status.detail}`}
        title="Shape the product before it ships."
        lead="Open to a small number of teams that run a compliance programme against a supported framework."
      />
      <Section>
        <Lane>
          <Rows
            items={[
              {
                title: "Who it is for",
                body: (
                  <>
                    Security, compliance or platform leads audited against ISO 27001, SOC 2 or a framework on the{" "}
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
        </Lane>
      </Section>
      <Section className="pt-0 md:pt-0">
        <Lane>
          <Reveal>
            <Eyebrow>Request access</Eyebrow>
          </Reveal>
          <Reveal delay={0.06} className="mt-8">
            <EarlyAccessForm kind="early-access" />
          </Reveal>
        </Lane>
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
        lead="A GRC vendor should model the behaviour it sells: what is true now, what we are pursuing, and when."
      />
      <Section>
        <Lane>
          <Rows
            items={[
              {
                title: "Architecture",
                body: (
                  <>
                    Row-level tenant isolation, per-tenant encryption keys and an append-only, hash-chained audit trail.{" "}
                    <Link to="/platform/architecture" className={INLINE_LINK}>
                      Architecture notes
                    </Link>
                  </>
                ),
              },
              {
                title: "Hosting",
                body: "EU (Frankfurt), managed cloud. Each tenant’s region is fixed when it is created.",
              },
              {
                title: "Subprocessors",
                body: "Cloud hosting (EU), transactional email and error monitoring. The named list goes to early-access tenants and will be public at launch.",
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
        </Lane>
      </Section>
    </>
  );
}
