import { useEffect, useRef, useState, type FocusEvent, type PointerEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Btn, Container, Duo, Eyebrow, PageHeader, Rows, Section, TextLink } from "../components/site/primitives";
import { Reveal } from "../components/site/Reveal";
import { site } from "../data/site";
import { products } from "../data/products";
import {
  GRC_SCREEN_SIZE,
  grcConnections,
  grcFigures,
  grcFrameworkPackages,
  grcModules,
  grcScreens,
  grcStack,
  grcStatus,
} from "../data/grc360";
import { usePageMeta } from "../components/site/Seo";
import { AlertFeed, ControlMap, RiskLinks, Split, SystemLog } from "../components/site/Visuals";

/**
 * Platform, GRC and Architecture pages.
 * Two-sided layouts (Duo / Split): heading or text on the left, list or illustrative panel on the right.
 * The 3D logo stays a faint background on these pages (LogoScene → CHOREO.page).
 * Lists are hairline Rows; no cards.
 */

const BODY = "mt-5 max-w-[52ch] text-[17px] leading-[1.65] text-ink-2";
/** Duo-nun sağ sütununda ilk abzas (yuxarı boşluq lazım deyil). */
const BODY_R = "max-w-[52ch] text-[17px] leading-[1.65] text-ink-2";

const MODEL = [
  { n: "01", title: "Registers", body: "Risks, assets, vendors and data flows." },
  { n: "02", title: "Controls", body: "Controls with their audits and maintenance, linked to the requirements they meet." },
  { n: "03", title: "Links", body: "A risk is tied to the controls, policies, assets, projects and requirements that treat it." },
  { n: "04", title: "Workflow", body: "Tasks, reviews, exceptions and alerts before anything expires." },
  { n: "05", title: "Reporting", body: "Heat maps, compliance analysis and a public Trust Center." },
];

export function Platform() {
  usePageMeta(
    "Platform",
    "One model for governance, risk and compliance: registers, controls, links, workflow and reporting, with changes recorded in a per-tenant system log."
  );
  return (
    <>
      <PageHeader
        eyebrow="Platform"
        title="One model for governance, risk and compliance."
        lead="Risks, controls, policies and requirements in one connected model, with changes recorded in a per-tenant system log. Strativu GRC 360 is the first product built on it."
      />

      <Section>
        <Split visual={<Reveal><ControlMap /></Reveal>}>
          <Reveal>
            <Eyebrow>The model</Eyebrow>
            <h2 className="t-h2 text-ink">Five parts, one model.</h2>
          </Reveal>
          <Rows className="mt-12" items={MODEL} />
        </Split>
      </Section>

      <Section className="pt-0 md:pt-0">
        <Duo
          head={
            <Reveal>
              <Eyebrow>Products</Eyebrow>
              <h2 className="t-h2 text-ink">What we have built on it.</h2>
              <div className="mt-8">
                <TextLink to="/platform/architecture">How the platform is built</TextLink>
              </div>
            </Reveal>
          }
        >
          <Rows items={products.map((pr) => ({ title: pr.name, body: pr.summary, meta: pr.status, to: pr.to, href: pr.href }))} />
        </Duo>
      </Section>
    </>
  );
}

/**
 * Auto-advance for the gallery and the module explorer (WCAG 2.2.2):
 *  - only while on screen and without reduced motion;
 *  - pauses while the mouse is over it or focus is inside it;
 *  - stops for good after the first click, tap, touch or key press inside it.
 */
function useAutoAdvance<T extends HTMLElement>(count: number, ms: number) {
  const [idx, setIdx] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [held, setHeld] = useState(false);
  const ref = useRef<T>(null);
  const inView = useInView(ref, { margin: "-20% 0px -20% 0px" });
  const reduce = useReducedMotion();
  useEffect(() => {
    if (pinned || held || reduce || !inView) return;
    const id = window.setInterval(() => setIdx((v) => (v + 1) % count), ms);
    return () => window.clearInterval(id);
  }, [pinned, held, reduce, inView, count, ms]);
  const bind = {
    onPointerEnter: (e: PointerEvent) => {
      if (e.pointerType === "mouse") setHeld(true);
    },
    onPointerLeave: (e: PointerEvent) => {
      if (e.pointerType === "mouse") setHeld(false);
    },
    onPointerDown: () => setPinned(true),
    onKeyDown: () => setPinned(true),
    onFocus: () => setHeld(true),
    onBlur: (e: FocusEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
    },
  };
  const select = (i: number) => {
    setIdx(i);
    setPinned(true);
  };
  return { ref, idx, select, bind, reduce };
}

/* ── Module explorer: compact grid of names (left), selected module in a panel (right).
   Advances on its own while on screen until the visitor interacts (see useAutoAdvance). ── */
function ModuleExplorer() {
  const { ref, idx, select, bind, reduce } = useAutoAdvance<HTMLDivElement>(grcModules.length, 3200);
  const m = grcModules[idx];

  return (
    <div ref={ref} {...bind}>
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
                  onClick={() => select(i)}
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

/* ── Screens from the product: tabs on top, the selected screen below.
   Advances on its own until the visitor interacts (see useAutoAdvance). ── */
function ScreenGallery() {
  const { ref, idx, select, bind, reduce } = useAutoAdvance<HTMLElement>(grcScreens.length, 4200);
  const sc = grcScreens[idx];
  return (
    <figure ref={ref} {...bind}>
      <div role="tablist" aria-label="GRC 360 screens" className="-mx-1 flex gap-1 overflow-x-auto pb-3 [scrollbar-width:none]">
        {grcScreens.map((g, i) => {
          const on = i === idx;
          return (
            <button
              key={g.key}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => select(i)}
              className={`relative shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                on ? "text-ink" : "text-ink-2 hover:text-ink"
              }`}
            >
              {on && (
                <motion.span
                  layoutId="screen-pill"
                  className="absolute inset-0 rounded-full bg-ink/[0.07]"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              <span className="relative">{g.label}</span>
            </button>
          );
        })}
      </div>
      <div className="relative overflow-hidden rounded-[var(--r-xl)] border border-line bg-surface shadow-[var(--e3)]" style={{ aspectRatio: `${GRC_SCREEN_SIZE.width} / ${GRC_SCREEN_SIZE.height}` }}>
        <AnimatePresence initial={false}>
          <motion.img
            key={sc.key}
            src={sc.src}
            width={GRC_SCREEN_SIZE.width}
            height={GRC_SCREEN_SIZE.height}
            alt={sc.alt}
            initial={reduce ? false : { opacity: 0, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 block h-full w-full object-cover object-top"
            decoding="async"
          />
        </AnimatePresence>
      </div>
      <figcaption className="mt-3 flex items-center justify-between gap-4 font-mono text-[11px] text-ink-2">
        <span>{sc.label}, current build. Demo data: names and records are made up.</span>
        <span className="hidden sm:inline">
          {String(idx + 1).padStart(2, "0")} / {String(grcScreens.length).padStart(2, "0")}
        </span>
      </figcaption>
      {/* növbəti şəkilləri əvvəlcədən yüklə */}
      <div aria-hidden className="hidden">
        {grcScreens.map((g) => (
          <link key={g.key} rel="prefetch" href={g.src} as="image" />
        ))}
      </div>
    </figure>
  );
}

export function PlatformGRC() {
  usePageMeta(
    "Strativu GRC 360",
    "Strativu GRC 360 brings risks, assets, vendors, controls, audits and incidents into one system, in Azerbaijani and English, in the cloud or on your own servers."
  );
  return (
    <>
      <PageHeader
        eyebrow={
          <span className="inline-flex items-center gap-2.5">
            <img src="/projects/grc360/grc360-mark.webp" width={20} height={20} alt="" className="h-5 w-5" />
            {`Platform · GRC 360 · ${site.status.label}`}
          </span>
        }
        title="Governance, risk and compliance. All of it, in one place."
        lead="Twelve connected modules: risks, assets, vendors, controls, audits and incidents live in one system instead of a folder of spreadsheets."
      >
        <Btn to="/early-access" size="lg">
          Request early access
        </Btn>
      </PageHeader>

      {/* Real screens from the current build — not mock-ups. */}
      <div className="pb-4 pt-4 md:pt-8">
        <Container>
          <Reveal>
            <ScreenGallery />
          </Reveal>
        </Container>
      </div>

      {/* Figures — only numbers verified in the product */}
      <Section>
        <div>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-line pt-10 lg:grid-cols-4">
            {grcFigures.map((f, i) => (
              <Reveal key={f.label} delay={i * 0.06}>
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="block text-[clamp(44px,5vw,72px)] font-semibold leading-none tracking-[-0.04em] text-ink">
                    {f.value}
                    {f.suffix}
                  </span>
                  <span className="mt-3 block font-mono text-[12px] uppercase leading-[1.5] tracking-[0.12em] text-ink-3">
                    {f.label}
                  </span>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </Section>

      {/* Modules */}
      <Section id="modules" className="pt-0 md:pt-0">
        <Duo
          head={
            <Reveal>
              <Eyebrow>Modules</Eyebrow>
              <h2 className="t-h2 text-ink">Twelve modules. One model underneath.</h2>
            </Reveal>
          }
        >
          <Reveal>
            <p className={BODY_R}>Every module reads and writes the same records, so a risk, the asset it affects, the control that treats it and the audit finding that tests it stay linked. Thirty-one screens in all.</p>
          </Reveal>
        </Duo>
        <Reveal className="mt-12">
          <ModuleExplorer />
        </Reveal>
      </Section>

      <Section id="links" className="pt-0 md:pt-0">
        <Split visual={<Reveal><RiskLinks /></Reveal>}>
          <Reveal>
            <Eyebrow>Everything is linked</Eyebrow>
            <h2 className="t-h2 text-ink">No more links kept by hand.</h2>
            <p className={BODY}>
              A risk is tied directly to the controls, policies, assets, projects and framework requirements that treat it. In a
              spreadsheet those links are kept by hand and break; here they are part of the record.
            </p>
            <p className={BODY}>
              Scoring is 5×5, likelihood by impact, against your own risk-appetite thresholds, and the residual risk is calculated
              for you.
            </p>
          </Reveal>
        </Split>
      </Section>

      <Section id="mapping" className="pt-0 md:pt-0">
        <Split visual={<Reveal><ControlMap /></Reveal>}>
          <Reveal>
            <Eyebrow>Frameworks</Eyebrow>
            <h2 className="t-h2 text-ink">Any framework, as a package.</h2>
            <p className={BODY}>
              A framework is a compliance package: its requirements, linked to the controls that meet them. Packages are built in the
              product or imported from CSV, and Compliance Analysis shows the gaps per requirement.
            </p>
            <p className="mt-6 font-mono text-[12px] leading-[1.7] text-ink-3">
              Packages in the demo build: {grcFrameworkPackages.join(" · ")}
            </p>
            <div className="mt-8">
              <TextLink to="/coverage">Frameworks we work with</TextLink>
            </div>
          </Reveal>
        </Split>
      </Section>

      <Section id="alerts" className="pt-0 md:pt-0">
        <Split visual={<Reveal><AlertFeed /></Reveal>}>
          <Reveal>
            <Eyebrow>Alerts</Eyebrow>
            <h2 className="t-h2 text-ink">Nothing expires quietly.</h2>
            <p className={BODY}>
              Scheduled checks watch the dates: contracts that end in weeks, objective audits that are due, overdue targets and
              exceptions about to lapse. Owners are told before it becomes an audit finding.
            </p>
          </Reveal>
        </Split>
      </Section>

      <Section id="trust-center" className="pt-0 md:pt-0">
        <Duo
          head={
            <Reveal>
              <Eyebrow>Trust Center</Eyebrow>
              <h2 className="t-h2 text-ink">A public security page your customers can read before they ask.</h2>
            </Reveal>
          }
        >
          <Reveal>
            <p className={BODY_R}>
              A public security page for your customers: the practices you apply, how their data is handled, and an honest view of
              your certification roadmap.
            </p>
          </Reveal>
        </Duo>
      </Section>

      <Section id="access" className="pt-0 md:pt-0">
        <Split visual={<Reveal><SystemLog /></Reveal>}>
          <Reveal>
            <Eyebrow>Access and log</Eyebrow>
            <h2 className="t-h2 text-ink">Your directory, your permissions, every change logged.</h2>
            <p className={BODY}>
              Sign in with LDAP or Active Directory, OAuth or SAML single sign-on. Permissions are set per module and per action, and
              checked on the server. Creates, updates, deletes, sign-ins and permission changes go to a per-tenant system log.
            </p>
            <p className="mt-6 font-mono text-[12px] leading-[1.7] text-ink-3">{grcConnections.join(" · ")}</p>
          </Reveal>
        </Split>
      </Section>

      <Section id="deployment" className="pt-0 md:pt-0">
        <Duo
          head={
            <Reveal>
              <Eyebrow>Deployment</Eyebrow>
              <h2 className="t-h2 text-ink">In our cloud or on your servers.</h2>
            </Reveal>
          }
        >
          <Reveal>
            <p className={BODY_R}>
              Multi-tenant SaaS, or an on-premise and air-gapped install for banks, government and critical infrastructure. The
              on-premise build ships with Docker Compose.
            </p>
            <p className="mt-6 font-mono text-[12px] leading-[1.7] text-ink-3">{grcStack.join(" · ")}</p>
          </Reveal>
        </Duo>
      </Section>

      <Section id="local" className="pt-0 md:pt-0">
        <Duo
          head={
            <Reveal>
              <Eyebrow>Built in Baku</Eyebrow>
              <h2 className="t-h2 text-ink">In Azerbaijani, with Azerbaijani law ready to load as a package.</h2>
            </Reveal>
          }
        >
          <Reveal>
            <p className={BODY_R}>
              The whole interface is in Azerbaijani and English. The Law of the Republic of Azerbaijan on Personal Data (No. 998-IIIQ)
              loads as its own package, next to GDPR.
            </p>
          </Reveal>
        </Duo>
      </Section>

      <Section id="status" className="pt-0 md:pt-0">
        <Duo
          head={
            <Reveal>
              <Eyebrow>Where it stands</Eyebrow>
              <h2 className="t-h2 text-ink">Built in the open.</h2>
              <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Btn to="/early-access" size="lg">
                  Request early access
                </Btn>
                <TextLink to="/changelog">Build log</TextLink>
              </div>
            </Reveal>
          }
        >
          <Rows items={grcStatus.map((st) => ({ title: st.k, body: st.v }))} />
        </Duo>
      </Section>
    </>
  );
}

const ARCH: { h: string; p: ReactNode[] }[] = [
  {
    h: "Deployment",
    p: [
      "Multi-tenant SaaS, or on-premise and air-gapped for customers who keep data in their own data centre.",
      `The on-premise build is a Docker Compose stack: ${grcStack.join(", ")}.`,
    ],
  },
  {
    h: "Tenant isolation",
    p: ["Every record is scoped to a tenant at the query level, and cross-tenant access is covered by regression tests. One customer’s data is never returned to another."],
  },
  {
    h: "Sign-in and sessions",
    p: [
      "Email and password, LDAP or Active Directory, OAuth and SAML single sign-on. Passwords are stored as BCrypt hashes; connector secrets such as LDAP service-account passwords are stored encrypted and never returned by the API.",
      "Access tokens are short-lived and the refresh token lives in an HttpOnly cookie that scripts cannot read. Idle sessions are warned and then ended, and a user can end all of their sessions at once.",
    ],
  },
  {
    h: "Permissions",
    p: ["Permissions are granted per module and per action (view, create, edit, delete) through roles, users, departments and groups. Every API endpoint checks them on the server; hiding a button is never the only barrier."],
  },
  {
    h: "System log",
    p: ["Creates, updates, deletes, sign-ins and permission changes are written to a per-tenant system log with the acting user and a timestamp."],
  },
  {
    h: "API",
    p: ["The web application is a client of a REST API with more than 600 endpoints. CSV import and export work on every register. A full OpenAPI contract is in progress."],
  },
];

/** Section id = heading lowercased, spaces to "-" (kept stable for #anchor links). */
const slug = (h: string) => h.toLowerCase().replace(/\s+/g, "-");

export function Architecture() {
  usePageMeta("Architecture", "Deployment, tenant isolation, sign-in, permissions, system log and API, written for the engineer doing the vendor review.");
  return (
    <>
      <PageHeader
        eyebrow="Platform · Architecture"
        title="How GRC 360 is built."
        lead="Written for the engineer doing the vendor review. Until we have a SOC 2 report, this is what we can show."
      />

      <div className="pb-24 pt-4 md:pb-36 md:pt-8">
        <Container>
          <div className="border-b border-line">
            {ARCH.map((a, i) => (
              <section key={a.h} id={slug(a.h)} className="scroll-mt-24 border-t border-line py-10 md:py-12">
                <Reveal className="grid grid-cols-[48px_1fr] gap-x-4 gap-y-4 md:grid-cols-[64px_1fr] lg:grid-cols-[64px_minmax(0,4fr)_minmax(0,7fr)] lg:gap-x-12">
                  <span className="pt-1.5 font-mono text-[13px] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="t-h3 text-ink">{a.h}</h2>
                  <div className="col-start-2 min-w-0 lg:col-start-3">
                    {a.p.map((t, j) => (
                      <p key={j} className={`${j ? "mt-4" : ""} max-w-[60ch] text-[16.5px] leading-[1.7] text-ink-2`}>
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
        </Container>
      </div>
    </>
  );
}
