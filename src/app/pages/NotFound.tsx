import { Btn, Container, Lane, TextLink } from "../components/site/primitives";
import { useLang } from "../i18n";

export function NotFound() {
  const az = useLang() === "az";
  return (
    <section className="flex min-h-[80svh] flex-col justify-center pb-24 pt-36 md:pt-48">
      <Container>
        <Lane>
          <p className="eyebrow mb-4">404</p>
          <h1 className="t-h1 text-ink">{az ? "Səhifə tapılmadı." : "Page not found."}</h1>
          <p className="t-lead mt-6 max-w-[44ch]">{az ? "Ünvan dəyişmiş ola bilər, ya da heç vaxt olmayıb." : "The address may have changed, or it never existed."}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Btn to="/">{az ? "Ana səhifəyə qayıt" : "Back to Home"}</Btn>
            <TextLink to="/contact">{az ? "Əlaqə" : "Contact"}</TextLink>
          </div>
        </Lane>
      </Container>
    </section>
  );
}
