import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Btn, Container, Lane, Rows, TextLink } from "../components/site/primitives";
import { Reveal, Stagger } from "../components/site/Reveal";
import { ClosingCTA } from "../components/site/ClosingCTA";
import { usePageMeta } from "../components/site/Seo";
import { frameworks } from "../data/coverage";
import { site } from "../data/site";

/**
 * Ana səhifə — qəsdən sadə: kim olduğumuz, nə etdiyimiz, ən yaxşı işimiz.
 * Masaüstündə mətn solda (~56%) qalır ki, sağdakı 3D loqo heç vaxt örtülməsin.
 */

const STATEMENT = "One control set. Every framework. Evidence the system collects itself.";

const WHAT_WE_DO = [
  { n: "01", title: "Controls", line: "Write a control once and map it to every framework you are audited against.", to: "/platform/grc#mapping" },
  { n: "02", title: "Evidence", line: "Collectors read your systems on a schedule and attach proof automatically.", to: "/platform/grc#evidence" },
  { n: "03", title: "Audit trail", line: "Every change is recorded in a tamper-evident log your auditor can follow.", to: "/platform/grc#audit" },
];

/* Words light up one by one as the line scrolls through the viewport. */
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

/* Product shot eases up and scales in as it enters. */
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

export default function Home() {
  usePageMeta(
    null,
    "Strativu is building a GRC platform where one control set satisfies every framework and evidence is collected by the system, not the team."
  );

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative flex min-h-[100svh] flex-col justify-end pb-16 pt-[42svh] md:justify-center md:pb-0 md:pt-16">
        <Container>
          <Lane>
            <Stagger>
              <p className="chapter">
                <b>{site.status.label}</b> · {site.status.detail}
              </p>
              <h1 className="t-display mt-6 text-ink">
                Compliance evidence, <span className="text-brand">engineered.</span>
              </h1>
              <p className="t-lead mt-6 max-w-[44ch]">
                We build GRC software that keeps your controls, evidence and audit trail in one place.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Btn to="/early-access" size="lg">
                  Request early access
                </Btn>
                <TextLink to="/platform">See the platform</TextLink>
              </div>
            </Stagger>
          </Lane>
        </Container>
        <div className="absolute inset-x-0 bottom-8 hidden justify-center md:flex">
          <span className="scroll-cue" aria-hidden />
        </div>
      </section>

      {/* ── Statement ── */}
      <section className="py-32 md:py-48">
        <Container>
          <Lane>
            <Statement />
          </Lane>
        </Container>
      </section>

      {/* ── What we do ── */}
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

      {/* ── Our work ── */}
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

      {/* ── Frameworks ── */}
      <section className="py-24 md:py-32">
        <Container>
          <Lane>
            <Reveal>
              <p className="eyebrow">Built for</p>
              <p className="mt-6 text-[clamp(20px,2.2vw,28px)] leading-[1.5] tracking-[-0.015em] text-ink">
                {frameworks
                  .filter((f) => f.status !== "planned")
                  .map((f) => f.id.split(" (")[0])
                  .join(" · ")}
              </p>
              <div className="mt-8">
                <TextLink to="/coverage">All {frameworks.length} frameworks</TextLink>
              </div>
            </Reveal>
          </Lane>
        </Container>
      </section>

      {/* ── Closing: the 3D mark returns to centre above this ── */}
      <ClosingCTA stage title="Let’s talk." body="Tell us about your compliance programme. A person replies within two working days." />
    </>
  );
}
