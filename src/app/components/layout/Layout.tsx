import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Logo } from "../site/Logo";
import { Btn, Container } from "../site/primitives";
import { LogoScene } from "../site/LogoScene";
import { ThemeToggle } from "../theme-toggle";
import { site } from "../../data/site";
import { frameworks } from "../../data/coverage";

const NAV = [
  { label: "Platform", to: "/platform" },
  { label: "Coverage", to: "/coverage" },
  { label: "Trust", to: "/trust" },
  { label: "Company", to: "/company/about" },
  { label: "Changelog", to: "/changelog" },
];

const FOOTER = [
  {
    title: "Platform",
    links: [
      { label: "Overview", to: "/platform" },
      { label: "GRC", to: "/platform/grc" },
      { label: "Architecture", to: "/platform/architecture" },
      { label: "Early access", to: "/early-access" },
    ],
  },
  {
    title: "Coverage",
    links: frameworks
      .slice(0, 6)
      .map((f) => ({ label: f.id.split(" (")[0], to: `/coverage/${f.slug}` }))
      .concat([{ label: "All frameworks", to: "/coverage" }]),
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/company/about" },
      { label: "Contact", to: "/company/contact" },
      { label: "Changelog", to: "/changelog" },
      { label: "Trust", to: "/trust" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Status", href: site.company.statusPage },
      { label: "LinkedIn", href: site.company.linkedin },
      { label: "GitHub", href: site.company.github },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/legal/privacy" },
      { label: "Terms", to: "/legal/terms" },
      { label: "DPA", to: "/legal/dpa" },
    ],
  },
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

      {/* ─── Header ─── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-200 ${
          scrolled || open
            ? "border-line bg-[color-mix(in_srgb,var(--ground)_82%,transparent)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <Container className="flex h-16 items-center justify-between gap-6">
          <Logo />

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `text-[14px] transition-colors duration-150 ${isActive ? "font-medium text-ink" : "text-ink-2 hover:text-ink"}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link to="/company/contact" className="px-2 text-[14px] text-ink-2 transition-colors duration-150 hover:text-ink">
              Contact
            </Link>
            <ThemeToggle className="text-ink-2 hover:bg-surface-2 hover:text-ink" />
            <Btn to="/early-access" size="sm" className="ml-1">
              Early access
            </Btn>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle className="text-ink-2 hover:bg-surface-2 hover:text-ink" />
            <button
              className="rounded-[8px] p-2 text-ink transition-colors hover:bg-surface-2"
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
        <AnimatePresence>
          {open && (
            <motion.nav
              id="mobile-nav"
              aria-label="Mobile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 top-16 z-[-1] bg-ground/97 backdrop-blur-xl lg:hidden"
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
                  <Btn to="/early-access" size="lg" arrow className="w-full">
                    Request early access
                  </Btn>
                  <p className="mt-5 text-[13px] text-ink-3">
                    {site.status.label} · {site.status.detail}
                  </p>
                </div>
              </Container>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="main" className="relative z-10 flex-1">
        {children}
      </main>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 border-t border-line bg-surface/60 backdrop-blur-xl">
        <Container className="py-14 md:py-16">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-[1.5fr_repeat(5,1fr)]">
            <div className="col-span-2 md:col-span-3 lg:col-span-1">
              <Logo />
              <p className="mt-4 max-w-[30ch] text-[14px] leading-[1.6] text-ink-2">{site.tagline}</p>
              <p className="mt-4 text-[13px] text-ink-3">
                {site.status.label} · {site.status.detail}
              </p>
            </div>
            {FOOTER.map((col) => (
              <div key={col.title}>
                <h4 className="mb-4 text-[13px] font-semibold text-ink">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {"to" in l && l.to ? (
                        <Link to={l.to} className="text-[14px] text-ink-2 transition-colors duration-150 hover:text-ink">
                          {l.label}
                        </Link>
                      ) : (
                        <a
                          href={(l as { href: string }).href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[14px] text-ink-2 transition-colors duration-150 hover:text-ink"
                        >
                          {l.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col justify-between gap-3 border-t border-line-soft pt-6 text-[13px] text-ink-3 md:flex-row md:items-center">
            <p>
              © {new Date().getFullYear()} {site.company.legalName} · {site.company.jurisdiction} · {site.company.registrationNo}
            </p>
            <p className="flex items-center gap-5">
              <a href={`mailto:${site.company.email}`} className="transition-colors hover:text-ink">
                {site.company.email}
              </a>
              <a
                href={site.company.statusPage}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-ink"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden /> All systems normal
              </a>
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
