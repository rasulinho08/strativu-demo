import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Btn, Container, Lane, Rows, TextLink } from "../components/site/primitives";
import { Reveal, Stagger } from "../components/site/Reveal";
import { ClosingCTA } from "../components/site/ClosingCTA";
import { formatLogDate } from "../components/site/ChangelogList";
import { usePageMeta } from "../components/site/Seo";
import { changelog } from "../data/changelog";
import { frameworks } from "../data/coverage";
import { site } from "../data/site";

/**
 * Ana səhifə.
 * Açılışda 3D loqo ekranın mərkəzindədir (əsas vizual); scroll etdikcə mərkəzdə qalıb 360° fırlanır və yumşalır,
 * sonda "Let's talk" üstündə yenidən parlaq və üzü qabağa dayanır (LogoScene → CHOREO.home, SCREENS_PER_TURN).
 * Masaüstündə mətn solda (~56%) qalır ki, sağdakı loqo heç vaxt örtülməsin.
 * Bütün rəqəmlər saytın öz datasından gəlir — uydurma statistika yoxdur.
 */

const STATEMENT = "One control set. Every framework. Evidence the system collects itself.";

const WHAT_WE_DO = [
  { n: "01", title: "Controls", line: "Write a control once and map it to every framework you are audited against.", to: "/platform/grc#mapping" },
  { n: "02", title: "Evidence", line: "Collectors read your systems on a schedule and attach proof automatically.", to: "/platform/grc#evidence" },
  { n: "03", title: "Audit trail", line: "Every change is recorded in a tamper-evident log your auditor can follow.", to: "/platform/grc#audit" },
];

const BELIEFS = [
  {
    title: "Evidence should be collected by the system, not the team.",
    body: "If a configuration proves a control, the platform reads it on a schedule. People review exceptions; they do not take screenshots.",
  },
  {
    title: "One control set is enough. Frameworks are views on it.",
    body: "ISO 27001, SOC 2 and NIST CSF ask overlapping questions. One register means one answer.",
  },
  {
    title: "The audit trail is the product, not a feature of it.",
    body: "Every screen is a projection of what changed, by whom and when. That log is complete and tamper-evident from the first commit.",
  },
];

/** Facts from the site's own data (coverage.ts, the GRC product page). */
const FACTS = [
  { value: frameworks.length, label: "frameworks on the coverage map" },
  { value: 93, label: "ISO 27001 Annex A controls modelled" },
  { value: 2, label: "evidence collectors live today" },
  { value: 1, label: "control set behind all of them" },
];

/* ── Statement: words light up one by one as it scrolls through the viewport ── */
function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}&nbsp;
    </motion.span>
  );
}

function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 50%"] });
  const words = STATEMENT.split(" ");
  return (
    <p ref={ref} className="t-h1 text-ink">
      {reduce
        ? STATEMENT
        : words.map((w, i) => (
            <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
          ))}
    </p>
  );
}

/* ── Beliefs: pinned while three statements change with scroll ── */
function BeliefBar({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const fill = useTransform(progress, (v) => Math.min(1, Math.max(0, v * BELIEFS.length - i)));
  return (
    <span className="relative h-[2px] w-12 overflow-hidden bg-line">
      <motion.span style={{ scaleX: fill }} className="absolute inset-0 origin-left bg-brand" />
    </span>
  );
}

function Beliefs() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) =>
    setActive(Math.min(BELIEFS.length - 1, Math.max(0, Math.floor(v * BELIEFS.length))))
  );

  if (reduce) {
    return (
      <section className="py-24 md:py-36">
        <Container>
          <Lane>
            <p className="eyebrow">What we believe</p>
            <div className="mt-10 space-y-16">
              {BELIEFS.map((b, i) => (
                <div key={i}>
                  <h3 className="t-h2 text-ink">{b.title}</h3>
                  <p className="mt-5 max-w-[48ch] text-[17px] leading-[1.65] text-ink-2">{b.body}</p>
                </div>
              ))}
            </div>
          </Lane>
        </Container>
      </section>
    );
  }

  const b = BELIEFS[active];
  return (
    <section ref={ref} className="relative h-[320svh]">
      <div className="sticky top-0 flex h-[100svh] items-center">
        <Container>
          <Lane>
            <p className="eyebrow">What we believe</p>
            <div className="mt-10 min-h-[340px] md:min-h-[380px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -28, filter: "blur(6px)" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h3 className="t-h1 text-ink">{b.title}</h3>
                  <p className="mt-6 max-w-[48ch] text-[17px] leading-[1.65] text-ink-2">{b.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-6 flex gap-2" aria-hidden>
              {BELIEFS.map((_, i) => (
                <BeliefBar key={i} i={i} progress={scrollYProgress} />
              ))}
            </div>
          </Lane>
        </Container>
      </div>
    </section>
  );
}

/* ── Product shot eases up and scales in as it enters ── */
function WorkShot() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.3, 1]);
  return (
    <motion.div ref={ref} style={reduce ? undefined : { scale, opacity }} className="origin-bottom">
      <div className="overflow-hidden rounded-[var(--r-xl)] border border-line bg-surface shadow-[var(--e3)]">
        <img
          src="/projects/grc.webp"
          width={1800}
          height={811}
          alt="Strativu GRC development build: command centre with task lists and an asset-risk heat map."
          className="block h-auto w-full"
          loading="lazy"
          decoding="async"
        />
      </div>
    </motion.div>
  );
}

/* ── One figure: a brand line draws across the top, the number counts up, a short label below ── */
function Fact({ value, label, i }: { value: number; label: string; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  return (
    <div
      ref={ref}
      className={[
        "relative pb-10 pt-8 md:pb-2 md:pr-6",
        // mobil 2×2: sağ sütunda sol xətt; masaüstü 4 sütun: birincidən başqa hamısında sol xətt
        i % 2 === 1 ? "border-l border-line pl-6" : "pr-6",
        i > 0 ? "md:border-l md:border-line md:pl-8" : "",
      ].join(" ")}
    >
      {/* üst xətt: boz fon + görünəndə soldan sağa çəkilən brend xətti */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-line" />
      <motion.span
        aria-hidden
        className="absolute left-0 top-0 h-[2px] w-full origin-left bg-brand"
        initial={reduce ? false : { scaleX: 0 }}
        animate={inView || reduce ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.1, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
      />
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="block text-[clamp(56px,7vw,104px)] font-semibold leading-[0.9] tracking-[-0.04em] text-ink">
          <CountUp to={value} />
        </span>
        <span className="mt-5 block max-w-[20ch] font-mono text-[12px] uppercase leading-[1.6] tracking-[0.12em] text-ink-3">
          {label}
        </span>
      </dd>
    </div>
  );
}

/* ── A number that counts up once when it scrolls into view ── */
function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      setN(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, to]);
  return (
    <span ref={ref} className="tabular">
      {n}
    </span>
  );
}

/* ── Framework names drifting slowly sideways ── */
function FrameworkMarquee() {
  const names = frameworks.map((f) => f.id.split(" (")[0]);
  const row = (hidden?: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {names.map((n) => (
        <li key={n} className="flex items-center gap-10 whitespace-nowrap pr-10 text-[clamp(20px,2.4vw,32px)] tracking-[-0.015em] text-ink-2">
          <span className="h-1.5 w-1.5 rounded-full bg-brand/60" aria-hidden />
          {n}
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee marquee-mask overflow-hidden">
      <div className="marquee-track" style={{ ["--marquee-duration" as string]: "60s" }}>
        {row()}
        {row(true)}
      </div>
    </div>
  );
}

export default function Home() {
  usePageMeta(
    null,
    "Strativu is building a GRC platform where one control set maps to the frameworks you are audited against and evidence is collected by the system, not the team."
  );

  return (
    <>
      {/* ── 01 Intro: the 3D mark is centred above this; headline sits below it ── */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-end pb-[12svh] text-center md:pb-[9svh]">
        <Container>
          {/* 3D səhnə "reduce motion" rejimində qurulmur — onda yerində sadə loqo göstərilir. */}
          <img
            src={site.logo.mark}
            alt=""
            aria-hidden
            className="mx-auto mb-14 hidden h-auto w-[min(56vw,300px)] motion-reduce:block"
          />
          <Stagger>
            <h1 className="mx-auto max-w-[16ch] text-[clamp(40px,6vw,84px)] font-semibold leading-[1.02] tracking-[-0.032em] text-ink">
              Compliance evidence, <span className="text-brand">engineered.</span>
            </h1>
            <p className="chapter mt-7">
              <b>{site.status.label}</b> · {site.status.detail}
            </p>
          </Stagger>
        </Container>
        <div className="absolute inset-x-0 bottom-6 flex justify-center">
          <span className="scroll-cue" aria-hidden />
        </div>
      </section>

      {/* ── 02 What we are building: the mark settles on the right as this arrives ── */}
      <section className="py-28 md:py-44">
        <Container>
          <Lane>
            <Statement />
            <Reveal>
              <p className="t-lead mt-10 max-w-[46ch]">
                We build GRC software that keeps your controls, evidence and audit trail in one place.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Btn to="/early-access" size="lg">
                  Request early access
                </Btn>
                <TextLink to="/platform">See the platform</TextLink>
              </div>
            </Reveal>
          </Lane>
        </Container>
      </section>

      {/* ── 03 What we do ── */}
      <section className="py-24 md:py-36">
        <Container>
          <Lane>
            <Reveal>
              <p className="eyebrow">What we do</p>
            </Reveal>
            <Rows className="mt-10" items={WHAT_WE_DO.map((w) => ({ n: w.n, title: w.title, body: w.line, to: w.to }))} />
          </Lane>
        </Container>
      </section>

      {/* ── 04 What we believe: pinned, three statements ── */}
      <Beliefs />

      {/* ── 05 Our work ── */}
      <section className="py-24 md:py-36">
        <Container>
          <Lane>
            <Reveal>
              <p className="eyebrow">Our work</p>
              <h2 className="t-h2 mt-5 text-ink">Strativu GRC</h2>
              <p className="mt-4 max-w-[48ch] text-[17px] leading-[1.6] text-ink-2">
                Our first product, in active development. This is the working build.
              </p>
            </Reveal>
            <div className="mt-12">
              <WorkShot />
            </div>
            <Reveal className="mt-8">
              <TextLink to="/platform/grc">View the product</TextLink>
            </Reveal>
          </Lane>
        </Container>
      </section>

      {/* ── 06 In numbers (all from the site's own data) ── */}
      <section className="py-24 md:py-36">
        <Container>
          <Reveal>
            <p className="eyebrow">In numbers</p>
            <h2 className="t-h2 mt-5 max-w-[18ch] text-ink">The platform in figures.</h2>
          </Reveal>
          <dl className="mt-14 grid grid-cols-2 md:grid-cols-4">
            {FACTS.map((f, i) => (
              <Fact key={f.label} value={f.value} label={f.label} i={i} />
            ))}
          </dl>
        </Container>
      </section>

      {/* ── 07 Frameworks, drifting ── */}
      <section className="py-20 md:py-28">
        <Container>
          <Reveal>
            <p className="eyebrow">Built for</p>
          </Reveal>
        </Container>
        <div className="mt-10">
          <FrameworkMarquee />
        </div>
        <Container>
          <div className="mt-10">
            <TextLink to="/coverage">All {frameworks.length} frameworks and their status</TextLink>
          </div>
        </Container>
      </section>

      {/* ── 08 Latest from the build log ── */}
      <section className="py-24 md:py-36">
        <Container>
          <Lane>
            <Reveal>
              <p className="eyebrow">Build log</p>
              <h2 className="t-h2 mt-5 text-ink">What shipped recently.</h2>
            </Reveal>
            <Rows
              className="mt-10"
              items={changelog.slice(0, 3).map((e) => ({ title: e.title, meta: formatLogDate(e.date), to: "/changelog" }))}
            />
            <Reveal className="mt-8">
              <TextLink to="/changelog">Full build log</TextLink>
            </Reveal>
          </Lane>
        </Container>
      </section>

      {/* ── 09 Closing: the 3D mark returns to centre above this ── */}
      <ClosingCTA stage title="Let’s talk." body="Tell us about your compliance programme. A person replies within two working days." />
    </>
  );
}
