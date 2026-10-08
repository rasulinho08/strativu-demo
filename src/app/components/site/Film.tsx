import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

/**
 * Məhsul filmi: səssiz, ekrana gələndə öz-özünə oynayır, çıxanda dayanır (trafik və batareyaya qənaət).
 * Sağ aşağıda iki düymə (44px): Pause/Play və səs. Ziyarətçi dayandırıbsa, film yenidən öz-özünə başlamır.
 * "Reduce motion" rejimində avtomatik oynamır — brauzerin öz idarə düymələri görünür.
 */
export function Film({
  src,
  webm,
  poster,
  label,
  describedBy,
}: {
  src: string;
  webm?: string;
  poster: string;
  label: string;
  /** id of the text alternative (FilmScenes) */
  describedBy?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  /** The visitor pressed Pause: do not start again on scroll. */
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    if (inView && !held) v.play().catch(() => {});
    else v.pause();
  }, [inView, reduce, held]);

  const btn =
    "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-black/60 text-[13px] font-medium text-white backdrop-blur-md transition-colors hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <div className="relative">
      <video
        ref={ref}
        poster={poster}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        controls={!!reduce}
        aria-label={label}
        aria-describedby={describedBy}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="block h-auto w-full"
      >
        <source src={src} type="video/mp4" />
        {webm && <source src={webm} type="video/webm" />}
      </video>
      {!reduce && (
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const v = ref.current;
              if (!v) return;
              if (v.paused) {
                setHeld(false);
                v.play().catch(() => {});
              } else {
                setHeld(true);
                v.pause();
              }
            }}
            aria-label={playing ? "Pause film" : "Play film"}
            className={`${btn} w-11`}
          >
            {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
          </button>
          <button
            type="button"
            onClick={() => {
              const v = ref.current;
              setMuted((m) => !m);
              if (v && v.paused) {
                setHeld(false);
                v.play().catch(() => {});
              }
            }}
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
            className={`${btn} px-4`}
          >
            {muted ? <VolumeX className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
            <span className="hidden sm:inline">{muted ? "Sound on" : "Sound off"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Filmin mətn alternativi (WCAG 1.2.1 / 1.2.3): səhnələr ardıcıllıqla, kadrlardan yoxlanılıb (grc360-film.mp4, 40 s).
 * Filmdəki şüarlar burada təkrarlanmır — yalnız ekranda nə göstərildiyi.
 */
export const FILM_SCENES = [
  "Spreadsheets, email threads and sticky notes scattered across a desk, with the line “Managing governance, risk and compliance across multiple systems shouldn’t be this complicated.”",
  "The GRC 360 logo.",
  "Command Center: expired, today’s and future tasks above heat maps of asset and business risks.",
  "Organization Hub and Asset Management: users, departments (the IT department with its 15 asset risks) and an asset record for a customer database.",
  "Risk Management: a risk record for unauthorised access to the customer database, with its inherent score, the Mitigate treatment, the controls that treat it (multi-factor authentication, quarterly access review), a treatment project and the risk owners.",
  "Compliance Hub: the compliance packages (Azerbaijan Law on Personal Data, PCI DSS v4.0.1, GDPR, NIST CSF 2.0, SOC 2 Type II, ISO/IEC 27001:2022), the items of the ISO/IEC 27001:2022 package, and a control record showing the risks and packages it is linked to.",
  "Settings: the sign-in methods (local, OAuth, SAML and LDAP) and the way to the system log.",
  "A closing card with the module names and strativu.com.",
];

export function FilmScenes({ id, className = "" }: { id: string; className?: string }) {
  return (
    <details className={`group text-[14px] leading-[1.6] text-ink-2 ${className}`}>
      <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 font-medium text-brand-ink hover:text-brand [&::-webkit-details-marker]:hidden">
        <span aria-hidden className="inline-block transition-transform duration-200 group-open:rotate-90">
          ›
        </span>
        What the film shows
      </summary>
      <div id={id}>
        <p className="mt-2 text-ink-2">A 40-second walk through the current build, with demo data. The sound is off until you turn it on.</p>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5">
          {FILM_SCENES.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
      </div>
    </details>
  );
}
