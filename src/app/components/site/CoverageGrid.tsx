import { frameworks, statusLabel, type FrameworkStatus } from "../../data/coverage";
import { Rows } from "./primitives";
import { Reveal } from "./Reveal";

const ORDER: FrameworkStatus[] = ["supported", "in-progress", "planned"];

/**
 * Framework list grouped by status (Supported, Mapping, Planned).
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
          <div key={status}>
            <Reveal>
              <h2 className="eyebrow">{statusLabel[status]}</h2>
            </Reveal>
            <Rows
              className="mt-6"
              items={group.map((f) => ({ title: f.id, body: f.name, to: `/coverage/${f.slug}` }))}
            />
          </div>
        );
      })}
    </div>
  );
}
