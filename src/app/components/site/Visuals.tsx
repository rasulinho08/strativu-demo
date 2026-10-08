import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";

/**
 * Sağ sütun üçün kiçik, sakit animasiyalı məhsul vizualları (GRC 360 necə işləyir).
 * Hamısı nümunədir ("Illustrative"), real müştəri datası deyil.
 * Yalnız ekranda görünəndə hərəkət edir; "reduce motion" rejimində statik qalır.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/** İki sütunlu düzən: solda mətn, sağda vizual. Mobildə vizual mətnin altına düşür. */
export function Split({
  children,
  visual,
  className = "",
  sticky = false,
}: {
  children: ReactNode;
  visual: ReactNode;
  className?: string;
  /** Uzun siyahı yanında: vizual ekranda sabit qalır, mətn yanından keçir. */
  sticky?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20 ${sticky ? "items-start" : "items-center"} ${className}`}
    >
      <div className="min-w-0">{children}</div>
      {/* below lg the panel sits under the text, capped so it does not stretch across a tablet */}
      <div className={`min-w-0 max-lg:max-w-[560px] ${sticky ? "lg:sticky lg:top-28" : ""}`}>{visual}</div>
    </div>
  );
}

/** Ortaq çərçivə: incə xətt, yarı-şəffaf fon, kiçik başlıq. */
function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <figure className="overflow-hidden rounded-[var(--r-xl)] border border-line bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] shadow-[var(--e2)] backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-line-soft px-5 py-3">
        <span className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-ink-3">{title}</span>
        <span className="font-mono text-[11.5px] text-ink-3">Illustrative</span>
      </div>
      <div className="p-5">{children}</div>
    </figure>
  );
}

/** Ekranda olanda hər `ms`-də bir dəfə addım artırır. */
function useTicker(ms: number, max: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? max : 0);
  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(() => setStep((s) => (s >= max ? 0 : s + 1)), ms);
    return () => window.clearInterval(id);
  }, [inView, reduce, ms, max]);
  return { ref, step, reduce };
}

const Dot = ({ tone }: { tone: "ok" | "warn" | "brand" }) => (
  <span
    aria-hidden
    className={`inline-block h-2 w-2 shrink-0 rounded-full ${tone === "ok" ? "bg-ok" : tone === "warn" ? "bg-warn" : "bg-brand"}`}
  />
);

/* ── 1. Scheduled alerts: expiries and due dates arrive one by one ── */
const ALERTS = [
  { src: "Third Parties", what: "Service agreement with CloudHost expires in 2 weeks", warn: true },
  { src: "Governance", what: "Objective audit due: Access reviews", warn: false },
  { src: "Risk Management", what: "Risk exception R-031 expires on 30 Oct", warn: true },
  { src: "Governance", what: "Target overdue: Policy review cycle", warn: true },
];

export function AlertFeed() {
  const { ref, step } = useTicker(1300, ALERTS.length + 1);
  const shown = ALERTS.slice(0, Math.min(step, ALERTS.length));
  return (
    <div ref={ref}>
      <Panel title="Notifications">
        <ul className="min-h-[268px] space-y-2.5">
          <AnimatePresence initial={false}>
            {shown.map((c) => (
              <motion.li
                key={c.src + c.what}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="rounded-[var(--r-md)] border border-line-soft px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Dot tone={c.warn ? "warn" : "brand"} />
                  <span className="font-mono text-[12px] text-ink-3">{c.src}</span>
                  <span className="ml-auto font-mono text-[11px] text-ink-3">{c.warn ? "action" : "scheduled"}</span>
                </div>
                <p className="mt-1.5 text-[14px] text-ink">{c.what}</p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </Panel>
    </div>
  );
}

/* ── 2. One control, linked to the requirements it meets: lines draw from the control to each requirement ── */
const TARGETS = [
  { fw: "ISO 27001", ref: "A.5.17" },
  { fw: "SOC 2", ref: "CC6.1" },
  { fw: "NIST CSF", ref: "PR.AA-01" },
  { fw: "PCI DSS", ref: "8.4.2" },
];

export function ControlMap() {
  const { ref, step, reduce } = useTicker(900, TARGETS.length + 2);
  const lit = Math.min(step, TARGETS.length);
  return (
    <div ref={ref}>
      <Panel title="Linked requirements">
        <div className="relative grid min-h-[268px] grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="rounded-[var(--r-md)] border border-brand/40 bg-brand-soft/60 px-4 py-4">
            <p className="font-mono text-[11px] text-ink-3">CTL-014</p>
            <p className="mt-1 text-[14px] font-medium leading-[1.35] text-ink">MFA for privileged access</p>
          </div>
          <svg viewBox="0 0 60 200" className="h-[200px] w-[60px]" aria-hidden>
            {TARGETS.map((_, i) => {
              const y = 25 + i * 50;
              return (
                <motion.path
                  key={i}
                  d={`M0 100 C 30 100, 30 ${y}, 60 ${y}`}
                  fill="none"
                  className="stroke-brand"
                  strokeWidth="1.5"
                  initial={false}
                  animate={{ pathLength: reduce || i < lit ? 1 : 0, opacity: reduce || i < lit ? 1 : 0.15 }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
              );
            })}
          </svg>
          <ul className="space-y-2.5">
            {TARGETS.map((t, i) => {
              const on = reduce || i < lit;
              return (
                <li
                  key={t.fw}
                  className={`flex items-center justify-between rounded-[var(--r-md)] border px-3 py-2 transition-colors duration-500 ${
                    on ? "border-brand/40 text-ink" : "border-line-soft text-ink-3"
                  }`}
                >
                  <span className="text-[13px] font-medium">{t.fw}</span>
                  <span className="font-mono text-[11px] text-ink-3">{t.ref}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </Panel>
    </div>
  );
}

/* ── 3. System log: entries appear one by one (illustrative) ── */
const ENTRIES = [
  { who: "a.mammadov", what: "updated owner of control CTL-014", at: "09:12" },
  { who: "n.aliyeva", what: "accepted risk R-031 as an exception", at: "09:40" },
  { who: "admin", what: "granted Auditor group view on Compliance Hub", at: "10:05" },
  { who: "t.huseynli", what: "closed audit finding AF-007", at: "10:31" },
  { who: "r.karimov", what: "signed in with SAML SSO", at: "10:48" },
];

export function SystemLog() {
  const { ref, step } = useTicker(1500, ENTRIES.length);
  const visible = ENTRIES.slice(Math.max(0, step - 3), step + 1).slice(-4);
  return (
    <div ref={ref}>
      <Panel title="System log">
        <ol className="min-h-[268px] space-y-2">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((e) => (
              <motion.li
                key={e.who + e.at}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="rounded-[var(--r-md)] border border-line-soft px-4 py-2.5"
              >
                <p className="text-[13.5px] text-ink">
                  <span className="font-mono text-[12px] text-ink-3">{e.who}</span> {e.what}
                </p>
                <p className="mt-1 font-mono text-[11px] text-ink-3">today · {e.at} · tenant log</p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      </Panel>
    </div>
  );
}

/* ── 3b. One risk, linked to everything that treats it ── */
const LINKS = [
  { kind: "Control", name: "CTL-014 MFA for privileged access" },
  { kind: "Policy", name: "Access Control Policy v3" },
  { kind: "Asset", name: "Customer portal" },
  { kind: "Project", name: "SSO rollout" },
  { kind: "Requirement", name: "ISO 27001 A.5.17" },
];

export function RiskLinks() {
  const { ref, step, reduce } = useTicker(800, LINKS.length + 2);
  const lit = reduce ? LINKS.length : Math.min(step, LINKS.length);
  return (
    <div ref={ref}>
      <Panel title="Linked records">
        <div className="min-h-[268px]">
          <div className="rounded-[var(--r-md)] border border-brand/40 bg-brand-soft/60 px-4 py-3">
            <p className="font-mono text-[11px] text-ink-3">R-031 · score 16 · above appetite</p>
            <p className="mt-1 text-[14px] font-medium text-ink">Misconfigured IAM roles</p>
          </div>
          <ul className="mt-3 space-y-2 border-l border-line pl-4">
            {LINKS.map((l, i) => {
              const on = i < lit;
              return (
                <motion.li
                  key={l.kind}
                  initial={false}
                  animate={{ opacity: on ? 1 : 0.25, x: on ? 0 : -6 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="flex items-center gap-3 rounded-[var(--r-md)] border border-line-soft px-3 py-2"
                >
                  <span className="w-[84px] shrink-0 font-mono text-[11px] text-ink-3">{l.kind}</span>
                  <span className="truncate text-[13px] text-ink">{l.name}</span>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </Panel>
    </div>
  );
}
