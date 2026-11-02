import { Container, Duo, Eyebrow, Lane, Section, TextLink } from "../components/site/primitives";
import { Reveal } from "../components/site/Reveal";
import { ContactForm } from "../components/site/ContactForm";
import { ContactSignal } from "../components/site/ContactSignal";
import { site } from "../data/site";
import { useT } from "../i18n";

/**
 * /contact (Website Blueprint v2 → 06 Contact): intro, the form, direct channels.
 * /contact/thank-you: shown after a successful send (noindex).
 * Header: title and lead on the left, the contact-only animation (ContactSignal) with the Strativu mark on the right.
 * Header and form carry `data-logo-hide`: on this page the 3D logo steps aside and the mark in the animation is the logo.
 */
export function Contact() {
  const t = useT();
  const channels = [
    { k: t({ en: "Email", az: "E-poçt" }), v: <a href={`mailto:${site.company.email}`} className="link-line text-ink">{site.company.email}</a> },
    ...(site.company.linkedin
      ? [
          {
            k: "LinkedIn",
            v: (
              <a href={site.company.linkedin} target="_blank" rel="noopener noreferrer" className="link-line text-ink">
                {t({ en: "Strativu on LinkedIn", az: "Strativu LinkedIn-də" })}
                <span aria-hidden> ↗</span>
                <span className="sr-only">{t({ en: " (opens in a new tab)", az: " (yeni tabda açılır)" })}</span>
              </a>
            ),
          },
        ]
      : []),
    { k: t({ en: "Location", az: "Ünvan" }), v: <span className="text-ink">{t({ en: site.company.address, az: "Bakı, Azərbaycan" })}</span> },
  ];
  return (
    <>
      <header className="relative pb-10 pt-32 md:pb-14 md:pt-40" data-logo-hide>
        <Container>
          <div className="grid grid-cols-1 items-center gap-x-12 gap-y-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-x-20">
            <Reveal>
              <Eyebrow>{t({ en: "Contact", az: "Əlaqə" })}</Eyebrow>
              <h1 className="t-h1 text-ink">{t({ en: "Let's create value together.", az: "Gəlin birlikdə dəyər yaradaq." })}</h1>
              <p className="t-lead mt-7 max-w-[46ch]">
                {t({
                  en: "A product question, a partnership idea or a problem you'd like solved? Send us a message and the right person will get back to you.",
                  az: "Məhsulla bağlı sualınız, tərəfdaşlıq ideyanız və ya həll edilməsini istədiyiniz problem var? Bizə yazın, doğru şəxs sizə cavab verəcək.",
                })}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <ContactSignal className="mx-auto max-w-[300px] md:max-w-[440px]" />
            </Reveal>
          </div>
        </Container>
      </header>
      <Section className="pt-0 md:pt-0" logoHide>
        <Duo
          sticky
          head={
            <Reveal>
              <h2 className="mono-label">{t({ en: "Direct channels", az: "Birbaşa əlaqə" })}</h2>
              <dl className="mt-4 border-t border-line">
                {channels.map((c) => (
                  <div key={String(c.k)} className="border-b border-line py-5">
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
  const t = useT();
  return (
    <section className="flex min-h-[80svh] flex-col justify-center pb-24 pt-36 md:pt-48" data-logo-hide>
      <Container>
        <Lane>
          <p className="eyebrow mb-4">{t({ en: "Contact", az: "Əlaqə" })}</p>
          {/* Layout moves focus to this heading after the navigation, so screen readers announce it. */}
          <h1 className="t-h1 text-ink">
            {t({ en: "Thanks. We've received your message and will reply soon.", az: "Təşəkkürlər. Mesajınızı aldıq və tezliklə cavab verəcəyik." })}
          </h1>
          <div className="mt-10">
            <TextLink to="/">{t({ en: "Back to Home", az: "Ana səhifəyə qayıt" })}</TextLink>
          </div>
        </Lane>
      </Container>
    </section>
  );
}
