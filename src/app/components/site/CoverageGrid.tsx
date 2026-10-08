import { frameworks, statusLabel, type FrameworkStatus } from "../../data/coverage";
import { Rows } from "./primitives";
import { Reveal } from "./Reveal";

const ORDER: FrameworkStatus[] = ["package", "in-progress", "planned"];

const NOTE: Record<FrameworkStatus, string> = {
  package: "Work as compliance packages today. You add the requirements or import them from CSV.",
  "in-progress": "A ready-made package is being prepared.",
  planned: "On the roadmap. Early-access teams help set the order.",
};

/**
 * Framework list grouped by status (works as a package, in progress, planned).
 * Hairline rows, no tiles: id as title, full name underneath, each row links to its framework page.
 */
export function CoverageGrid({ limit }: { limit?: number }) {
  const list = limit ? frameworks.slice(0, limit) : frameworks;
  return (
    <div className="space-y-16 md:space-y-20">
      {ORDER.map((status) => {
        const group = list.filter((f) => f.status === status);
        if (!group.length) return null;
        return (
          <div key={status} className="grid grid-cols-1 gap-x-16 gap-y-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] xl:gap-x-24">
            <Reveal className="lg:sticky lg:top-28 lg:self-start">
              <h2 className="eyebrow">{statusLabel[status]}</h2>
              <p className="mt-4 text-[clamp(44px,5vw,72px)] font-semibold leading-none tracking-[-0.04em] text-ink">{group.length}</p>
              <p className="mt-3 max-w-[32ch] text-[15px] leading-[1.6] text-ink-3">{NOTE[status]}</p>
            </Reveal>
            <Rows items={group.map((f) => ({ title: f.id, body: f.name, to: `/coverage/${f.slug}` }))} />
          </div>
        );
      })}
    </div>
  );
}
