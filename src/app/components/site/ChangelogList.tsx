import { changelog, type ChangelogEntry } from "../../data/changelog";
import { Reveal } from "./Reveal";

const M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Fixed "03 Jul 2026" format: three-letter months throughout, no locale or timezone dependency. */
export function formatLogDate(d: string) {
  const [y, m, day] = d.split("-");
  return `${day} ${M[+m - 1]} ${y}`;
}

/** Build log: date, title, one paragraph. Hairline-separated, no panels. */
export function ChangelogList({ limit, entries = changelog }: { limit?: number; entries?: ChangelogEntry[] }) {
  const list = limit ? entries.slice(0, limit) : entries;
  return (
    <ol className="border-t border-line">
      {list.map((e, i) => (
        <Reveal as="li" key={e.date + e.title} delay={Math.min(i, 4) * 0.06} className="border-b border-line py-8">
          <article>
            <time dateTime={e.date} className="tabular block font-mono text-[12.5px] text-ink-3">
              {formatLogDate(e.date)}
            </time>
            <h2 className="t-h3 mt-3 text-ink">{e.title}</h2>
            <p className="mt-2 max-w-[52ch] text-[16px] leading-[1.6] text-ink-2">{e.body}</p>
          </article>
        </Reveal>
      ))}
    </ol>
  );
}
