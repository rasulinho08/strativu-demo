import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { fieldBase } from "./formStyles";

/**
 * Site-styled single select (the browser's own list cannot be styled to match the site).
 * A button opens a listbox panel in the site's surface, line and brand colours, in both themes.
 * The value goes into a hidden input, so FormData and the form's validation read it like a normal field.
 * Keyboard: Enter / Space / ↓ / ↑ open; ↑ ↓ Home End move; Enter / Space pick; Esc / Tab close; letters jump.
 */
export function Select({
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
  invalid,
  describedBy,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder: string;
  invalid?: boolean;
  describedBy?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const reduce = useReducedMotion();

  const show = () => {
    setActive(Math.max(0, options.indexOf(value)));
    setOpen(true);
  };
  const pick = (i: number) => {
    onChange(options[i]);
    setOpen(false);
    btnRef.current?.focus();
  };

  // Close on a click outside.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const onKey = (e: KeyboardEvent) => {
    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        show();
      }
      return;
    }
    const last = options.length - 1;
    if (e.key === "ArrowDown") setActive((a) => Math.min(last, a + 1));
    else if (e.key === "ArrowUp") setActive((a) => Math.max(0, a - 1));
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(last);
    else if (e.key === "Enter" || e.key === " ") pick(active);
    else if (e.key === "Escape") setOpen(false);
    else if (e.key === "Tab") return setOpen(false);
    else if (e.key.length === 1) {
      const i = options.findIndex((o) => o.toLowerCase().startsWith(e.key.toLowerCase()));
      if (i >= 0) setActive(i);
      return;
    } else return;
    e.preventDefault();
  };

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        ref={btnRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKey}
        className={`${fieldBase} flex h-12 cursor-pointer items-center justify-between gap-3 text-left ${value ? "text-ink" : "text-ink-3"}`}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown
          aria-hidden
          className={`h-4 w-4 shrink-0 text-ink-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          strokeWidth={1.75}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            aria-labelledby={id}
            initial={reduce ? false : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-[calc(100%+8px)] z-30 origin-top overflow-hidden rounded-[var(--r-lg)] border border-line bg-surface p-1.5 shadow-[var(--e3)]"
          >
            {options.map((o, i) => {
              const selected = o === value;
              return (
                <li
                  key={o}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={selected}
                  onPointerEnter={() => setActive(i)}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => pick(i)}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-[var(--r-md)] px-3.5 py-2.5 text-[15px] transition-colors ${
                    i === active ? "bg-brand-soft text-ink" : "text-ink-2"
                  } ${selected ? "font-medium text-ink" : ""}`}
                >
                  {o}
                  {selected && <Check aria-hidden className="h-4 w-4 text-brand" strokeWidth={2} />}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
