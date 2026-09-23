import { Link, useParams } from "react-router";
import { NotFound } from "./NotFound";
import { Btn, Lane, PageHeader, Section, TextLink } from "../components/site/primitives";
import { Reveal } from "../components/site/Reveal";
import { CoverageGrid } from "../components/site/CoverageGrid";
import { frameworks, statusLabel, type FrameworkStatus } from "../data/coverage";
import { usePageMeta } from "../components/site/Seo";

const STATUS_NOTE: Record<FrameworkStatus, string> = {
  supported: "Mapped to the shared control set and usable in the current build.",
  "in-progress": "Being mapped now. Partial coverage is visible in the product, marked as draft.",
  planned: "On the roadmap. Priority is set by early-access participants.",
};

export function Coverage() {
  usePageMeta("Coverage", "Frameworks and regulations the Strativu GRC product maps to, with an honest status for each: supported, mapping, or planned.");
  const counts: { label: string; n: number }[] = [
    { label: "Supported", n: frameworks.filter((f) => f.status === "supported").length },
    { label: "Mapping", n: frameworks.filter((f) => f.status === "in-progress").length },
    { label: "Planned", n: frameworks.filter((f) => f.status === "planned").length },
  ];
  return (
    <>
      <PageHeader
        eyebrow="Coverage"
        title="Frameworks and regulations we map to."
        lead="Each standard is a view on one shared control set, with an honest status for each."
      >
        <dl className="flex flex-wrap gap-x-8 gap-y-3 text-[15px]">
          {counts.map((c) => (
            <div key={c.label} className="flex flex-row-reverse items-baseline justify-end gap-2">
              <dt className="text-ink-3">{c.label}</dt>
              <dd className="tabular font-semibold text-ink">{c.n}</dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      <Section className="pt-0 md:pt-0">
        <Lane>
          <CoverageGrid />
          <Reveal className="mt-16">
            <TextLink to="/early-access">Missing a framework? Tell us</TextLink>
          </Reveal>
        </Lane>
      </Section>
    </>
  );
}

export function FrameworkPage() {
  const { slug } = useParams();
  const f = frameworks.find((x) => x.slug === slug);
  usePageMeta(f ? f.id : "Page not found", f ? `${f.name}. ${f.summary}` : "The page you asked for does not exist.");
  if (!f) return <NotFound />;
  const i = frameworks.indexOf(f);
  const prev = frameworks[(i - 1 + frameworks.length) % frameworks.length];
  const next = frameworks[(i + 1) % frameworks.length];
  return (
    <>
      <PageHeader eyebrow={`Coverage · ${f.body}`} title={f.id} lead={f.name}>
        <p className="chapter">
          <b>{statusLabel[f.status]}</b> · {f.controls}
        </p>
      </PageHeader>

      <Section className="pt-0 md:pt-0">
        <Lane>
          <Reveal>
            <p className="max-w-[58ch] text-[17px] leading-[1.65] text-ink-2">{f.summary}</p>
          </Reveal>

          <Reveal className="mt-16">
            <h2 className="eyebrow">What Strativu models</h2>
            <ul className="mt-6 border-t border-line">
              {f.detail.map((d) => (
                <li key={d} className="border-b border-line py-4 text-[16px] leading-[1.6] text-ink-2">
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="mt-16">
            <p className="max-w-[48ch] text-[16px] leading-[1.6] text-ink-2">{STATUS_NOTE[f.status]}</p>
            <div className="mt-6">
              <Btn to="/early-access">Request early access</Btn>
            </div>
          </Reveal>

          <nav aria-label="Other frameworks" className="mt-20 flex justify-between gap-6 border-t border-line pt-6">
            <Link to={`/coverage/${prev.slug}`} className="group min-w-0 max-w-[48%]">
              <span className="mono-label block">← Previous</span>
              <span className="mt-1.5 block text-[15px] text-ink transition-colors group-hover:text-brand">{prev.id}</span>
            </Link>
            <Link to={`/coverage/${next.slug}`} className="group min-w-0 max-w-[48%] text-right">
              <span className="mono-label block">Next →</span>
              <span className="mt-1.5 block text-[15px] text-ink transition-colors group-hover:text-brand">{next.id}</span>
            </Link>
          </nav>
          <div className="mt-10">
            <TextLink to="/coverage">All frameworks</TextLink>
          </div>
        </Lane>
      </Section>
    </>
  );
}
