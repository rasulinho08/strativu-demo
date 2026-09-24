import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Logo } from "../site/Logo";
import { Container } from "../site/primitives";
import { LogoScene } from "../site/LogoScene";
import { ThemeToggle } from "../theme-toggle";
import { site } from "../../data/site";

const NAV = [
  { label: "Platform", to: "/platform" },
  { label: "Coverage", to: "/coverage" },
  { label: "Trust", to: "/trust" },
  { label: "Company", to: "/company/about" },
  { label: "Changelog", to: "/changelog" },
];

const FOOTER: { label: string; to?: string; href?: string }[] = [
  { label: "Platform", to: "/platform" },
  { label: "Coverage", to: "/coverage" },
  { label: "Trust", to: "/trust" },
  { label: "About", to: "/company/about" },
  { label: "Contact", to: "/company/contact" },
  { label: "Changelog", to: "/changelog" },
  ...(site.company.linkedin ? [{ label: "LinkedIn", href: site.company.linkedin }] : []),
  ...(site.company.github ? [{ label: "GitHub", href: site.company.github }] : []),
  ...(site.company.statusPage ? [{ label: "Status", href: site.company.statusPage }] : []),
];

/** Footer-dəki nəhəng sürüşən sözlər. */
const FOOTER_WORDS = ["Controls", "Evidence", "Audit trail", "Strativu"];

const LEGAL = [
  { label: "Privacy", to: "/legal/privacy" },
  { label: "Terms", to: "/legal/terms" },
  { label: "DPA", to: "/legal/dpa" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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

      {/* ─── Header: minimal, sticky. Logo + pages left, Contact + theme right ─── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${
          scrolled || open
            ? "border-b border-line bg-[color-mix(in_srgb,var(--ground)_92%,transparent)] backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <Container className="flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-10">
            <Logo />
            <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) =>
                    `text-[14px] transition-colors duration-200 ${isActive ? "text-ink" : "text-ink-3 hover:text-ink"}`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <NavLink
              to="/company/contact"
              className={({ isActive }) =>
                `text-[14px] transition-colors duration-200 ${isActive ? "text-ink" : "text-ink-3 hover:text-ink"}`
              }
            >
              Contact
            </NavLink>
            <ThemeToggle className="text-ink-3 hover:bg-surface-2 hover:text-ink" />
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
        </Container>

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
            className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-ground lg:hidden"
          >
            <Container className="flex h-full flex-col pt-4">
              <div className="flex flex-col">
                {NAV.concat([{ label: "Contact", to: "/company/contact" }]).map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    className={({ isActive }) =>
                      `border-b border-line-soft py-4 text-[20px] ${isActive ? "font-medium text-ink" : "text-ink-2"}`
                    }
                  >
                    {n.label}
                  </NavLink>
                ))}
              </div>
              <div className="mt-8">
                <p className="text-[13px] text-ink-3">
                  {site.status.label} · {site.status.detail}
                </p>
              </div>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>

      <main id="main" className="relative z-10 flex-1">
        {children}
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
        <div aria-hidden className="marquee-mask -mb-[0.18em] select-none overflow-hidden pb-2">
          <div className="marquee-track" style={{ ["--marquee-duration" as string]: "70s" }}>
            {[0, 1].map((k) => (
              <span
                key={k}
                className="shrink-0 whitespace-nowrap pr-[0.4em] text-[clamp(72px,13vw,210px)] font-semibold leading-[1] tracking-[-0.05em] text-ink-4/60"
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
