import { PageHeader, Section } from "../components/site/primitives";
import { ProductGrid } from "../components/site/ProductCard";
import { Reveal } from "../components/site/Reveal";

/**
 * /products — the catalogue (Website Blueprint v2 → 04 Products). Details live on each product's own home;
 * a card linking to an external product site opens in a new tab with ↗ (products.ts → href).
 * Adding a product = one more entry in src/app/data/products.ts.
 */
export function Products() {
  return (
    <>
      <PageHeader
        eyebrow="Products"
        title="Our products"
        lead="Every product in the Strativu ecosystem starts with a real problem. Each one has its own home. Choose a product to learn more."
      />
      <Section className="pt-0 md:pt-0">
        <ProductGrid headingLevel={2} />
        <Reveal className="mt-10">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink-3">Each product carries the “by Strativu” mark.</p>
        </Reveal>
      </Section>
    </>
  );
}
