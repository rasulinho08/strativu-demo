import { Link, NavLink } from "react-router";
import { useLang, useLocalize } from "../../i18n";

export type ProductBarPage = { label: string; az: string; to: string; end?: boolean };

/**
 * Product bar at the top of every product page on strativu.com: back to Products, the "<Name> by Strativu" brand,
 * and (optionally) the product's own pages on this site. The current page is marked with aria-current and an underline.
 * The product's full details live on its own website; these pages are a short overview.
 */
export function ProductBar({ name, mark, home, pages }: { name: string; mark: string; home: string; pages?: ProductBarPage[] }) {
  const az = useLang() === "az";
  const L = useLocalize();
  return (
    <nav aria-label={name} className="border-b border-line pb-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px]">
        <Link to={L("/products")} className="-my-2 py-2 text-ink-3 transition-colors hover:text-ink">
          <span aria-hidden>← </span>
          {az ? "Məhsullar" : "Products"}
        </Link>
        <span aria-hidden className="text-ink-4">
          /
        </span>
        <Link to={L(home)} className="-my-2 inline-flex items-center gap-2 py-2 font-medium text-ink">
          <img src={mark} width={20} height={20} alt="" className="h-5 w-5" />
          {name} <span className="font-normal text-ink-3">by Strativu</span>
        </Link>
      </div>
      {pages && (
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
          {pages.map((p) => (
            <li key={p.to}>
              <NavLink
                to={L(p.to)}
                end={p.end ?? true}
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
      )}
    </nav>
  );
}
