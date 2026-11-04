import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Cookie } from "lucide-react";
import { useT } from "../../i18n";

/**
 * Kuki bildirişi. Sayt kuki qoymur (analitika, reklam yoxdur), ona görə burada "qəbul / rədd" seçimi yoxdur:
 * düymə heç nəyi işə salmazdı. Bildiriş bunu deyir, Cookie Policy-yə aparır və "Anladım" basılanda
 * bir daha göstərilmir (local storage: strativu:cookie-notice). Analitika əlavə olunsa, bu komponent
 * real razılıq (Accept / Reject) formasına çevrilməlidir və skriptlər yalnız "Accept"-dən sonra yüklənməlidir.
 */
const KEY = "strativu:cookie-notice";

export function CookieNotice() {
  const t = useT();
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(KEY) === "1";
    } catch {
      /* storage bağlıdır: yenə göstər */
    }
    if (seen) return;
    const id = window.setTimeout(() => setShow(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  const close = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* yadda saxlanmasa, növbəti açılışda yenə görünər */
    }
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="region"
          aria-label={t({ en: "Cookie notice", az: "Kuki bildirişi" })}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[400px]"
        >
          <div className="rounded-[var(--r-xl)] border border-line bg-surface/95 p-5 shadow-[var(--e3)] backdrop-blur-md">
            <div className="flex gap-3.5">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                <Cookie aria-hidden className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="text-[15px] font-medium text-ink">{t({ en: "No tracking cookies here", az: "Burada izləyici kuki yoxdur" })}</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">
                  {t({
                    en: "strativu.com sets no cookies and runs no analytics or ads. Your browser only keeps your light/dark choice.",
                    az: "strativu.com kuki qoymur, analitika və reklam işlətmir. Brauzeriniz yalnız açıq/tünd rejim seçiminizi saxlayır.",
                  })}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-4">
              <Link to="/cookies" onClick={close} className="text-[14px] text-ink-2 underline-offset-4 hover:text-ink hover:underline">
                {t({ en: "Cookie Policy", az: "Kuki siyasəti (EN)" })}
              </Link>
              <button
                type="button"
                onClick={close}
                className="h-10 cursor-pointer rounded-full bg-brand px-5 text-[14px] font-medium text-on-brand transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {t({ en: "Got it", az: "Anladım" })}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
