import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Məhsul filmi: səssiz, ekrana gələndə öz-özünə oynayır, çıxanda dayanır (trafik və batareyaya qənaət).
 * Sağ aşağıdakı düymə səsi açır. "Reduce motion" rejimində avtomatik oynamır — idarə düymələri görünür.
 */
export function Film({ src, webm, poster, label }: { src: string; webm?: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView, reduce]);

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
        className="block h-auto w-full"
      >
        <source src={src} type="video/mp4" />
        {webm && <source src={webm} type="video/webm" />}
      </video>
      {!reduce && (
        <button
          type="button"
          onClick={() => {
            const v = ref.current;
            setMuted((m) => !m);
            if (v && v.paused) v.play().catch(() => {});
          }}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-md transition-colors hover:bg-black/70"
        >
          {muted ? <VolumeX className="h-3.5 w-3.5" aria-hidden /> : <Volume2 className="h-3.5 w-3.5" aria-hidden />}
          {muted ? "Sound on" : "Sound off"}
        </button>
      )}
    </div>
  );
}
