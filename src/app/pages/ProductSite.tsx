import { Btn, Container, PageHeader, TextLink } from "../components/site/primitives";
import { Reveal } from "../components/site/Reveal";
import { ProductBar } from "../components/site/ProductBar";
import { ProductClosing, ProductFigures, ProductPoints } from "../components/site/ProductOverview";
import { Film } from "../components/site/Film";
import { productPagePath, productPages, type ProductPageData } from "../data/productPages";
import { useLang } from "../i18n";

/**
 * /products/hackos and /products/uniaz (+ /az): a short overview of a product that has its own website.
 * The details (pricing, sign-in, every feature) live on the product's site; this page links there.
 */
function ProductSitePage({ data: d }: { data: ProductPageData }) {
  const lang = useLang();
  const az = lang === "az";
  const t = (p: { en: string; az: string }) => p[lang];
  return (
    <>
      <PageHeader
        top={<ProductBar name={d.name} mark={d.mark} home={productPagePath(d.slug)} />}
        eyebrow={t(d.status)}
        title={t(d.title)}
        lead={t(d.lead)}
      >
        <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
          <Btn href={d.primary.href} size="lg" arrow>
            {t(d.primary.label)}
            <span className="sr-only">{az ? " (yeni tabda açılır)" : " (opens in a new tab)"}</span>
          </Btn>
          {d.secondary && <TextLink href={d.secondary.href}>{t(d.secondary.label)}</TextLink>}
        </div>
      </PageHeader>

      {/* The product film when it is ready; until then a picture of the product's site. */}
      <div className="pb-24 pt-4 md:pb-36 md:pt-8">
        <Container>
          <Reveal fade={false}>
            <div className="overflow-hidden rounded-[var(--r-xl)] border border-line bg-surface shadow-[var(--e3)]">
              {d.film ? (
                <Film src={d.film.src} webm={d.film.webm} poster={d.film.poster} label={az ? `${d.name} filmi` : `${d.name} film`} />
              ) : (
                <img
                  src={d.image.src}
                  srcSet={`${d.image.srcSmall} 800w, ${d.image.src} 1600w`}
                  sizes="(min-width: 1200px) 1134px, calc(100vw - 41px)"
                  width={d.image.width}
                  height={d.image.height}
                  alt={t(d.image.alt)}
                  className="block h-auto w-full"
                  fetchPriority="high"
                />
              )}
            </div>
          </Reveal>
        </Container>
      </div>

      <ProductPoints
        eyebrow={az ? "Nə edir" : "What it does"}
        title={az ? `${d.name} bir baxışda.` : `${d.name} at a glance.`}
        items={d.points.map((p) => ({ title: t(p.title), body: t(p.body) }))}
      />

      <ProductFigures
        lang={lang}
        items={d.figures.map((f) => ({ value: az ? (f.valueAz ?? f.value) : f.value, label: t(f.label) }))}
        extra={d.usedBy && t(d.usedBy)}
        note={t(d.figuresNote)}
      />

      <ProductClosing
        title={az ? `Hamısı ${d.name} saytında.` : `The full picture is on the ${d.name} website.`}
        body={
          az
            ? "Bütün imkanlar, qeydiyyat və yeniliklər məhsulun öz saytındadır."
            : "Every feature, sign-in and what's new live on the product's own site."
        }
      >
        <Btn href={d.primary.href} size="lg" arrow>
          {t(d.primary.label)}
          <span className="sr-only">{az ? " (yeni tabda açılır)" : " (opens in a new tab)"}</span>
        </Btn>
      </ProductClosing>
    </>
  );
}

const byslug = (s: ProductPageData["slug"]) => productPages.find((p) => p.slug === s)!;
export const HackOS = () => <ProductSitePage data={byslug("hackos")} />;
export const UniAz = () => <ProductSitePage data={byslug("uniaz")} />;
