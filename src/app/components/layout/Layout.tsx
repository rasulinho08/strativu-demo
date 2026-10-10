import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { Menu, X } from "lucide-react";
import { Logo } from "../site/Logo";
import { Container } from "../site/primitives";
import { LogoScene } from "../site/LogoScene";
import { ErrorBoundary } from "../site/ErrorBoundary";
import { useRouteMeta } from "../site/Seo";
import { ThemeToggle } from "../theme-toggle";
import { site } from "../../data/site";

/**
 * Main nav (Website Blueprint v2): Home · Products · About Us · Contact.
 * `match`: the section the link lights up for — /products/* (incl. the GRC360 pages) marks Products, /contact/* marks Contact.
 */
const NAV = [
  { label: "Home", to: "/", match: "/" },
  { label: "Products", to: "/products", match: "/products" },
  { label: "About Us", to: "/about", match: "/about" },
  { label: "Contact", to: "/contact", match: "/contact" },
];
const inSection = (pathname: string, match: string) =>
  match === "/" ? pathname === "/" : pathname === match || pathname.startsWith(match + "/");

type FooterLink = { label: string; to?: string; href?: string };
/** Footer qrupları (blueprint → 07 Footer). "Security" (/trust) blueprint-ə yeganə əlavədir (security.txt oraya baxır). */
const FOOTER_GROUPS: { title: string; links: FooterLink[] }[] = [
  { title: "Pages", links: NAV.map((n) => ({ label: n.label, to: n.to })) },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Use", to: "/terms" },
      { label: "Security", to: "/trust" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: site.company.email, href: `mailto:${site.company.email}` },
      ...(site.company.linkedin ? [{ label: "LinkedIn", href: site.company.linkedin }] : []),
      ...(site.company.instagram ? [{ label: "Instagram", href: site.company.instagram }] : []),
      ...(site.company.github ? [{ label: "GitHub", href: site.company.github }] : []),
      ...(site.company.statusPage ? [{ label: "Status", href: site.company.statusPage }] : []),
    ],
  },
];

/** Footer-dəki nəhəng sürüşən sətir: manifest (yalnız mətn dəyişir; dizayn və animasiya eynidir). */
const FOOTER_LINE = site.tagline;

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  useRouteMeta();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  /** Aşağı scroll edəndə header gizlənir, yuxarı edəndə qayıdır. */
  const [hidden, setHidden] = useState(false);
  /** Siçanın üzərində olduğu link (sürüşən vurğu üçün). */
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const firstPath = useRef(true);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (Math.abs(y - lastY) > 6) {
        // never hide the header while keyboard focus is inside it
        const focusedInside = headerRef.current?.contains(document.activeElement) ?? false;
        setHidden(!focusedInside && y > lastY && y > 160);
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

  // After a client-side navigation, move focus to the new page's heading so keyboard and screen-reader users land on it.
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    let id = 0;
    let tries = 0;
    const focusHeading = () => {
      const h1 = document.querySelector<HTMLElement>("main h1");
      if (!h1) {
        // a page loaded on demand may need a few more frames
        if (++tries < 60) id = requestAnimationFrame(focusHeading);
        return;
      }
      if (!h1.hasAttribute("tabindex")) h1.setAttribute("tabindex", "-1");
      h1.focus({ preventScroll: true });
    };
    id = requestAnimationFrame(focusHeading);
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

  // Mobile menu = modal dialog: page behind is inert, focus starts on the first link, Tab stays inside, Escape closes.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    for (const el of [mainRef.current, footerRef.current]) if (el) el.inert = open;
    if (!open) return;
    const first = requestAnimationFrame(() => menuRef.current?.querySelector<HTMLElement>("a,button")?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const items = [toggleRef.current, ...Array.from(menuRef.current?.querySelectorAll<HTMLElement>("a,button") ?? [])].filter(
        Boolean
      ) as HTMLElement[];
      if (!items.length) return;
      const i = items.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : i === -1 || i === items.length - 1 ? 0 : i + 1;
      e.preventDefault();
      items[next].focus();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(first);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      for (const el of [mainRef.current, footerRef.current]) if (el) el.inert = false;
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

      {/* ─── Header: floating rounded bar. Logo left · pages centre · theme toggle right ─── */}
      <header
        ref={headerRef}
        onFocusCapture={() => setHidden(false)}
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

          {/* md–lg: in the flow between logo and toggle; from lg: centred on the bar. */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-0.5 md:flex lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:gap-1"
            onMouseLeave={() => setHovered(null)}
          >
            {NAV.map((n) => {
              const active = inSection(location.pathname, n.match);
              const lit = hovered ? hovered === n.to : active;
              return (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === "/"}
                  aria-current={active ? "page" : undefined}
                  onMouseEnter={() => setHovered(n.to)}
                  onFocus={() => setHovered(n.to)}
                  className={`relative isolate rounded-full px-3 py-2 text-[15px] transition-colors duration-200 lg:px-4 ${
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

          <div className="hidden items-center md:flex">
            <ThemeToggle className="text-ink-2 hover:bg-surface-2 hover:text-ink" />
          </div>

          {/* phones: the menu button; the theme toggle lives in the menu */}
          <div className="flex items-center md:hidden">
            <button
              ref={toggleRef}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-2"
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
          <motion.div
            ref={menuRef}
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-ground pt-24 md:hidden"
          >
            <Container className="flex h-full flex-col pt-4">
              <nav aria-label="Mobile" className="flex flex-col">
                {NAV.map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    end={n.to === "/"}
                    aria-current={inSection(location.pathname, n.match) ? "page" : undefined}
                    className={`border-b border-line-soft py-4 text-[20px] ${
                      inSection(location.pathname, n.match) ? "font-medium text-ink" : "text-ink-2"
                    }`}
                  >
                    {n.label}
                  </NavLink>
                ))}
              </nav>
              <div className="mt-8 flex items-center justify-between gap-4">
                <a href={`mailto:${site.company.email}`} className="-my-3 py-3 text-[15px] text-ink-2">
                  {site.company.email}
                </a>
                <ThemeToggle className="shrink-0 text-ink-2 hover:bg-surface-2 hover:text-ink" />
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main" ref={mainRef} className="relative z-10 flex-1">
        <ErrorBoundary resetKey={location.pathname}>{children}</ErrorBoundary>
      </main>

      {/* ─── Footer: minimal ─── */}
      <footer ref={footerRef} className="relative z-10 border-t border-line bg-[color-mix(in_srgb,var(--ground)_85%,transparent)] backdrop-blur-xl">
        <Container className="py-12 md:py-14">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-[minmax(0,5fr)_repeat(3,minmax(0,2fr))] md:gap-x-10">
            <div className="col-span-2 md:col-span-1">
              <Logo />
              <p className="mt-5 text-[15px] leading-[1.6] text-ink-2">
                {/* manifest: one sentence per line */}
                {site.tagline.split(/(?<=\.)\s+/).map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
            {FOOTER_GROUPS.map((g) => (
              <nav key={g.title} aria-label={`Footer ${g.title}`} className={g.title === "Contact" ? "col-span-2 sm:col-span-1" : ""}>
                <h2 className="mono-label">{g.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {g.links.map((l) => (
                    <li key={l.label}>
                      {l.to ? (
                        <Link to={l.to} className="-my-1.5 inline-block py-1.5 text-[14px] text-ink-2 transition-colors hover:text-ink">
                          {l.label}
                        </Link>
                      ) : l.href?.startsWith("mailto:") ? (
                        <a href={l.href} className="-my-1.5 inline-block break-all py-1.5 text-[14px] text-ink-2 transition-colors hover:text-ink">
                          {l.label}
                        </a>
                      ) : (
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="-my-1.5 inline-block py-1.5 text-[14px] text-ink-2 transition-colors hover:text-ink"
                        >
                          {l.label}
                          <span aria-hidden> ↗</span>
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
          <div className="mt-12 border-t border-line-soft pt-6 text-[13px] text-ink-3">
            <p>
              © {new Date().getFullYear()} {site.name}. All rights reserved.
              {site.company.registrationNo && ` · ${site.company.legalName} · ${site.company.registrationNo}`}
            </p>
          </div>
        </Container>

        {/* Nəhəng, yavaş sürüşən söz lenti (heyo.is footer-i kimi). Mətn: FOOTER_LINE (manifest). */}
        <div aria-hidden className="marquee marquee-mask -mb-[0.18em] select-none overflow-hidden pb-2">
          <div className="marquee-track" style={{ ["--marquee-duration" as string]: "70s" }}>
            {[0, 1].map((k) => (
              <span
                key={k}
                className="shrink-0 whitespace-nowrap pr-[0.4em] text-[clamp(72px,13vw,210px)] font-semibold leading-[1] tracking-[-0.035em] text-ink-4/60"
              >
                {FOOTER_LINE}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
