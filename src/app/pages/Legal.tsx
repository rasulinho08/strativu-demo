import { Link } from "react-router";
import { Duo, PageHeader, Section, Prose } from "../components/site/primitives";
import { site } from "../data/site";
import { legalDocs, type LegalDoc } from "../data/meta";
import type { ReactNode } from "react";

/* Body sits right under the page header, so the section drops its top padding. */
const BODY = "pt-0 md:pt-0";

/**
 * Hüquqi səhifələr (/privacy, /terms) — ümumi şablon. Hüquqşünasla yoxlanılmalıdır
 * (Azərbaycanın "Fərdi məlumatlar haqqında" qanunu; Aİ istifadəçiləri varsa GDPR).
 * Başlıq, tarix və description: src/app/data/meta.ts → legalDocs.
 */
const LEGAL_BODY: Record<LegalDoc, ReactNode> = {
  privacy: (
      <>
        <h2>Who we are</h2>
        <p>{site.company.legalName}, {site.company.jurisdiction}. Contact: <a href={`mailto:${site.company.email}`}>{site.company.email}</a>.</p>
        <h2>What we collect on this site</h2>
        <p>What you send through our forms (contact form: full name, email, company, topic, message and your consent; GRC360 early-access form: name, work email, company, role, frameworks and message), sent through our form provider, and standard server logs. We do not run advertising trackers.</p>
        <h2>Why</h2>
        <p>To reply to your message or request, on the basis of the consent you give in the form. We do not add you to a mailing list and we do not share your details with third parties other than the processors needed to operate the site.</p>
        <h2>Retention</h2>
        <p>Form submissions are kept for 12 months from the last contact, then deleted. You can ask for deletion earlier at any time.</p>
        <h2>Your rights</h2>
        <p>Access, rectification, erasure, restriction, portability and objection, under the GDPR and the Law of the Republic of Azerbaijan on Personal Data. Write to the address above.</p>
      </>
    ),
  terms: (
      <>
        <h2>Scope</h2>
        <p>These terms govern use of this website. Use of a Strativu product (for example GRC360 during early access) is governed by a separate agreement for that product.</p>
        <p>Request the GRC360 early-access agreement at <a href={`mailto:${site.company.email}`}>{site.company.email}</a>. A data processing agreement is signed with every early-access tenant before any personal data is processed.</p>
        <h2>Content</h2>
        <p>Content on this site describes products in development and planned products. Status, framework coverage and dates are stated as accurately as we can at the time of writing and may change. See also our <Link to="/privacy">Privacy Policy</Link>.</p>
        <h2>Liability</h2>
        <p>The site is provided as is. To the extent permitted by law, {site.company.legalName} is not liable for loss arising from reliance on the site's content.</p>
        <h2>Governing law</h2>
        <p>Laws of the Republic of Azerbaijan.</p>
      </>
    ),
};

function Legal({ doc }: { doc: LegalDoc }) {
  const page = { ...legalDocs[doc], body: LEGAL_BODY[doc] };
  return (
    <>
      <PageHeader eyebrow={`Legal · Updated ${page.updated}`} title={page.title} />
      <Section className={BODY}>
        <Duo
          sticky
          head={
            <div className="border-t border-line pt-6">
              <p className="mono-label">Last updated</p>
              <p className="mt-2 text-[15px] text-ink">{page.updated}</p>
              <p className="mono-label mt-8">Questions</p>
              <a href={`mailto:${site.company.email}`} className="mt-2 inline-block text-[15px] text-ink link-line">
                {site.company.email}
              </a>
            </div>
          }
        >
          <Prose className="border-t border-line pt-10 [&>*:first-child]:mt-0 [&_a]:text-brand-ink [&_a]:underline [&_a]:decoration-line-strong [&_a]:underline-offset-4 [&_a:hover]:decoration-current">
            {page.body}
          </Prose>
        </Duo>
      </Section>
    </>
  );
}

export const Privacy = () => <Legal doc="privacy" />;
export const Terms = () => <Legal doc="terms" />;
