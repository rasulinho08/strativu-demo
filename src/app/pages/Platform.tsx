import type { ReactNode } from "react";
import { Btn, Container, Eyebrow, Lane, PageHeader, Rows, Section, TextLink } from "../components/site/primitives";
import { Reveal } from "../components/site/Reveal";
import { site } from "../data/site";
import { usePageMeta } from "../components/site/Seo";

/**
 * Platform, GRC and Architecture pages.
 * Everything sits in the left Lane so the 3D logo on the right stays clear.
 * Lists are hairline Rows; no cards, no mock UI.
 */

const BODY = "mt-5 max-w-[52ch] text-[17px] leading-[1.65] text-ink-2";

const MODEL = [
  { n: "01", title: "Registers", body: "Risks, assets, vendors and processing activities." },
  { n: "02", title: "Controls", body: "One shared control set, mapped across frameworks, with owners and review cycles." },
  { n: "03", title: "Evidence", body: "Read by collectors or uploaded by hand, then hashed and timestamped." },
  { n: "04", title: "Workflow", body: "Tasks, reviews and exceptions." },
  { n: "05", title: "Reporting", body: "Audit packs, the Statement of Applicability and a board view." },
];

export function Platform() {
  usePageMeta("Platform", "One model for governance, risk and compliance: registers, controls, evidence, workflow and reporting under an append-only audit trail.");
  return (
    <>
      <PageHeader
        eyebrow="Platform"
        title="One model for governance, risk and compliance."
        lead="One object graph under an append-only audit trail, shared by every product we build. GRC is the first."
      />

      <Section>
        <Lane>
          <Reveal>
            <Eyebrow>The model</Eyebrow>
            <h2 className="t-h2 text-ink">Five object types, one graph.</h2>
          </Reveal>
          <Rows className="mt-12" items={MODEL} />
        </Lane>
      </Section>

      <Section className="pt-0 md:pt-0">
        <Lane>
          <Reveal>
            <h2 className="eyebrow mb-4">Products</h2>
          </Reveal>
          <Rows
            className="mt-8"
            items={[
              {
                title: "GRC",
                body: "Control and risk registers, automated evidence, cross-framework mapping and audit-ready reporting.",
                meta: site.status.label,
                to: "/platform/grc",
              },
            ]}
          />
          <Reveal className="mt-10">
            <TextLink to="/platform/architecture">How the platform is built</TextLink>
          </Reveal>
        </Lane>
      </Section>
    </>
  );
}

export function PlatformGRC() {
  usePageMeta("GRC product", "A GRC product where the control register is the system of record: one control set, collector-attached evidence, a hash-chained audit trail.");
  return (
    <>
      <PageHeader
        eyebrow={`Platform · GRC · ${site.status.label}`}
        title="The control register is the system of record."
        lead="One control set, evidence attached by collectors, and an audit trail your auditor can read directly."
      >
        <Btn to="/early-access" size="lg">
          Request early access
        </Btn>
      </PageHeader>

      {/* Real development build — not a mock. */}
      <div className="pb-4 pt-4 md:pt-8">
        <Container>
          <Lane>
            <Reveal>
              <figure>
                <div className="overflow-hidden rounded-[var(--r-xl)] border border-line bg-surface shadow-[var(--e3)]">
                  <img
                    src="/projects/grc.webp"
                    width={1800}
                    height={811}
                    alt="Strativu GRC development build: command centre with expired, today and future task lists and an asset-risk heat map."
                    className="block h-auto w-full"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-[11px] text-ink-3">
                  Development build, September 2026. Data is illustrative.
                </figcaption>
              </figure>
            </Reveal>
          </Lane>
        </Container>
      </div>

      <Section id="mapping">
        <Lane>
          <Reveal>
            <Eyebrow>Controls</Eyebrow>
            <h2 className="t-h2 text-ink">Write a control once. Map it everywhere.</h2>
            <p className={BODY}>
              Each control carries the ISO/IEC 27002:2022 attributes and maps to every framework you are audited against. Adding SOC 2 to
              an ISO programme becomes a gap review, not a second register.
            </p>
            <div className="mt-8">
              <TextLink to="/coverage">Frameworks we map to</TextLink>
            </div>
          </Reveal>
        </Lane>
      </Section>

      <Section id="evidence" className="pt-0 md:pt-0">
        <Lane>
          <Reveal>
            <Eyebrow>Evidence</Eyebrow>
            <h2 className="t-h2 text-ink">Collectors, not screenshots.</h2>
            <p className={BODY}>
              Collectors read configuration from cloud, identity and source-control systems on a schedule and attach it to the controls
              it proves. Every artefact is hashed on ingest and re-verified on read.
            </p>
            <p className="mt-6 font-mono text-[12px] leading-[1.7] text-ink-3">
              Collectors today: AWS IAM, GitHub. In progress: Okta, Cloudflare, Google Workspace, Microsoft Entra ID.
            </p>
          </Reveal>
        </Lane>
      </Section>

      <Section id="audit" className="pt-0 md:pt-0">
        <Lane>
          <Reveal>
            <Eyebrow>Audit trail</Eyebrow>
            <h2 className="t-h2 text-ink">
              <span className="whitespace-nowrap">Append-only.</span> <span className="whitespace-nowrap">Hash-chained.</span> Readable by
              your auditor.
            </h2>
            <p className={BODY}>
              Every write is appended to a chained log with actor, tenant, object and diff. Auditors get a scoped, read-only,
              time-boxed session that is itself logged.
            </p>
            <div className="mt-8">
              <TextLink to="/platform/architecture#audit-trail">How the chain is verified</TextLink>
            </div>
          </Reveal>
        </Lane>
      </Section>
    </>
  );
}

const ARCH: { h: string; p: ReactNode[] }[] = [
  {
    h: "Tenancy",
    p: [
      "Every row carries a tenant identifier, enforced by a row-level security policy that reads the tenant from the authenticated session, never from a request parameter. The database will not return another tenant’s rows.",
      "Each tenant has its own data-encryption key, wrapped by a per-region key in a managed KMS. Deleting a tenant destroys the key first.",
    ],
  },
  {
    h: "Audit trail",
    p: [
      <>
        Every write goes through a single command path that emits an event before the transaction commits. Each entry carries the{" "}
        <span className="whitespace-nowrap">SHA-256</span> of the previous one, and the chain head is published daily to an external
        timestamping service, so the log can be verified without trusting Strativu.
      </>,
      "Reads by auditors and customers are logged too. No privileged read path bypasses the log.",
    ],
  },
  {
    h: "Permissions",
    p: [
      "Roles for coarse grants (admin, editor, reviewer, auditor); attributes for scope (framework, business unit, time window). An auditor session is a role, a scope and an expiry, issued by a tenant admin and visible in the trail.",
    ],
  },
  {
    h: "API-first",
    p: [
      "The web application is a client of the public REST API: a versioned OpenAPI 3.1 specification with generated SDKs, and webhooks for every state change in the audit trail.",
    ],
  },
  {
    h: "Data residency and deployment",
    p: [
      "EU (Frankfurt) at launch. Region is chosen at tenant creation and is immutable. Single-tenant deployment is on the roadmap for regulated customers; the isolation model does not depend on it.",
    ],
  },
  {
    h: "Evidence integrity",
    p: [
      "Artefacts are content-addressed: the storage key is the hash of the file. A replaced file becomes a new artefact, linked to the old one in the trail. Nothing is overwritten.",
    ],
  },
];

/** Section id = heading lowercased, spaces to "-" (kept stable for #anchor links). */
const slug = (h: string) => h.toLowerCase().replace(/\s+/g, "-");

export function Architecture() {
  usePageMeta("Architecture", "Multi-tenant model, audit trail, permissions, API-first design and data residency, written for the engineer doing the vendor review.");
  return (
    <>
      <PageHeader
        eyebrow="Platform · Architecture"
        title="Multi-tenant model, audit trail, data residency."
        lead="Written for the engineer doing the vendor review. Until we have a SOC 2 report, this is what we can show."
      />

      <div className="pb-24 pt-4 md:pb-36 md:pt-8">
        <Container>
          <Lane>
            <div className="border-b border-line">
              {ARCH.map((a, i) => (
                <section key={a.h} id={slug(a.h)} className="scroll-mt-24 border-t border-line py-10 md:py-12">
                  <Reveal className="grid grid-cols-[48px_1fr] gap-x-4 md:grid-cols-[64px_1fr]">
                    <span className="pt-1.5 font-mono text-[13px] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                    <div className="min-w-0">
                      <h2 className="t-h3 text-ink">{a.h}</h2>
                      {a.p.map((t, j) => (
                        <p key={j} className="mt-4 max-w-[60ch] text-[16.5px] leading-[1.7] text-ink-2">
                          {t}
                        </p>
                      ))}
                    </div>
                  </Reveal>
                </section>
              ))}
            </div>
            <Reveal className="mt-10">
              <TextLink to="/trust">Certifications we are pursuing</TextLink>
            </Reveal>
          </Lane>
        </Container>
      </div>
    </>
  );
}
