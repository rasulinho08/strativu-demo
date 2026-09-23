import { Btn, Container, Lane, TextLink } from "../components/site/primitives";
import { usePageMeta } from "../components/site/Seo";

export function NotFound() {
  usePageMeta("Page not found", "The page you asked for does not exist.");
  return (
    <section className="flex min-h-[80svh] flex-col justify-center pb-24 pt-36 md:pt-48">
      <Container>
        <Lane>
          <p className="eyebrow mb-4">404</p>
          <h1 className="t-h1 text-ink">Page not found.</h1>
          <p className="t-lead mt-6 max-w-[44ch]">The address may have changed, or it never existed.</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Btn to="/">Back to the start</Btn>
            <TextLink to="/platform">Platform</TextLink>
            <TextLink to="/coverage">Coverage</TextLink>
            <TextLink to="/company/contact">Contact</TextLink>
          </div>
        </Lane>
      </Container>
    </section>
  );
}
