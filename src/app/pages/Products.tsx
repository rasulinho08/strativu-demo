import { PageHeader, Section } from "../components/site/primitives";
import { ProductGrid } from "../components/site/ProductCard";
import { Reveal } from "../components/site/Reveal";
import { useT } from "../i18n";

/**
 * /products — the catalogue (Website Blueprint v2 → 04 Products). Details live on each product's own home;
 * a card linking to an external product site opens in a new tab with ↗ (products.ts → href).
 * Adding a product = one more entry in src/app/data/products.ts.
 */
export function Products() {
  const t = useT();
  return (
    <>
      <PageHeader
        eyebrow={t({ en: "Products", az: "Məhsullar" })}
        title={t({ en: "Our products", az: "Məhsullarımız" })}
        lead={t({
          en: "Every product in the Strativu ecosystem starts with a real problem. Each one has its own home. Choose a product to learn more.",
          az: "Strativu ekosistemindəki hər məhsul real bir problemdən başlayır. Hər birinin öz səhifəsi var. Ətraflı öyrənmək üçün məhsul seçin.",
        })}
      />
      <Section className="pt-0 md:pt-0">
        <ProductGrid headingLevel={2} />
        <Reveal className="mt-10">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink-3">{t({ en: "Each product carries the “by Strativu” mark.", az: "Hər məhsul “by Strativu” nişanını daşıyır." })}</p>
        </Reveal>
      </Section>
    </>
  );
}
