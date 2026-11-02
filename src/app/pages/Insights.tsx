import { Link, useParams } from "react-router";
import { Btn, Container, PageHeader, Prose, Section } from "../components/site/primitives";
import { Reveal } from "../components/site/Reveal";
import { NotFound } from "./NotFound";
import { insightPath, insights } from "../data/insights";
import { insightBodies } from "../content/insightBodies";
import { useLang, useLocalize, type Lang } from "../i18n";

/**
 * /insights and /az/insights: articles in the reader's language, newest first.
 * /insights/:slug and /az/insights/:slug: one article (unknown slug or missing language → NotFound).
 */
const dateText = (d: string, lang: Lang) => {
  const m = Number(d.slice(5, 7));
  const day = Number(d.slice(8, 10));
  const en = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const az = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr"];
  return lang === "az" ? `${day} ${az.at(m - 1)} ${d.slice(0, 4)}` : `${day} ${en.at(m - 1)} ${d.slice(0, 4)}`;
};

export function InsightsIndex() {
  const lang = useLang();
  const az = lang === "az";
  const list = insights.filter((a) => a[lang]).sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHeader
        eyebrow={az ? "Bilik bazası" : "Insights"}
        title={az ? "Risk, uyğunluq və təhlükəsizlik barədə praktik yazılar." : "Practical notes on risk, compliance and security."}
        lead={
          az
            ? "Komandaların gündəlik işindən çıxan suallar və cavablar: nəyi nə vaxt dəyişmək, nəyə diqqət etmək, haradan başlamaq."
            : "Questions we hear from teams at work, and our answers: what to change and when, what to watch for, where to start."
        }
      />
      <Section className="pt-0 md:pt-0">
        <ul className="border-t border-line">
          {list.map((a, i) => {
            const t = a[lang]!;
            return (
              <Reveal as="li" key={a.slug} delay={i * 0.05} className="border-b border-line">
                <Link to={insightPath(a.slug, lang)} className="group grid gap-3 py-8 md:grid-cols-[180px_minmax(0,1fr)] md:gap-10 md:py-10">
                  <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink-3">
                    <time dateTime={a.date}>{dateText(a.date, lang)}</time>
                    <span className="block md:mt-1">{az ? `${a.readMinutes} dəq oxu` : `${a.readMinutes} min read`}</span>
                  </p>
                  <div>
                    <h2 className="t-h3 text-ink transition-colors group-hover:text-brand-ink">{t.title}</h2>
                    <p className="mt-3 max-w-[64ch] text-[16px] leading-[1.6] text-ink-2">{t.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[14.5px] font-medium text-brand-ink">
                      <span className="link-line">{az ? "Oxu" : "Read"}</span>
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </Section>
    </>
  );
}

export function InsightArticle() {
  const { slug = "" } = useParams();
  const lang = useLang();
  const L = useLocalize();
  const az = lang === "az";
  const a = insights.find((x) => x.slug === slug);
  const t = a?.[lang];
  const body = insightBodies[slug]?.[lang];
  if (!a || !t || !body) return <NotFound />;
  return (
    <article>
      <header className="relative pb-10 pt-32 md:pb-14 md:pt-44">
        <Container>
          <div className="mx-auto max-w-[760px]">
            <Link to={L("/insights")} className="-my-2 inline-block py-2 text-[14px] text-ink-3 transition-colors hover:text-ink">
              <span aria-hidden>← </span>
              {az ? "Bilik bazası" : "Insights"}
            </Link>
            <h1 className="t-h1 mt-6 text-ink">{t.title}</h1>
            <p className="t-lead mt-6">{t.description}</p>
            <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-3">
              <time dateTime={a.date}>{dateText(a.date, lang)}</time> · {az ? `${a.readMinutes} dəq oxu` : `${a.readMinutes} min read`} · Strativu
            </p>
          </div>
        </Container>
      </header>
      <Section className="pt-0 md:pt-0">
        <div className="mx-auto max-w-[760px]">
          <Prose className="border-t border-line pt-10 [&>*:first-child]:mt-0 [&_a]:text-brand-ink [&_a]:underline [&_a]:decoration-line-strong [&_a]:underline-offset-4 [&_a:hover]:decoration-current [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-5">
            {body}
          </Prose>
          <div className="mt-14 rounded-[var(--r-xl)] border border-line bg-surface p-7 md:p-9">
            <p className="t-h3 text-ink">{az ? "Sualınız var?" : "Have a question about this?"}</p>
            <p className="mt-2 max-w-[52ch] text-[16px] leading-[1.6] text-ink-2">
              {az
                ? "Proqramınız barədə yazın, doğru şəxs sizə cavab verəcək."
                : "Tell us about your programme and the right person will get back to you."}
            </p>
            <div className="mt-6">
              <Btn to="/contact?topic=Product%20inquiry">{az ? "Bizə yazın" : "Get in touch"}</Btn>
            </div>
          </div>
        </div>
      </Section>
    </article>
  );
}
