import { Linkedin, Mail, MapPin } from "lucide-react";
import { site } from "../../data/site";

/**
 * Contact page only: the Strativu mark at the centre, three slow orbits carrying the ways to reach us
 * (email, LinkedIn, Baku) and soft "signal" rings going out from the mark — a message leaving and arriving.
 * Pure CSS animation (theme.css → .cs-*): transform and opacity only, so it stays on the compositor.
 * Reduced motion: a still picture. Decorative (aria-hidden); the same channels are listed as text on the page.
 */
const ORBITS = [
  { r: 30, dur: 38, dir: 1, start: -60, Icon: Mail, label: "Email" },
  { r: 40, dur: 52, dir: -1, start: 40, Icon: Linkedin, label: "LinkedIn" },
  { r: 49, dur: 66, dir: 1, start: 160, Icon: MapPin, label: "Baku" },
];

export function ContactSignal({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`cs-root relative aspect-square w-full ${className}`}>
      {/* soft light behind the mark */}
      <div className="cs-glow absolute inset-[18%] rounded-full" />
      {/* signal rings, staggered */}
      {[0, 1, 2].map((i) => (
        <span key={i} className="cs-pulse absolute inset-[34%] rounded-full border border-brand/40" style={{ animationDelay: `${i * 1.6}s` }} />
      ))}
      {/* orbits: a thin ring + one channel on it; the ring turns, the badge turns back so it stays upright */}
      {ORBITS.map((o) => (
        <div key={o.label} className="absolute inset-0 grid place-items-center">
          <div
            className="cs-ring relative rounded-full border border-dashed border-line-strong"
            style={{ width: `${o.r * 2}%`, height: `${o.r * 2}%`, ["--cs-dur" as string]: `${o.dur}s`, ["--cs-dir" as string]: o.dir, ["--cs-start" as string]: `${o.start}deg` }}
          >
            <span className="cs-node absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
              <span className="cs-badge flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1.5 font-mono text-[11px] text-ink-2 shadow-[var(--e2)]">
                <o.Icon className="h-3.5 w-3.5 text-brand" strokeWidth={1.75} />
                {o.label}
              </span>
            </span>
          </div>
        </div>
      ))}
      {/* the mark */}
      <div className="absolute inset-0 grid place-items-center">
        <img
          src={site.logo.mark}
          srcSet={`${site.logo.mark} 207w, ${site.logo.mark2x} 428w`}
          sizes="(min-width: 1024px) 180px, 140px"
          width={207}
          height={144}
          alt=""
          decoding="async"
          className="cs-mark w-[34%] drop-shadow-[0_18px_40px_rgba(10,111,224,0.35)]"
        />
      </div>
    </div>
  );
}
