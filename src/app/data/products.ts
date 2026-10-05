/**
 * Məhsullar. Saytda məhsul siyahısı buradan oxunur:
 *   - /platform → "Products" siyahısı (hamısı)
 *   - Ana səhifə → "Our work" (featured: true olanlar; ilki böyük şəkillə göstərilir)
 *
 * Yeni məhsul əlavə etmək üçün siyahıya bir obyekt əlavə edin:
 *   name     → məhsulun adı
 *   summary  → bir-iki cümlə, nə edir
 *   status   → məs. "In development", "Live", "Beta"
 *   to       → saytdakı səhifəsi (məs. "/platform/grc"), yoxdursa
 *   href     → kənar link (məs. "https://uniaz.info") — ikisindən biri kifayətdir
 *   image    → şəkil yolu (public/ qovluğunda), məs. "/projects/yeni.webp" (istəyə görə)
 *   featured → ana səhifədə göstərilsin?
 */
export type Product = {
  name: string;
  summary: string;
  status: string;
  to?: string;
  href?: string;
  image?: { src: string; width: number; height: number; alt: string };
  featured?: boolean;
};

export const products: Product[] = [
  {
    name: "GRC 360",
    summary:
      "Governance, risk and compliance in one system: twelve connected modules, in Azerbaijani and English, in the cloud or on your own servers.",
    status: "In development",
    to: "/platform/grc",
    image: {
      src: "/projects/grc360/01-command-center.webp",
      width: 2000,
      height: 1250,
      alt: "GRC 360 Command Center: overdue, today and upcoming tasks above an asset-risk heat map.",
    },
    featured: true,
  },
];
