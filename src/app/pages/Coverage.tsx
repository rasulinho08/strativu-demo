import { Link, useParams } from "react-router";
import { NotFound } from "./NotFound";
import { Btn, Duo, PageHeader, Section, TextLink } from "../components/site/primitives";
import { Reveal } from "../components/site/Reveal";
import { CoverageGrid } from "../components/site/CoverageGrid";
import { frameworks, statusLabel, type FrameworkStatus } from "../data/coverage";

const STATUS_NOTE: Record<FrameworkStatus, string> = {
  package:
    "Works as a compliance package in the current build. You add the requirements in the product or import them from CSV; a ready-made catalogue is not included yet.",
  "in-progress": "A ready-made package is being prepared.",
  planned: "On the roadmap. Early-access teams help set the order.",
};

export function Coverage() {
  return (
    <>
      <PageHeader
        eyebrow="Coverage"
        title="Frameworks and regulations GRC 360 works with."
        lead="Each one is a compliance package linked to your controls. You add the requirements in the product or import them from CSV; a ready-made catalogue is not included yet."
      />

      <Section className="pt-0 md:pt-0">
        <CoverageGrid />
        <Reveal className="mt-16">
          <TextLink to="/company/contact">Missing a framework? Tell us</TextLink>
        </Reveal>
      </Section>
    </>
  );
}

export function FrameworkPage() {
  const { slug } = useParams();
  const f = frameworks.find((x) => x.slug === slug);
  if (!f) return <NotFound />;
  const i = frameworks.indexOf(f);
  const prev = frameworks[(i - 1 + frameworks.length) % frameworks.length];
  const next = frameworks[(i + 1) % frameworks.length];
  return (
    <>
      <PageHeader eyebrow={`Coverage · ${f.body}`} title={f.id} lead={f.name}>
        <p className="chapter">
          <b className="whitespace-nowrap">{statusLabel[f.status]}</b>
        </p>
        {/* Standartın öz ölçüsü — statusun yanında yox, ayrıca sətirdə (xəritələnmiş kontrol sayı kimi oxunmasın). */}
        <p className="mt-3 text-[14px] leading-[1.6] text-ink-3">
          The standard:{" "}
          {f.scope.split(" · ").map((seg, i) => (
            <span key={seg}>
              {i > 0 && " · "}
              <span className="whitespace-nowrap">{seg}</span>
            </span>
          ))}
        </p>
      </PageHeader>

      <Section className="pt-0 md:pt-0">
        <Duo
          sticky
          head={
            <Reveal>
              <p className="max-w-[46ch] text-[17px] leading-[1.65] text-ink-2">{f.summary}</p>
              <p className="mt-8 max-w-[46ch] text-[15px] leading-[1.6] text-ink-3">{STATUS_NOTE[f.status]}</p>
              <div className="mt-6">
                <Btn to="/early-access">Request early access</Btn>
              </div>
            </Reveal>
          }
        >
          <Reveal>
            <h2 className="eyebrow">In brief</h2>
            <ul className="mt-6 border-t border-line">
              {f.detail.map((d) => (
                <li key={d} className="border-b border-line py-4 text-[16px] leading-[1.6] text-ink-2">
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>

          <nav aria-label="Other frameworks" className="mt-20 flex justify-between gap-6 border-t border-line pt-6">
            <Link to={`/coverage/${prev.slug}`} className="group min-w-0 max-w-[48%]">
              <span className="mono-label block">← Previous</span>
              <span className="mt-1.5 block text-[15px] text-ink transition-colors group-hover:text-brand">{prev.id.split(" (")[0]}</span>
            </Link>
            <Link to={`/coverage/${next.slug}`} className="group min-w-0 max-w-[48%] text-right">
              <span className="mono-label block">Next →</span>
              <span className="mt-1.5 block text-[15px] text-ink transition-colors group-hover:text-brand">{next.id.split(" (")[0]}</span>
            </Link>
          </nav>
        </Duo>
      </Section>
    </>
  );
}
