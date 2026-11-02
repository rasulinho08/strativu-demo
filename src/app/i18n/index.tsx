import { Link, useLocation } from "react-router";

import { langOf, localize, counterpart, type Lang, type Pair } from "./paths";
export * from "./paths";

export function useLang(): Lang {
  return langOf(useLocation().pathname);
}
/** `const t = useT(); t({ en: "Home", az: "Ana səhifə" })` */
export function useT() {
  const lang = useLang();
  return <T,>(p: Pair<T>) => p[lang];
}
export function useLocalize() {
  const lang = useLang();
  return (to: string) => localize(to, lang);
}

/** EN | AZ switch: links to the same page in the other language (or that language's home). */
export function LangSwitch({ className = "" }: { className?: string }) {
  const { pathname, search } = useLocation();
  const lang = langOf(pathname);
  const item = (l: Lang, label: string, name: string) => {
    const on = l === lang;
    return (
      <Link
        to={on ? pathname + search : counterpart(pathname, l)}
        hrefLang={l}
        lang={l}
        aria-current={on ? "true" : undefined}
        aria-label={name}
        className={`rounded-full px-2.5 py-1.5 font-mono text-[12px] tracking-[0.08em] transition-colors ${
          on ? "bg-ink/[0.07] text-ink" : "text-ink-3 hover:text-ink"
        }`}
      >
        {label}
      </Link>
    );
  };
  return (
    <div role="group" aria-label={lang === "az" ? "Dil" : "Language"} className={`inline-flex items-center gap-0.5 ${className}`}>
      {item("en", "EN", "English")}
      {item("az", "AZ", "Azərbaycanca")}
    </div>
  );
}
