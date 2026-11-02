import { Btn, Container, Duo, TextLink } from "../components/site/primitives";
import { Reveal, Stagger } from "../components/site/Reveal";
import { ClosingCTA } from "../components/site/ClosingCTA";
import { EcosystemDiagram } from "../components/site/Ecosystem";
import { ProductGrid } from "../components/site/ProductCard";
import { Split } from "../components/site/Visuals";
import { site } from "../data/site";
import { useT } from "../i18n";

/**
 * Ana səhifə (Website Blueprint v2 → 03 Home): Hero (manifest) · What Strativu is · How we create value ·
 * Products (qısa önizləmə → /products) · Contact CTA. Mətnlər blueprint-dən hərfi götürülüb.
 * Açılışda 3D loqo ekranın mərkəzindədir (əsas vizual); scroll etdikcə fırlanır və solur, sonda
 * "Have a problem worth solving?" üstündə yenidən parlaq dayanır (LogoScene → CHOREO.home, `data-logo-stage`).
 */

const STEPS = [
  {
    n: "01",
    title: { en: "Find the problem", az: "Problemi tapırıq" },
    body: { en: "We study a market until we understand what really holds it back.", az: "Bazarı onu həqiqətən nəyin geri saxladığını anlayana qədər öyrənirik." },
  },
  {
    n: "02",
    title: { en: "Build the solution", az: "Həlli qururuq" },
    body: { en: "We create a focused product, using the right tools for the job.", az: "Doğru alətlərlə, bir məqsədə fokuslanmış məhsul yaradırıq." },
  },
  {
    n: "03",
    title: { en: "Prove the value", az: "Dəyəri sübut edirik" },
    body: { en: "We improve it until the result is clear and measurable.", az: "Nəticə aydın və ölçülə bilən olana qədər onu təkmilləşdiririk." },
  },
];

export default function Home() {
  const t = useT();
  return (
    <>
      {/* ── Hero: the 3D mark is centred above this; the manifest sits below it ── */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-end pb-[7svh] text-center sm:pb-[12svh] md:pb-[9svh]">
        <Container>
          {/* Statik loqo ilk kadrdan görünür (telefonda 3D yüklənənə qədər boş yer qalmasın); 3D loqo ekrana gələndə
              yavaşca solur. 3D qurulmayanda (reduce motion, WebGL yoxdur, zəif cihaz) yerində qalır (theme.css → .logo-intro). */}
          <img
            src={site.logo.mark}
            srcSet={`${site.logo.mark} 207w, ${site.logo.mark2x} 428w`}
            sizes="min(56vw, 300px)"
            alt=""
            aria-hidden
            width={207}
            height={144}
            fetchPriority="high"
            decoding="async"
            className="logo-intro mx-auto mb-14 h-auto w-[min(56vw,300px)]"
          />
          {/* Not faded in: the headline is painted at once (LCP); it only rises into place. */}
          <Stagger fade={false}>
            <h1 className="mx-auto max-w-[22ch] text-[clamp(38px,min(5.6vw,9svh),80px)] font-semibold leading-[1.04] tracking-[-0.032em] text-ink">
              {t({
                en: (
                  <>
                    <span className="block text-ink-3">Technology is the tool.</span> <span className="block">Value is the point.</span>
                  </>
                ),
                az: (
                  <>
                    <span className="block text-ink-3">Texnologiya alətdir.</span> <span className="block">Məqsəd dəyərdir.</span>
                  </>
                ),
              })}
            </h1>
            <p className="mx-auto mt-5 max-w-[52ch] text-[clamp(16px,1.3vw,19px)] leading-[1.55] text-ink-2">
              {t({
                en: "Strativu is an ecosystem of products built to solve real problems across different markets. We start with the problem, then build what solves it.",
                az: "Strativu müxtəlif bazarlarda real problemləri həll etmək üçün qurulmuş məhsullar ekosistemidir. Problemdən başlayırıq, sonra onu həll edəni qururuq.",
              })}
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Btn to="/products" size="lg">
                {t({ en: "Explore our products", az: "Məhsullarımız" })}
              </Btn>
              <Btn to="/contact" size="lg" variant="secondary">
                {t({ en: "Get in touch", az: "Əlaqə saxlayın" })}
              </Btn>
            </div>
          </Stagger>
        </Container>
        <div className="absolute inset-x-0 bottom-6 hidden justify-center sm:flex">
          <span className="scroll-cue" aria-hidden />
        </div>
      </section>

      {/* ── What Strativu is: text on one side, a line drawing of the ecosystem on the other ── */}
      <section className="py-24 md:py-40">
        <Container>
          <Split visual={<Reveal><EcosystemDiagram className="mx-auto max-w-[480px]" /></Reveal>}>
            <Reveal>
              <p className="eyebrow">{t({ en: "What Strativu is", az: "Strativu nədir" })}</p>
              <h2 className="t-h2 mt-5 text-ink">{t({ en: "One ecosystem. Many markets.", az: "Bir ekosistem. Çox bazar." })}</h2>
              <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.7] text-ink-2">
                {t({
                  en: "We don't limit ourselves to one industry or one kind of technology. We look for problems that cost people and businesses time, money or opportunity, and we build products that remove that cost. Each product stands on its own. Together, they form the Strativu ecosystem.",
                  az: "Özümüzü bir sahə və ya bir texnologiya növü ilə məhdudlaşdırmırıq. İnsanlara və şirkətlərə vaxt, pul və ya imkan itirdən problemləri axtarırıq və bu itkini aradan qaldıran məhsullar qururuq. Hər məhsul müstəqildir. Birlikdə isə Strativu ekosistemini yaradırlar.",
                })}
              </p>
            </Reveal>
          </Split>
        </Container>
      </section>

      {/* ── How we create value: heading row, then three numbered columns ── */}
      <section className="py-24 md:py-36">
        <Container>
          <Duo
            head={
              <Reveal>
                <p className="eyebrow">{t({ en: "Approach", az: "Yanaşma" })}</p>
                <h2 className="t-h2 mt-5 text-ink">{t({ en: "How we create value", az: "Dəyəri necə yaradırıq" })}</h2>
              </Reveal>
            }
          >
            <Reveal>
              <p className="t-lead max-w-[46ch]">
                {t({ en: site.promise, az: "Fərqli bazarlar. Fərqli problemlər. Dəyər yaratmağın bir yolu." })}
              </p>
            </Reveal>
          </Duo>
          <ol className="mt-16 grid grid-cols-1 border-t border-line md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal
                as="li"
                key={s.n}
                delay={i * 0.08}
                className={`border-b border-line py-8 md:border-b-0 md:px-8 md:py-10 ${i === 0 ? "md:pl-0" : "md:border-l md:border-line"}`}
              >
                <span aria-hidden className="font-mono text-[12px] text-ink-3">
                  {s.n}
                </span>
                <h3 className="t-h3 mt-6 text-ink">{t(s.title)}</h3>
                <p className="mt-3 max-w-[34ch] text-[16px] leading-[1.6] text-ink-2">{t(s.body)}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* ── Products in the ecosystem: the same cards as /products, compact ── */}
      <section className="py-24 md:py-36">
        <Container>
          <Duo
            head={
              <Reveal>
                <p className="eyebrow">{t({ en: "Products", az: "Məhsullar" })}</p>
                <h2 className="t-h2 mt-5 text-ink">{t({ en: "Products in the ecosystem", az: "Ekosistemin məhsulları" })}</h2>
              </Reveal>
            }
          >
            <Reveal>
              <p className="t-lead max-w-[46ch]">
                {t({
                  en: "Each Strativu product solves a different problem. See what we've built and what's coming next.",
                  az: "Hər Strativu məhsulu fərqli bir problemi həll edir. Nə qurduğumuza və nəyin yolda olduğuna baxın.",
                })}
              </p>
              <div className="mt-8">
                <TextLink to="/products">{t({ en: "View all products", az: "Bütün məhsullar" })}</TextLink>
              </div>
            </Reveal>
          </Duo>
          <div className="mt-14">
            <ProductGrid compact />
          </div>
        </Container>
      </section>

      {/* ── Closing: the 3D mark returns to centre above this ── */}
      <ClosingCTA
        title={t({ en: "Have a problem worth solving?", az: "Həll etməyə dəyər bir probleminiz var?" })}
        body={t({ en: "Tell us about it. We'd like to hear from you.", az: "Bizə danışın. Sizi eşitmək istəyirik." })}
      />
    </>
  );
}
