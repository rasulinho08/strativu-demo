import { motion, useReducedMotion } from "motion/react";

/**
 * "What Strativu is" — a monochrome line illustration of the ecosystem: Strativu at the centre, thin lines to the
 * products (GRC360, AI Proxy) and to the next one (dashed: not built yet). No product UI, no colours.
 * Motion: the lines draw in once when the figure scrolls into view, then a small dot travels slowly along each line.
 * With reduced motion it is a still drawing.
 */

type Node = { x: number; y: number; label: string; sub: string; future?: boolean };

const C = { x: 240, y: 210 };
const ORBIT = 168;
/** Nodes sit on the orbit; angle in degrees (0 = right, negative = up). */
const at = (deg: number) => ({ x: C.x + ORBIT * Math.cos((deg * Math.PI) / 180), y: C.y + ORBIT * Math.sin((deg * Math.PI) / 180) });
const NODES: Node[] = [
  { ...at(-42), label: "GRC360", sub: "Early access" },
  { ...at(34), label: "AI Proxy", sub: "Planned" },
  { ...at(196), label: "Next", sub: "Any market", future: true },
];
const R_CENTRE = 60;
const R_NODE = 50;

/** Line from the edge of the centre circle to the edge of a node circle. */
function edge(n: Node) {
  const dx = n.x - C.x;
  const dy = n.y - C.y;
  const d = Math.hypot(dx, dy);
  const ux = dx / d;
  const uy = dy / d;
  return { x1: C.x + ux * (R_CENTRE + 6), y1: C.y + uy * (R_CENTRE + 6), x2: n.x - ux * (R_NODE + 6), y2: n.y - uy * (R_NODE + 6) };
}

export function EcosystemDiagram({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <figure className={className}>
      <svg
        viewBox="0 0 480 420"
        role="img"
        aria-labelledby="ecosystem-title"
        className="block h-auto w-full overflow-visible"
      >
        <title id="ecosystem-title">
          The Strativu ecosystem: Strativu at the centre, connected to GRC360, AI Proxy and the next product.
        </title>
        {/* faint orbit */}
        <circle cx={C.x} cy={C.y} r={ORBIT} fill="none" stroke="var(--line)" strokeWidth={1} strokeDasharray="2 6" />

        {NODES.map((n, i) => {
          const e = edge(n);
          const path = `M${e.x1} ${e.y1} L${e.x2} ${e.y2}`;
          return (
            <g key={n.label}>
              <motion.path
                d={path}
                fill="none"
                stroke="var(--ink-3)"
                strokeWidth={1.25}
                strokeDasharray={n.future ? "4 6" : undefined}
                initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 1.1, delay: 0.2 + i * 0.18, ease: [0.16, 1, 0.3, 1] }}
              />
              {!reduce && !n.future && (
                <circle r={3} fill="var(--ink)">
                  <animateMotion dur={`${5.5 + i * 1.3}s`} begin={`${1.4 + i * 0.4}s`} repeatCount="indefinite" path={path} />
                </circle>
              )}
            </g>
          );
        })}

        {/* centre */}
        <circle cx={C.x} cy={C.y} r={R_CENTRE} fill="var(--surface)" stroke="var(--ink)" strokeWidth={1.5} />
        <text x={C.x} y={C.y + 6} textAnchor="middle" fill="var(--ink)" fontSize={17} fontWeight={600} letterSpacing="-0.02em">
          Strativu
        </text>

        {NODES.map((n) => (
          <g key={`${n.label}-node`}>
            <circle
              cx={n.x}
              cy={n.y}
              r={R_NODE}
              fill="var(--surface)"
              stroke={n.future ? "var(--ink-3)" : "var(--ink)"}
              strokeWidth={1.25}
              strokeDasharray={n.future ? "4 5" : undefined}
            />
            <text x={n.x} y={n.y + 1} textAnchor="middle" fill="var(--ink)" fontSize={15} fontWeight={600}>
              {n.label}
            </text>
            <text
              x={n.x}
              y={n.y + 18}
              textAnchor="middle"
              fill="var(--ink-3)"
              fontSize={10}
              fontFamily="var(--font-mono)"
              letterSpacing="0.06em"
            >
              {n.sub.toUpperCase()}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
