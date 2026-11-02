import { Link, NavLink } from "react-router";
import { GRC } from "../../data/grc360";
import { useLang, useLocalize } from "../../i18n";

const PAGES = [
  { label: "Overview", az: "Ümumi baxış", to: GRC.base, end: true },
  { label: "Frameworks", az: "Framework-lər (EN)", to: GRC.frameworks, end: false },
  { label: "Architecture", az: "Arxitektura (EN)", to: GRC.architecture, end: true },
  { label: "Changelog", az: "Dəyişikliklər (EN)", to: GRC.changelog, end: true },
  { label: "Early access", az: "Erkən giriş", to: GRC.earlyAccess, end: true },
];

/**
 * Product bar on every GRC360 page (these pages are the interim GRC360 site and are not in the main nav):
 * back to Products, the "GRC360 by Strativu" brand, and the product's own pages. The current page is marked
 * with aria-current and an underline.
 */
export function Grc360Nav() {
  const az = useLang() === "az";
  const L = useLocalize();
  return (
    <nav aria-label="GRC360" className="border-b border-line pb-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px]">
        <Link to={L("/products")} className="-my-2 py-2 text-ink-3 transition-colors hover:text-ink">
          <span aria-hidden>← </span>
          {az ? "Məhsullar" : "Products"}
        </Link>
        <span aria-hidden className="text-ink-4">
          /
        </span>
        <Link to={L(GRC.base)} className="-my-2 inline-flex items-center gap-2 py-2 font-medium text-ink">
          <img src="/projects/grc360/grc360-mark-40.webp" width={20} height={20} alt="" className="h-5 w-5" />
          GRC360 <span className="font-normal text-ink-3">by Strativu</span>
        </Link>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
        {PAGES.map((p) => (
          <li key={p.to}>
            <NavLink
              to={L(p.to)}
              end={p.end}
              className={({ isActive }) =>
                `-my-1 inline-block py-2 text-[14px] underline-offset-[6px] transition-colors ${
                  isActive ? "font-medium text-ink underline decoration-1" : "text-ink-2 hover:text-ink"
                }`
              }
            >
              {az ? p.az : p.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
