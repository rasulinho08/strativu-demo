import { Link } from "react-router";
import { Btn, Eyebrow, PageHeader, Section } from "../components/site/primitives";
import { Reveal } from "../components/site/Reveal";
import { useLang, useLocalize, type Lang } from "../i18n";

/**
 * /products/ai-proxy — "Coming soon" page for AI Proxy by Strativu (AI security; the AI Proxy card on /products links here).
 * Source: Strativuco/cipher (README, doc/plan/04-marketinq-plan.md). The product is in the design and architecture stage,
 * so this page says what it will do, with no dates and no claims of finished features (no "100%", no certifications).
 * AI Proxy's own colour (indigo, design/tokens/tokens.json → brand.500) appears only on this page and its card.
 */

const INDIGO = "#5A5AF0";
/** Indigo as text: darker in light mode, lighter in dark mode, so it keeps ≥4.5:1 contrast (WCAG 1.4.3). */
const INDIGO_TEXT = "text-[#4747D4] dark:text-[#9AA0F7]";

const POINTS: { n: string; title: Record<Lang, string>; body: Record<Lang, string>; tags?: Record<Lang, string[]> }[] = [
  {
    n: "01",
    title: { en: "Sensitive data stays in", az: "Həssas məlumat içəridə qalır" },
    body: {
      en: "Personal data, secrets and source code are caught on the employee's device, before a prompt is sent to an AI tool.",
      az: "Şəxsi məlumatlar, gizli açarlar və mənbə kodu sorğu AI alətinə göndərilməzdən əvvəl, işçinin öz cihazında tutulur.",
    },
    tags: { en: ["Mask", "Redact", "Coach", "Block"], az: ["Maskala", "Redaktə et", "Xəbərdar et", "Blokla"] },
  },
  {
    n: "02",
    title: { en: "Your own AI, protected", az: "Öz AI-nız qorunur" },
    body: {
      en: "Prompt injection, jailbreaks and system-prompt theft are stopped at the gateway in front of your AI. One line to connect: base_url.",
      az: "Prompt injection, jailbreak və sistem promptunun oğurlanması AI-nızın qarşısındakı şlüzdə dayandırılır. Qoşulmaq üçün bir sətir: base_url.",
    },
  },
  {
    n: "03",
    title: { en: "Your rules, your servers", az: "Sizin qaydalar, sizin serverlər" },
    body: {
      en: "Policies by role, team, AI provider and data type. In the cloud, on-premise or air-gapped.",
      az: "Rol, komanda, AI provayderi və məlumat növü üzrə siyasətlər. Buludda, on-premise və ya internetdən tam təcrid olunmuş (air-gapped).",
    },
  },
];

function AiProxyBar() {
  const lang = useLang();
  const L = useLocalize();
  return (
    <nav aria-label="AI Proxy" className="border-b border-line pb-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px]">
        <Link to={L("/products")} className="-my-2 py-2 text-ink-3 transition-colors hover:text-ink">
          <span aria-hidden>← </span>
          {lang === "az" ? "Məhsullar" : "Products"}
        </Link>
        <span aria-hidden className="text-ink-4">
          /
        </span>
        <span className="inline-flex items-center gap-2 font-medium text-ink">
          <img src="/projects/ai-proxy/mark.svg" width={20} height={20} alt="" className="h-5 w-5" />
          AI Proxy <span className="font-normal text-ink-3">by Strativu</span>
        </span>
      </div>
    </nav>
  );
}

/** Your people → AI Proxy → AI tools: where it sits, in one line. */
function Flow() {
  const az = useLang() === "az";
  const node = "rounded-[var(--r-md)] border border-line bg-surface px-4 py-3 text-center font-mono text-[12.5px] text-ink-2 whitespace-nowrap";
  // Phones: a vertical chain (no horizontal scrolling); from sm: one row.
  const line = "self-center h-6 w-px border-l border-dashed sm:h-px sm:w-auto sm:min-w-6 sm:flex-1 sm:border-l-0 sm:border-t";
  return (
    <figure
      aria-label={
        az
          ? "AI Proxy işçiləriniz ilə istifadə etdikləri AI alətləri arasında və öz AI-nızın qarşısında dayanır."
          : "AI Proxy sits between your people and the AI tools they use, and in front of your own AI."
      }
      className="flex flex-col items-stretch sm:flex-row sm:items-center"
    >
      <span className={node}>{az ? "İşçiləriniz" : "Your people"}</span>
      <span aria-hidden className={line} style={{ borderColor: INDIGO }} />
      <span
        className={`rounded-[var(--r-md)] border px-4 py-3 text-center font-mono text-[12.5px] font-semibold whitespace-nowrap ${INDIGO_TEXT}`}
        style={{ borderColor: `color-mix(in srgb, ${INDIGO} 45%, transparent)`, background: `color-mix(in srgb, ${INDIGO} 10%, var(--surface))` }}
      >
        AI Proxy
      </span>
      <span aria-hidden className={line} style={{ borderColor: INDIGO }} />
      <span className={node}>{az ? "AI alətləri · sizin AI" : "AI tools · your AI"}</span>
    </figure>
  );
}

export function AiProxy() {
  const lang = useLang();
  const az = lang === "az";
  return (
    <>
      <PageHeader
        top={<AiProxyBar />}
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: INDIGO }} />
            {az ? "Tezliklə" : "Coming soon"}
          </span>
        }
        title={
          <>
            {az ? "İşdə AI-dan istifadə edin." : "Use AI at work."}{" "}
            <span className={INDIGO_TEXT}>{az ? "Məlumatınız içəridə qalsın." : "Keep your data in."}</span>
          </>
        }
        lead={
          az
            ? "AI Proxy şirkətiniz ilə AI arasında təhlükəsizlik qatıdır. AI alətlərinə nəyin çıxdığını və öz AI-nıza nəyin gəldiyini zərər verməzdən əvvəl yoxlayır."
            : "AI Proxy is a security layer between your company and AI. It checks what goes out to AI tools, and what comes in to your own AI, before it does harm."
        }
      >
        <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
          <Btn to="/contact?topic=Product%20inquiry" size="lg">
            {az ? "Hazır olanda xəbər verin" : "Tell me when it’s ready"}
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
                <h2 className="t-h3 mt-5 text-ink">{p.title[lang]}</h2>
                <p className="mt-3 text-[16px] leading-[1.6] text-ink-2">{p.body[lang]}</p>
                {p.tags && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {p.tags[lang].map((t) => (
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
              <Eyebrow>{az ? "Strativu ekosisteminin növbəti məhsulu" : "The next product in the Strativu ecosystem"}</Eyebrow>
              <p className="mt-4 max-w-[56ch] text-[17px] leading-[1.65] text-ink-2">
                {az
                  ? "AI Proxy hazırda işçiləri artıq AI-dan istifadə edən banklar, dövlət qurumları və şirkətlər üçün dizayn olunur. İlk xəbər tutmaq istəyirsiniz, ya da eşitməli olduğumuz bir ehtiyacınız var? Bizə yazın."
                  : "AI Proxy is being designed now, for banks, public bodies and companies whose people already use AI. Want to know first, or have a use case we should hear? Write to us."}
              </p>
              <div className="mt-8">
                <Btn to="/contact?topic=Product%20inquiry" variant="secondary">
                  {az ? "Bizimlə əlaqə" : "Contact us"}
                </Btn>
              </div>
            </div>
          </Reveal>
      </Section>
    </>
  );
}
