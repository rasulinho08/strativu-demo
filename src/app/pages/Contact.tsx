import { Container, Duo, Lane, PageHeader, Section, TextLink } from "../components/site/primitives";
import { Reveal } from "../components/site/Reveal";
import { ContactForm } from "../components/site/ContactForm";
import { site } from "../data/site";

/**
 * /contact (Website Blueprint v2 → 06 Contact): intro, the form, direct channels.
 * /contact/thank-you: shown after a successful send (noindex).
 * The form section carries `data-logo-hide`, so the 3D logo fades out while the form is on screen.
 */
export function Contact() {
  const channels = [
    { k: "Email", v: <a href={`mailto:${site.company.email}`} className="link-line text-ink">{site.company.email}</a> },
    ...(site.company.linkedin
      ? [
          {
            k: "LinkedIn",
            v: (
              <a href={site.company.linkedin} target="_blank" rel="noopener noreferrer" className="link-line text-ink">
                Strativu on LinkedIn<span aria-hidden> ↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ),
          },
        ]
      : []),
    { k: "Location", v: <span className="text-ink">{site.company.address}</span> },
  ];
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's create value together."
        lead="A product question, a partnership idea or a problem you'd like solved? Send us a message and the right person will get back to you."
      />
      <Section className="pt-0 md:pt-0" logoHide>
        <Duo
          sticky
          head={
            <Reveal>
              <h2 className="mono-label">Direct channels</h2>
              <dl className="mt-4 border-t border-line">
                {channels.map((c) => (
                  <div key={c.k} className="border-b border-line py-5">
                    <dt className="mono-label">{c.k}</dt>
                    <dd className="mt-2 text-[16px]">{c.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          }
        >
          <Reveal>
            <ContactForm />
          </Reveal>
        </Duo>
      </Section>
    </>
  );
}

export function ContactThanks() {
  return (
    <section className="flex min-h-[80svh] flex-col justify-center pb-24 pt-36 md:pt-48" data-logo-hide>
      <Container>
        <Lane>
          <p className="eyebrow mb-4">Contact</p>
          {/* Layout moves focus to this heading after the navigation, so screen readers announce it. */}
          <h1 className="t-h1 text-ink">Thanks. We've received your message and will reply soon.</h1>
          <div className="mt-10">
            <TextLink to="/">Back to Home</TextLink>
          </div>
        </Lane>
      </Container>
    </section>
  );
}
