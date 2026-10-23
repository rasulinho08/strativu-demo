import { Link } from "react-router";
import { Btn, Eyebrow, PageHeader, Section } from "../components/site/primitives";
import { Reveal } from "../components/site/Reveal";

/**
 * /products/cipher — "Coming soon" page for Cipher by Strativu (AI security; the AI Proxy card on /products links here).
 * Source: Strativuco/cipher (README, doc/plan/04-marketinq-plan.md). The product is in the design and architecture stage,
 * so this page says what it will do, with no dates and no claims of finished features (no "100%", no certifications).
 * Cipher's own colour (indigo, design/tokens/tokens.json → brand.500) appears only on this page and its card.
 */

const INDIGO = "#5A5AF0";
/** Indigo as text: darker in light mode, lighter in dark mode, so it keeps ≥4.5:1 contrast (WCAG 1.4.3). */
const INDIGO_TEXT = "text-[#4747D4] dark:text-[#9AA0F7]";

const POINTS = [
  {
    n: "01",
    title: "Sensitive data stays in",
    body: "Personal data, secrets and source code are caught on the employee's device, before a prompt is sent to an AI tool.",
    tags: ["Mask", "Redact", "Coach", "Block"],
  },
  {
    n: "02",
    title: "Your own AI, protected",
    body: "Prompt injection, jailbreaks and system-prompt theft are stopped at the gateway in front of your AI. One line to connect: base_url.",
  },
  {
    n: "03",
    title: "Your rules, your servers",
    body: "Policies by role, team, AI provider and data type. In the cloud, on-premise or air-gapped.",
  },
];

function CipherBar() {
  return (
    <nav aria-label="Cipher" className="border-b border-line pb-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px]">
        <Link to="/products" className="-my-2 py-2 text-ink-3 transition-colors hover:text-ink">
          <span aria-hidden>← </span>Products
        </Link>
        <span aria-hidden className="text-ink-4">
          /
        </span>
        <span className="inline-flex items-center gap-2 font-medium text-ink">
          <img src="/projects/cipher/cipher-mark.svg" width={20} height={20} alt="" className="h-5 w-5" />
          Cipher <span className="font-normal text-ink-3">by Strativu</span>
        </span>
      </div>
    </nav>
  );
}

/** Your people → Cipher → AI tools: where it sits, in one line. */
function Flow() {
  const node = "rounded-[var(--r-md)] border border-line bg-surface px-4 py-3 text-center font-mono text-[12.5px] text-ink-2 whitespace-nowrap";
  // Phones: a vertical chain (no horizontal scrolling); from sm: one row.
  const line = "self-center h-6 w-px border-l border-dashed sm:h-px sm:w-auto sm:min-w-6 sm:flex-1 sm:border-l-0 sm:border-t";
  return (
    <figure
      aria-label="Cipher sits between your people and the AI tools they use, and in front of your own AI."
      className="flex flex-col items-stretch sm:flex-row sm:items-center"
    >
      <span className={node}>Your people</span>
      <span aria-hidden className={line} style={{ borderColor: INDIGO }} />
      <span
        className={`rounded-[var(--r-md)] border px-4 py-3 text-center font-mono text-[12.5px] font-semibold whitespace-nowrap ${INDIGO_TEXT}`}
        style={{ borderColor: `color-mix(in srgb, ${INDIGO} 45%, transparent)`, background: `color-mix(in srgb, ${INDIGO} 10%, var(--surface))` }}
      >
        Cipher
      </span>
      <span aria-hidden className={line} style={{ borderColor: INDIGO }} />
      <span className={node}>AI tools · your AI</span>
    </figure>
  );
}

export function Cipher() {
  return (
    <>
      <PageHeader
        top={<CipherBar />}
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: INDIGO }} />
            Coming soon
          </span>
        }
        title={
          <>
            Use AI at work. <span className={INDIGO_TEXT}>Keep your data in.</span>
          </>
        }
        lead="Cipher is a security layer between your company and AI. It checks what goes out to AI tools, and what comes in to your own AI, before it does harm."
      >
        <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
          <Btn to="/contact?topic=Product%20inquiry" size="lg">
            Tell me when it’s ready
          </Btn>
        </div>
      </PageHeader>

      <Section className="pt-0 md:pt-4">
        <Reveal>
          <Flow />
        </Reveal>
        <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {POINTS.map((p, i) => (
            <Reveal as="li" key={p.n} delay={i * 0.06} className="min-w-0">
              <article className="relative h-full overflow-hidden rounded-[var(--r-xl)] border border-line bg-surface p-6 md:p-8">
                <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: INDIGO, opacity: 0.85 }} />
                <span className={`font-mono text-[12px] ${INDIGO_TEXT}`}>
                  {p.n}
                </span>
                <h2 className="t-h3 mt-5 text-ink">{p.title}</h2>
                <p className="mt-3 text-[16px] leading-[1.6] text-ink-2">{p.body}</p>
                {p.tags && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[12px] text-ink-2">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section className="pt-0 md:pt-0">
          <Reveal>
            <div className="border-t border-line pt-10">
              <Eyebrow>The next product in the Strativu ecosystem</Eyebrow>
              <p className="mt-4 max-w-[56ch] text-[17px] leading-[1.65] text-ink-2">
                Cipher is being designed now, for banks, public bodies and companies whose people already use AI. Want to know first, or
                have a use case we should hear? Write to us.
              </p>
              <div className="mt-8">
                <Btn to="/contact?topic=Product%20inquiry" variant="secondary">
                  Contact us
                </Btn>
              </div>
            </div>
          </Reveal>
      </Section>
    </>
  );
}
