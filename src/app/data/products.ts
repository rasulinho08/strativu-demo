/**
 * Strativu ekosisteminin məhsulları. Siyahı buradan oxunur:
 *   - /products → bütün kartlar (+ "More to come" kartı)
 *   - Ana səhifə → "Products in the ecosystem" (eyni kartlar, kompakt)
 *
 * Kart quruluşu (Website Blueprint v2): ad, status, bir cümləlik təsvir, link.
 * Yeni məhsul üçün siyahıya bir obyekt əlavə etmək kifayətdir:
 *   name       → məhsulun adı ("GRC360"); saytda "[Product] by Strativu" formulu ilə təqdim olunur
 *   status     → faktiki vəziyyət: "Available", "Early access", "Planned" …
 *   statusNote → statusun yanında kiçik qeyd (istəyə görə), məs. "Opens Q1 2027"
 *   summary    → bir cümlə: hansı problemi həll edir
 *   to         → saytdakı səhifə (eyni tabda açılır, "Learn more →")
 *   href       → məhsulun ÖZ saytı (yeni tabda açılır, "Visit <name> ↗") — `to` əvəzinə bir sətir dəyişiklik:
 *                  to: "/products/grc360"   →   href: "https://grc360.example"
 *   linkLabel  → link mətni (yoxdursa: to → "Learn more", href → "Visit <name>")
 *   arrow      → false: link mətnindən sonra ox göstərilmir (məs. "Coming soon")
 *   mark       → məhsulun loqosu (public/ qovluğunda), kartda göstərilir (istəyə görə)
 *   color      → məhsulun öz rəngi (kartın üst xətti və status nöqtəsi)
 *   featured   → true: böyük kart, tam endə, ekran görüntüsü ilə (siyahıda birinci göstərilir)
 *   image      → böyük kartdakı ekran görüntüsü (public/ qovluğunda, 800/1200/1600w WebP variantları ilə)
 *   facts      → böyük kartda qısa faktlar (yalnız yoxlanılmış faktlar)
 */
export type Product = {
  name: string;
  status: string;
  statusNote?: string;
  summary: string;
  to?: string;
  href?: string;
  linkLabel?: string;
  arrow?: boolean;
  mark?: { src: string; width: number; height: number };
  color?: string;
  featured?: boolean;
  image?: { src: string; alt: string; width: number; height: number };
  facts?: string[];
};

export const products: Product[] = [
  {
    name: "GRC360",
    status: "Early access",
    statusNote: "Opens Q1 2027",
    summary: "Governance, risk and compliance in one platform.",
    // GRC360-ın öz saytı hazır olanda: bu sətri `href: "https://…"` ilə əvəz edin (kart linki yeni tabda, ↗ ilə açılacaq).
    to: "/products/grc360",
    mark: { src: "/projects/grc360/grc360-mark-40.webp", width: 40, height: 40 },
    color: "#1A93AE",
    featured: true,
    image: {
      src: "/projects/grc360/01-command-center.webp",
      alt: "GRC360 Command Center: overdue, today and upcoming tasks above an asset-risk heat map.",
      width: 2000,
      height: 1250,
    },
    facts: ["12 modules", "Azerbaijani and English", "Cloud or on-premise"],
  },
  {
    name: "AI Proxy",
    status: "Planned",
    summary: "Secure and controlled access to AI services for organisations.",
    // Saytı hazır olana qədər: Contact formuna, mövzu "Product inquiry" seçilmiş halda.
    to: "/contact?topic=Product%20inquiry",
    linkLabel: "Coming soon",
    arrow: false,
  },
];

/** Siyahının sonundakı "More to come" kartı (status yoxdur). */
export const moreToCome: Product = {
  name: "More to come",
  status: "",
  summary: "We're always exploring the next problem, in any market.",
  to: "/contact?topic=Other",
  linkLabel: "Suggest a problem",
};

/** Kartın linki: daxili (`to`, eyni tab) və ya xarici (`href`, yeni tab, ↗). */
export function productLink(p: Product): { label: string; to?: string; href?: string } {
  if (p.href) return { label: p.linkLabel ?? `Visit ${p.name}`, href: p.href };
  return { label: p.linkLabel ?? "Learn more", to: p.to };
}
