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
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Btn, Container, Duo, Rows, TextLink } from "../components/site/primitives";
import { Reveal, Stagger } from "../components/site/Reveal";
import { ClosingCTA } from "../components/site/ClosingCTA";
import { formatLogDate } from "../components/site/ChangelogList";
import { Film, FilmScenes } from "../components/site/Film";
import { AlertFeed, RiskLinks, Split, SystemLog } from "../components/site/Visuals";
import { changelog } from "../data/changelog";
import { frameworks } from "../data/coverage";
import { site } from "../data/site";
import { products } from "../data/products";
import { grcModules } from "../data/grc360";

/**
 * Ana səhifə.
 * Açılışda 3D loqo ekranın mərkəzindədir (əsas vizual); scroll etdikcə mərkəzdə qalıb 360° fırlanır və yumşalır,
 * sonda "Let's talk" üstündə yenidən parlaq və üzü qabağa dayanır (LogoScene → CHOREO.home, SCREENS_PER_TURN).
 * Masaüstündə mətn solda (~56%) qalır ki, sağdakı loqo heç vaxt örtülməsin.
 * Bütün rəqəmlər saytın öz datasından gəlir — uydurma statistika yoxdur.
 */

const STATEMENT = "Software that makes risk visible, compliance routine and audits calm.";

const WHAT_WE_DO = [
  { n: "01", title: "Products", line: "We design and build our own software. GRC 360 is the first.", to: "/platform" },
  { n: "02", title: "Made for the region", line: "Azerbaijani and English, Azerbaijani law as a package, in the cloud or on your servers.", to: "/platform/grc#local" },
  { n: "03", title: "Built in the open", line: "What we ship and what is next is public.", to: "/changelog" },
];

const BELIEF_VISUALS = [RiskLinks, AlertFeed, SystemLog];

const BELIEFS = [
  {
    title: "Software should remove work, not move it.",
    body: "If a spreadsheet, an email chain and a shared folder are holding a process together, the tool has not done its job.",
  },
  {
    title: "Built where we live.",
    body: "Azerbaijani language, Azerbaijani law and on-premise installs come first, not as a later localisation.",
  },
  {
    title: "Honest about where we are.",
    body: "We say what works today, what is in progress and what is next. Nothing more.",
  },
];

/** "Who we are" — sağ tərəfdəki qısa şirkət məlumatı. */
const GLANCE = [
  { k: "Company", v: `${site.company.legalName}, Baku` },
  { k: "First product", v: "Strativu GRC 360" },
  { k: "Status", v: site.status.label },
  { k: "Next", v: site.status.detail },
];

/** Strativu haqqında qısa, doğru rəqəmlər. */
const FACTS: { value: number; suffix?: string; label: string }[] = [
  { value: products.length, label: products.length === 1 ? "product in development" : "products" },
  { value: grcModules.length, label: "modules in GRC 360" },
  { value: 2, label: "languages, Azerbaijani and English" },
  { value: 2, label: "ways to run it: cloud or on-premise" },
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

/** true from the lg breakpoint (1024px) up — the pinned "What we believe" needs the side visual and the height. */
function useWide() {
  const q = "(min-width: 1024px)";
  const [wide, setWide] = useState(() => typeof window !== "undefined" && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setWide(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return wide;
}

function Beliefs() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const wide = useWide();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) =>
    setActive(Math.min(BELIEFS.length - 1, Math.max(0, Math.floor(v * BELIEFS.length))))
  );

  // Phones, tablets and reduced motion: a short static list instead of the 320svh pinned section.
  if (reduce || !wide) {
    return (
      <section className="py-24 md:py-36">
        <Container>
          <h2 className="eyebrow">What we believe</h2>
          <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-14 border-t border-line pt-10 md:grid-cols-3">
            {BELIEFS.map((b, i) => (
              <div key={i}>
                <h3 className="t-h3 text-ink">{b.title}</h3>
                <p className="mt-4 max-w-[40ch] text-[16px] leading-[1.65] text-ink-2">{b.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  const b = BELIEFS[active];
  const Visual = BELIEF_VISUALS[active];
  return (
    <section ref={ref} className="relative h-[320svh]">
      {/* All three beliefs for screen readers; the animated copy below shows one at a time. */}
      <div className="sr-only">
        <h2>What we believe</h2>
        <ul>
          {BELIEFS.map((x) => (
            <li key={x.title}>
              {x.title} {x.body}
            </li>
          ))}
        </ul>
      </div>
      <div aria-hidden className="sticky top-0 flex h-[100svh] items-center">
        <Container>
          <Split
            visual={
              <div className="hidden lg:block">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Visual />
                  </motion.div>
                </AnimatePresence>
              </div>
            }
          >
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
          </Split>
        </Container>
      </div>
    </section>
  );
}

/* ── Product shot eases up and scales in as it enters ── */
function WorkShot({ image, video }: { image?: { src: string; width: number; height: number; alt: string }; video?: { src: string; webm?: string; poster: string } }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.3, 1]);
  return (
    <motion.div ref={ref} style={reduce ? undefined : { scale, opacity }} className="origin-bottom">
      <div className="overflow-hidden rounded-[var(--r-xl)] border border-line bg-surface shadow-[var(--e3)]">
        {video ? (
          <Film src={video.src} webm={video.webm} poster={video.poster} label="GRC 360 product film" describedBy="home-film-scenes" />
        ) : (
          image && (
            <img
              src={image.src}
              width={image.width}
              height={image.height}
              alt={image.alt}
              className="block h-auto w-full"
              loading="lazy"
              decoding="async"
            />
          )
        )}
      </div>
    </motion.div>
  );
}

/* ── One figure: a brand line draws across the top, the number counts up, a short label below ── */
function Fact({ value, suffix, label, i }: { value: number; suffix?: string; label: string; i: number }) {
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
        <span className="block text-[clamp(52px,6.2vw,92px)] font-semibold leading-[0.9] tracking-[-0.04em] text-ink">
          <CountUp to={value} />
          {suffix}
        </span>
        <span aria-hidden className="mt-5 block max-w-[20ch] font-mono text-[12px] uppercase leading-[1.6] tracking-[0.12em] text-ink-3">
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
      <span aria-hidden>{n}</span>
      <span className="sr-only">{to}</span>
    </span>
  );
}

/** Lentdə yalnız bu gün paket kimi işləyən framework-lər göstərilir (planlaşdırılanlar /coverage-dədir). */
const packageFrameworks = frameworks.filter((f) => f.status === "package");

/* ── Framework names drifting slowly sideways ── */
function FrameworkMarquee() {
  const base = packageFrameworks.map((f) => f.id.split(" (")[0]);
  // Qısa siyahı ekranı doldurmur: bir sətirdə iki dəfə təkrarlanır ki, lent boşluqsuz dövr etsin.
  const names = base.length < 8 ? [...base, ...base] : base;
  const reduce = useReducedMotion();
  if (reduce) {
    // No movement: the names as a calm wrapped list.
    return (
      <Container>
        <ul className="flex flex-wrap gap-x-10 gap-y-4">
          {base.map((n) => (
            <li key={n} className="flex items-center gap-4 text-[clamp(20px,2.4vw,32px)] tracking-[-0.015em] text-ink-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand/60" aria-hidden />
              {n}
            </li>
          ))}
        </ul>
      </Container>
    );
  }
  const row = (hidden?: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {names.map((n, i) => (
        <li
          key={`${n}-${i}`}
          aria-hidden={i >= base.length || undefined}
          className="flex items-center gap-10 whitespace-nowrap pr-10 text-[clamp(20px,2.4vw,32px)] tracking-[-0.015em] text-ink-2"
        >
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

const featured = products.filter((p) => p.featured);

export default function Home() {

  return (
    <>
      {/* ── 01 Intro: the 3D mark is centred above this; headline sits below it ── */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-end pb-[12svh] text-center md:pb-[9svh]">
        <Container>
          {/* 3D səhnə qurulmayanda (reduce motion, WebGL yoxdur, zəif cihaz) yerində sadə loqo göstərilir (theme.css → .logo-fallback). */}
          <img
            src={site.logo.mark}
            alt=""
            aria-hidden
            width={207}
            height={144}
            className="logo-fallback mx-auto mb-14 h-auto w-[min(56vw,300px)]"
          />
          {/* Not faded in: the headline is painted at once (LCP); it only rises into place. */}
          <Stagger fade={false}>
            <h1 className="mx-auto max-w-[16ch] text-[clamp(40px,min(6vw,9.5svh),84px)] font-semibold leading-[1.02] tracking-[-0.032em] text-ink">
              We build software for <span className="text-brand">risk and compliance.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-[46ch] text-[clamp(16px,1.3vw,19px)] leading-[1.55] text-ink-2">
              Our first product, Strativu GRC 360, brings risks, controls, audits and compliance into one system.
            </p>
            <div className="mt-7 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-7">
              <Btn to="/early-access" size="lg">
                Request early access
              </Btn>
              <p className="chapter">
                <b className="whitespace-nowrap">{site.status.label}</b> · <span className="whitespace-nowrap">{site.status.detail}</span>
              </p>
            </div>
          </Stagger>
        </Container>
        <div className="absolute inset-x-0 bottom-6 flex justify-center">
          <span className="scroll-cue" aria-hidden />
        </div>
      </section>

      {/* ── 02 Who we are: statement on the left, the company at a glance on the right ── */}
      <section className="py-28 md:py-44">
        <Container>
          <div className="grid grid-cols-1 gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end xl:gap-x-24">
            <Statement />
            <Reveal>
              <p className="t-lead max-w-[46ch]">
                Strativu is a software company in Baku. We build products that help organisations run governance, risk and
                compliance with less paperwork.
              </p>
              <dl className="mt-10 border-t border-line">
                {GLANCE.map((g) => (
                  <div key={g.k} className="flex items-baseline justify-between gap-6 border-b border-line py-3.5">
                    <dt className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-ink-3">{g.k}</dt>
                    <dd className="text-right text-[15px] text-ink">{g.v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Btn to="/early-access" size="lg">
                  Request early access
                </Btn>
                <TextLink to="/platform">See the platform</TextLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── 03 What we do: heading row, then three columns across the page ── */}
      <section className="py-24 md:py-36">
        <Container>
          <Duo
            head={
              <Reveal>
                <p className="eyebrow">What we do</p>
                <h2 className="t-h2 mt-5 text-ink">Products for governance, risk and compliance.</h2>
              </Reveal>
            }
          >
            <Reveal>
              <p className="t-lead max-w-[46ch]">
                We design, build and run our own software, for organisations that answer to regulators, auditors and customers.
              </p>
            </Reveal>
          </Duo>
          <ol className="mt-16 grid grid-cols-1 border-t border-line md:grid-cols-3">
            {WHAT_WE_DO.map((w, i) => (
              <Reveal
                as="li"
                key={w.n}
                delay={i * 0.08}
                className={`border-b border-line md:border-b-0 ${i > 0 ? "md:border-l md:border-line" : ""}`}
              >
                <Link to={w.to} className="group flex h-full flex-col py-8 md:px-8 md:py-10 md:first:pl-0">
                  <span className="font-mono text-[12px] text-brand-ink">{w.n}</span>
                  <span className="t-h3 mt-6 text-ink transition-colors group-hover:text-brand">{w.title}</span>
                  <span className="mt-3 max-w-[34ch] text-[16px] leading-[1.6] text-ink-2">{w.line}</span>
                  <ArrowRight
                    className="mt-8 h-4 w-4 text-ink-3 transition-all duration-200 group-hover:translate-x-1 group-hover:text-brand"
                    aria-hidden
                  />
                </Link>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* ── 04 What we believe: pinned, three statements ── */}
      <Beliefs />

      {/* ── 05 Our work (from data/products.ts): text on the left, the film on the right ── */}
      {featured.length > 0 && (
      <section className="py-24 md:py-36">
        <Container>
          <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:items-center xl:gap-x-20">
            <Reveal>
              <p className="eyebrow">Our work</p>
              <h2 className="t-h2 mt-5 text-ink">{featured[0].name}</h2>
              <p className="mt-4 max-w-[40ch] text-[17px] leading-[1.6] text-ink-2">{featured[0].summary}</p>
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-[13px] text-ink-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
                {featured[0].status}
              </p>
              <div className="mt-8">
                {featured[0].to ? (
                  <TextLink to={featured[0].to}>View {featured[0].name}</TextLink>
                ) : (
                  featured[0].href && <TextLink href={featured[0].href}>View {featured[0].name}</TextLink>
                )}
              </div>
            </Reveal>
            {(featured[0].image || featured[0].video) && (
              <div>
                <WorkShot image={featured[0].image} video={featured[0].video} />
                {featured[0].video && <FilmScenes id="home-film-scenes" className="mt-3" />}
              </div>
            )}
          </div>
          {featured.length > 1 && (
            <Rows
              className="mt-14"
              items={featured.slice(1).map((pr) => ({ title: pr.name, body: pr.summary, meta: pr.status, to: pr.to, href: pr.href }))}
            />
          )}
        </Container>
      </section>
      )}

      {/* ── 06 In numbers (all from the site's own data) ── */}
      <section className="py-24 md:py-36">
        <Container>
          <Duo
            head={
              <Reveal>
                <p className="eyebrow">In numbers</p>
                <h2 className="t-h2 mt-5 max-w-[18ch] text-ink">Strativu in figures.</h2>
              </Reveal>
            }
          >
            <Reveal>
              <p className="t-lead max-w-[46ch]">Small on purpose. Every number here is true today.</p>
            </Reveal>
          </Duo>
          <dl className="mt-14 grid grid-cols-2 md:grid-cols-4">
            {FACTS.map((f, i) => (
              <Fact key={f.label} value={f.value} suffix={f.suffix} label={f.label} i={i} />
            ))}
          </dl>
        </Container>
      </section>

      {/* ── 07 Frameworks, drifting ── */}
      <section className="py-20 md:py-28">
        <Container>
          <Reveal>
            <p className="eyebrow">GRC 360 works with</p>
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

      {/* ── 08 Latest from the build log: heading left, entries right ── */}
      <section className="py-24 md:py-36">
        <Container>
          <Duo
            head={
              <Reveal>
                <p className="eyebrow">Build log</p>
                <h2 className="t-h2 mt-5 text-ink">What shipped recently.</h2>
                <div className="mt-8">
                  <TextLink to="/changelog">Full build log</TextLink>
                </div>
              </Reveal>
            }
          >
            <Rows items={changelog.slice(0, 3).map((e) => ({ title: e.title, meta: formatLogDate(e.date), to: "/changelog" }))} />
          </Duo>
        </Container>
      </section>

      {/* ── 09 Closing: the 3D mark returns to centre above this ── */}
      <ClosingCTA stage title="Let’s talk." body="Tell us about your compliance programme. A person replies within two working days." />
    </>
  );
}
