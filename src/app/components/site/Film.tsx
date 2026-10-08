import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

/**
 * Məhsul filmi: səssiz, ekrana gələndə öz-özünə oynayır, çıxanda dayanır (trafik və batareyaya qənaət).
 * Sağ aşağıda iki düymə (44px): Pause/Play və səs. Ziyarətçi dayandırıbsa, film yenidən öz-özünə başlamır.
 * "Reduce motion" rejimində avtomatik oynamır — brauzerin öz idarə düymələri görünür.
 */
export function Film({ src, webm, poster, label }: { src: string; webm?: string; poster: string; label: string }) {
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
