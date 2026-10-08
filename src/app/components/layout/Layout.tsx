import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { Menu, X } from "lucide-react";
import { Logo } from "../site/Logo";
import { Btn, Container } from "../site/primitives";
import { LogoScene } from "../site/LogoScene";
import { ErrorBoundary } from "../site/ErrorBoundary";
import { ThemeToggle } from "../theme-toggle";
import { site } from "../../data/site";

/** `match`: the section this link lights up for (Company → /company/about only, so /company/contact lights up Contact alone). */
const NAV = [
  { label: "Platform", to: "/platform", match: "/platform" },
  { label: "Coverage", to: "/coverage", match: "/coverage" },
  { label: "Trust", to: "/trust", match: "/trust" },
  { label: "Company", to: "/company/about", match: "/company/about" },
  { label: "Changelog", to: "/changelog", match: "/changelog" },
];
const CONTACT = { label: "Contact", to: "/company/contact", match: "/company/contact" };
const inSection = (pathname: string, match: string) => pathname === match || pathname.startsWith(match + "/");

const FOOTER: { label: string; to?: string; href?: string }[] = [
  { label: "Platform", to: "/platform" },
  { label: "Coverage", to: "/coverage" },
  { label: "Trust", to: "/trust" },
  { label: "About", to: "/company/about" },
  { label: "Contact", to: "/company/contact" },
  { label: "Changelog", to: "/changelog" },
  ...(site.company.linkedin ? [{ label: "LinkedIn", href: site.company.linkedin }] : []),
  ...(site.company.instagram ? [{ label: "Instagram", href: site.company.instagram }] : []),
  ...(site.company.github ? [{ label: "GitHub", href: site.company.github }] : []),
  ...(site.company.statusPage ? [{ label: "Status", href: site.company.statusPage }] : []),
];

/** Footer-dəki nəhəng sürüşən sözlər (yalnız sözlər dəyişir; dizayn və animasiya eynidir). */
const FOOTER_WORDS = ["Risks", "Controls", "Compliance", "Strativu"];

const LEGAL = [
  { label: "Privacy", to: "/legal/privacy" },
  { label: "Terms", to: "/legal/terms" },
  { label: "DPA", to: "/legal/dpa" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  /** Aşağı scroll edəndə header gizlənir, yuxarı edəndə qayıdır. */
  const [hidden, setHidden] = useState(false);
  /** Siçanın üzərində olduğu link (sürüşən vurğu üçün). */
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 160);
        lastY = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    if (!location.hash) window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!location.hash) return;
    const el = document.getElementById(location.hash.slice(1));
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }, [location.hash, location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="relative flex min-h-screen flex-col text-ink">
      <LogoScene />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-[6px] focus:border focus:border-line focus:bg-surface focus:px-4 focus:py-2"
      >
        Skip to content
      </a>

      {/* ─── Header: floating rounded bar. Logo left · pages centre · Contact, theme, Early access right ─── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:px-5 md:pt-4 ${
          hidden && !open && !reduce ? "-translate-y-[120%]" : "translate-y-0"
        }`}
      >
        <div
          className={`relative mx-auto flex items-center justify-between gap-4 overflow-hidden rounded-full border pl-5 pr-2 transition-[max-width,height,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:pl-6 ${
            scrolled || open
              ? "h-14 max-w-[1080px] border-line bg-[color-mix(in_srgb,var(--ground)_88%,transparent)] shadow-[var(--e2)] backdrop-blur-xl"
              : "h-14 max-w-[1240px] border-line/70 bg-[color-mix(in_srgb,var(--ground)_55%,transparent)] backdrop-blur-md md:h-16"
          }`}
        >
          {/* səhifə boyu irəliləyiş xətti */}
          <motion.span
            aria-hidden
            style={{ scaleX: progress }}
            className={`pointer-events-none absolute inset-x-6 bottom-0 h-px origin-left bg-brand/70 transition-opacity duration-300 ${
              scrolled ? "opacity-100" : "opacity-0"
            }`}
          />
          <Logo />

          {/* lg–xl: in the flow between logo and actions (no overlap at 1024–1279px); from xl: centred on the bar. */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-0.5 lg:flex xl:absolute xl:left-1/2 xl:-translate-x-1/2 xl:gap-1"
            onMouseLeave={() => setHovered(null)}
          >
            {NAV.map((n) => {
              const active = inSection(location.pathname, n.match);
              const lit = hovered ? hovered === n.to : active;
              return (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end
                  onMouseEnter={() => setHovered(n.to)}
                  onFocus={() => setHovered(n.to)}
                  className={`relative isolate rounded-full px-3 py-2 text-[15px] transition-colors duration-200 xl:px-4 ${
                    lit ? "text-ink" : "text-ink-2 hover:text-ink"
                  }`}
                >
                  {/* siçanı izləyən yumşaq vurğu: linkdən linkə sürüşür */}
                  {lit && (
                    <motion.span
                      layoutId="nav-pill"
                      aria-hidden
                      className="absolute inset-0 -z-10 rounded-full bg-ink/[0.07]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  {n.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <NavLink
              to={CONTACT.to}
              end
              className={`px-3 text-[15px] transition-colors duration-200 ${
                inSection(location.pathname, CONTACT.match) ? "text-ink" : "text-ink-2 hover:text-ink"
              }`}
            >
              {CONTACT.label}
            </NavLink>
            <ThemeToggle className="text-ink-2 hover:bg-surface-2 hover:text-ink" />
            <Btn to="/early-access" size="md" className="ml-1">
              Early access
            </Btn>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle className="text-ink-2 hover:bg-surface-2 hover:text-ink" />
            <button
              className="rounded-full p-2.5 text-ink transition-colors hover:bg-surface-2"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
            </button>
          </div>
        </div>

        {/* ─── Mobile menu ─── */}
      </header>

      {/* ─── Mobile menu: own full-screen layer, fully opaque ─── */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-ground pt-24 lg:hidden"
          >
            <Container className="flex h-full flex-col pt-4">
              <div className="flex flex-col">
                {NAV.concat([CONTACT]).map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    end
                    className={`border-b border-line-soft py-4 text-[20px] ${
                      inSection(location.pathname, n.match) ? "font-medium text-ink" : "text-ink-2"
                    }`}
                  >
                    {n.label}
                  </NavLink>
                ))}
              </div>
              <div className="mt-8">
                <Btn to="/early-access" size="lg" className="w-full">
                  Early access
                </Btn>
                <p className="mt-5 text-[13px] text-ink-3">
                  {site.status.label} · {site.status.detail}
                </p>
              </div>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>

      <main id="main" className="relative z-10 flex-1">
        <ErrorBoundary resetKey={location.pathname}>{children}</ErrorBoundary>
      </main>

      {/* ─── Footer: minimal ─── */}
      <footer className="relative z-10 border-t border-line bg-[color-mix(in_srgb,var(--ground)_85%,transparent)] backdrop-blur-xl">
        <Container className="py-12 md:py-14">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <Logo />
            <nav aria-label="Footer" className="flex flex-wrap gap-x-7 gap-y-3">
              {FOOTER.map((l) =>
                l.to ? (
                  <Link key={l.label} to={l.to} className="text-[14px] text-ink-3 transition-colors hover:text-ink">
                    {l.label}
                  </Link>
                ) : (
                  <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="text-[14px] text-ink-3 transition-colors hover:text-ink">
                    {l.label}
                  </a>
                )
              )}
            </nav>
          </div>
          <div className="mt-10 flex flex-col gap-3 border-t border-line-soft pt-6 text-[13px] text-ink-3 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} {site.company.legalName} · {site.company.jurisdiction}
              {site.company.registrationNo && ` · ${site.company.registrationNo}`}
            </p>
            <p className="flex flex-wrap gap-x-6 gap-y-2">
              <a href={`mailto:${site.company.email}`} className="transition-colors hover:text-ink">
                {site.company.email}
              </a>
              {LEGAL.map((l) => (
                <Link key={l.label} to={l.to} className="transition-colors hover:text-ink">
                  {l.label}
                </Link>
              ))}
            </p>
          </div>
        </Container>

        {/* Nəhəng, yavaş sürüşən söz lenti (heyo.is footer-i kimi). Sözləri FOOTER_WORDS-dən dəyişin. */}
        <div aria-hidden className="marquee marquee-mask -mb-[0.18em] select-none overflow-hidden pb-2">
          <div className="marquee-track" style={{ ["--marquee-duration" as string]: "70s" }}>
            {[0, 1].map((k) => (
              <span
                key={k}
                className="shrink-0 whitespace-nowrap pr-[0.4em] text-[clamp(72px,13vw,210px)] font-semibold leading-[1] tracking-[-0.035em] text-ink-4/60"
              >
                {FOOTER_WORDS.join(".")}.
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
