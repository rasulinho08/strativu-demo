import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Btn, Container, Eyebrow, Lane, PageHeader, Rows, Section, TextLink } from "../components/site/primitives";
import { Reveal } from "../components/site/Reveal";
import { site } from "../data/site";
import { products } from "../data/products";
import { grcFigures, grcFrameworkPackages, grcIntegrations, grcModules, grcStatus } from "../data/grc360";
import { usePageMeta } from "../components/site/Seo";
import { AuditChain, CollectorFeed, ControlMap, Split } from "../components/site/Visuals";

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
        lead="One object graph under an append-only audit trail, shared by every product we build. GRC 360 is the first."
      />

      <Section>
        <Split visual={<Reveal><ControlMap /></Reveal>}>
          <Reveal>
            <Eyebrow>The model</Eyebrow>
            <h2 className="t-h2 text-ink">Five object types, one graph.</h2>
          </Reveal>
          <Rows className="mt-12" items={MODEL} />
        </Split>
      </Section>

      <Section className="pt-0 md:pt-0">
        <Lane>
          <Reveal>
            <h2 className="eyebrow mb-4">Products</h2>
          </Reveal>
          <Rows
            className="mt-8"
            items={products.map((pr) => ({ title: pr.name, body: pr.summary, meta: pr.status, to: pr.to, href: pr.href }))}
          />
          <Reveal className="mt-10">
            <TextLink to="/platform/architecture">How the platform is built</TextLink>
          </Reveal>
        </Lane>
      </Section>
    </>
  );
}

/* ── Module explorer: compact grid of names (left), selected module in a panel (right).
   Advances on its own while on screen until the visitor picks a module. ── */
function ModuleExplorer() {
  const [idx, setIdx] = useState(0);
  const [pinned, setPinned] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px -20% 0px" });
  const reduce = useReducedMotion();
  useEffect(() => {
    if (pinned || reduce || !inView) return;
    const id = window.setInterval(() => setIdx((v) => (v + 1) % grcModules.length), 3200);
    return () => window.clearInterval(id);
  }, [pinned, reduce, inView]);
  const m = grcModules[idx];

  return (
    <div ref={ref}>
      <Split
        sticky
        visual={
          <figure className="overflow-hidden rounded-[var(--r-xl)] border border-line bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] shadow-[var(--e2)] backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-line-soft px-6 py-3.5">
              <span className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-ink-3">
                Module {String(idx + 1).padStart(2, "0")} / {grcModules.length}
              </span>
              {/* irəliləyiş: hansı modulda olduğunu göstərir */}
              <span className="hidden gap-1 sm:flex" aria-hidden>
                {grcModules.map((_, k) => (
                  <span key={k} className={`h-1 w-3 rounded-full transition-colors ${k === idx ? "bg-brand" : "bg-line"}`} />
                ))}
              </span>
            </div>
            <div className="min-h-[300px] p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={m.name}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h3 className="t-h2 text-ink">{m.name}</h3>
                  <p className="mt-4 text-[17px] leading-[1.6] text-ink-2">{m.does}</p>
                  {m.screens.length > 0 && (
                    <>
                      <p className="mt-8 font-mono text-[11.5px] uppercase tracking-[0.12em] text-ink-3">Screens</p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {m.screens.map((sc) => (
                          <li key={sc} className="rounded-full border border-line px-3 py-1 text-[13px] text-ink-2">
                            {sc}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </figure>
        }
      >
        <ul className="grid grid-cols-2 gap-x-6 border-t border-line">
          {grcModules.map((mod, i) => {
            const on = i === idx;
            return (
              <li key={mod.name} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => {
                    setIdx(i);
                    setPinned(true);
                  }}
                  aria-pressed={on}
                  className="group flex w-full items-baseline gap-3 py-4 text-left"
                >
                  <span className={`font-mono text-[12px] transition-colors ${on ? "text-brand" : "text-ink-3"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-[15.5px] font-medium leading-[1.3] transition-colors ${
                      on ? "text-ink" : "text-ink-2 group-hover:text-ink"
                    }`}
                  >
                    {mod.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Split>
    </div>
  );
}

export function PlatformGRC() {
  usePageMeta(
    "GRC 360",
    "GRC 360 brings risks, assets, vendors, controls, audits and incidents into one connected system: one control set for every framework, evidence collected automatically, and a public Trust Center."
  );
  return (
    <>
      <PageHeader
        eyebrow={`Platform · GRC 360 · ${site.status.label}`}
        title="Governance, risk and compliance. All of it, in one place."
        lead="Twelve connected modules: risks, assets, vendors, controls, audits and incidents live in one system instead of a folder of spreadsheets."
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
                    alt="GRC 360 development build: command centre with overdue, today and upcoming task lists and an asset-risk heat map."
                    className="block h-auto w-full"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-[11px] text-ink-3">
                  Command Center, development build. Data is illustrative.
                </figcaption>
              </figure>
            </Reveal>
          </Lane>
        </Container>
      </div>

      {/* Figures — only numbers verified in the product */}
      <Section>
        <Lane>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-line pt-10 md:grid-cols-4">
            {grcFigures.map((f, i) => (
              <Reveal key={f.label} delay={i * 0.06}>
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="block text-[clamp(44px,5vw,72px)] font-semibold leading-none tracking-[-0.04em] text-ink">
                    {f.value}
                  </span>
                  <span className="mt-3 block font-mono text-[12px] uppercase leading-[1.5] tracking-[0.12em] text-ink-3">
                    {f.label}
                  </span>
                </dd>
              </Reveal>
            ))}
          </dl>
        </Lane>
      </Section>

      {/* Modules */}
      <Section id="modules" className="pt-0 md:pt-0">
        <Lane>
          <Reveal>
            <Eyebrow>Modules</Eyebrow>
            <h2 className="t-h2 text-ink">Twelve modules. One model underneath.</h2>
            <p className={BODY}>Every module reads and writes the same registers, so a risk, the asset it affects, the control that treats it and the audit finding that tests it stay linked.</p>
          </Reveal>
        </Lane>
        <Reveal className="mt-12">
          <ModuleExplorer />
        </Reveal>
      </Section>

      <Section id="mapping" className="pt-0 md:pt-0">
        <Split visual={<Reveal><ControlMap /></Reveal>}>
          <Reveal>
            <Eyebrow>One control, many frameworks</Eyebrow>
            <h2 className="t-h2 text-ink">Write a control once. Map it everywhere.</h2>
            <p className={BODY}>
              A control is written once and linked to ISO 27001, SOC 2, NIST and PCI DSS requirements at the same time. Adding a framework
              becomes a gap review, not a second register.
            </p>
            <p className="mt-6 font-mono text-[12px] leading-[1.7] text-ink-3">
              Framework packages: {grcFrameworkPackages.join(" · ")}
            </p>
            <div className="mt-8">
              <TextLink to="/coverage">Coverage and status per framework</TextLink>
            </div>
          </Reveal>
        </Split>
      </Section>

      <Section id="evidence" className="pt-0 md:pt-0">
        <Split visual={<Reveal><CollectorFeed /></Reveal>}>
          <Reveal>
            <Eyebrow>Evidence</Eyebrow>
            <h2 className="t-h2 text-ink">Evidence that collects itself.</h2>
            <p className={BODY}>
              Collectors check your cloud, identity and source-control systems on a schedule and attach the result to the control it
              proves. A failed check opens a Jira ticket and posts a Slack alert, so issues are fixed before the audit, not during it.
            </p>
            <p className="mt-6 font-mono text-[12px] leading-[1.7] text-ink-3">
              Live today: AWS IAM, GitHub. Integration catalogue: {grcIntegrations.join(", ")}.
            </p>
          </Reveal>
        </Split>
      </Section>

      <Section id="trust-center" className="pt-0 md:pt-0">
        <Lane>
          <Reveal>
            <Eyebrow>Trust Center</Eyebrow>
            <h2 className="t-h2 text-ink">Answer security questionnaires before they arrive.</h2>
            <p className={BODY}>
              A public Trust Center shows your customers your certifications, controls, subprocessors and documents in one place, so
              less time goes into answering the same questions over and over.
            </p>
          </Reveal>
        </Lane>
      </Section>

      <Section id="audit" className="pt-0 md:pt-0">
        <Split visual={<Reveal><AuditChain /></Reveal>}>
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
        </Split>
      </Section>

      <Section id="local" className="pt-0 md:pt-0">
        <Lane>
          <Reveal>
            <Eyebrow>Built in Baku</Eyebrow>
            <h2 className="t-h2 text-ink">Local law, mapped like any other framework.</h2>
            <p className={BODY}>
              The Law of the Republic of Azerbaijan on Personal Data (No. 998-IIIQ) is being mapped onto the same control set, next to
              GDPR, so one programme covers both.
            </p>
          </Reveal>
        </Lane>
      </Section>

      <Section id="status" className="pt-0 md:pt-0">
        <Lane>
          <Reveal>
            <Eyebrow>Where it stands</Eyebrow>
            <h2 className="t-h2 text-ink">Built in the open.</h2>
          </Reveal>
          <Rows className="mt-10" items={grcStatus.map((st) => ({ title: st.k, body: st.v }))} />
          <Reveal className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Btn to="/early-access" size="lg">
              Request early access
            </Btn>
            <TextLink to="/changelog">Build log</TextLink>
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
