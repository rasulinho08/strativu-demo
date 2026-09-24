import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Ana səhifənin sonunda nəhəng "Strativu": görünüşə gəldikcə parlaq xətt hərflərin konturunu çəkir
 * (loqonun işıq izlərinin "yazdığı" söz kimi), sonda hərflər yumşaq dolur. Parıltı: theme.css → .light-wordmark
 */
export function LightWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const dash = useTransform(scrollYProgress, [0.05, 0.85], [1600, 0]);
  const fillOpacity = useTransform(scrollYProgress, [0.7, 1], [0, 0.14]);
  return (
    <div ref={ref} aria-hidden className="overflow-hidden px-3 pb-12 pt-4 md:px-6 md:pb-20">
      <svg viewBox="0 0 1000 215" className="light-wordmark mx-auto block h-auto w-full max-w-[1500px]">
        <defs>
          <linearGradient id="lw-stroke" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#6BE3FF" />
            <stop offset="0.5" stopColor="#03C1FD" />
            <stop offset="1" stopColor="#0A6FE0" />
          </linearGradient>
        </defs>
        <motion.text
          x="500"
          y="180"
          textAnchor="middle"
          fontSize="215"
          fontWeight="600"
          letterSpacing="-9"
          fill="url(#lw-stroke)"
          stroke="url(#lw-stroke)"
          strokeWidth="2.4"
          strokeDasharray="1600"
          style={reduce ? { fillOpacity: 0.14 } : { strokeDashoffset: dash, fillOpacity }}
        >
          Strativu
        </motion.text>
      </svg>
    </div>
  );
}
