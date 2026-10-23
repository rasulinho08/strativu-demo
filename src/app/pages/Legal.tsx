import { Link } from "react-router";
import { Duo, PageHeader, Section, Prose } from "../components/site/primitives";
import { site } from "../data/site";
import { legalDocs, type LegalDoc } from "../data/meta";
import type { ReactNode } from "react";

/* Body sits right under the page header, so the section drops its top padding. */
const BODY = "pt-0 md:pt-0";

/**
 * Hüquqi səhifələr (/privacy, /terms, /cookies) — ümumi şablon. Hüquqşünasla yoxlanılmalıdır
 * (Azərbaycanın "Fərdi məlumatlar haqqında" qanunu; Aİ istifadəçiləri varsa GDPR).
 * Başlıq, tarix və description: src/app/data/meta.ts → legalDocs.
 */
const mail = <a href={`mailto:${site.company.email}`}>{site.company.email}</a>;

const LEGAL_BODY: Record<LegalDoc, ReactNode> = {
  privacy: (
    <>
      <h2>Who we are</h2>
      <p>
        {site.company.legalName}, {site.company.jurisdiction}, is responsible for the personal data described here. Contact: {mail}.
      </p>
      <h2>What we collect</h2>
      <p>
        <strong>What you send us.</strong> Contact form: full name, email, company (optional), topic, message and your consent. GRC360
        early-access form: name, work email, company, role, frameworks and message.
      </p>
      <p>
        <strong>Technical data.</strong> When you open the site, our hosting provider receives your IP address, browser type and the
        pages you request, as any web server does. We do not run analytics, advertising trackers or cookies (see our{" "}
        <Link to="/cookies">Cookie Policy</Link>).
      </p>
      <h2>Why we use it</h2>
      <p>
        To reply to your message or request, on the basis of the consent you give in the form, and to keep the site running and secure.
        We do not add you to a mailing list and we do not sell or share your details for marketing.
      </p>
      <h2>Who processes it for us</h2>
      <ul>
        <li><strong>Vercel</strong>: hosts the site and runs the form endpoint; receives technical data.</li>
        <li><strong>Resend</strong>: delivers form messages to our mailbox by email.</li>
        <li><strong>Zoho</strong>: our company mailbox, where form messages and emails to {site.company.email} are received.</li>
        <li><strong>Formspree</strong>: backup form delivery, used only if the primary delivery fails.</li>
        <li>
          <strong>Meta (Instagram)</strong>: the About page shows our latest Instagram posts. The images load from Instagram&rsquo;s servers,
          so your browser shares your IP address with Meta when that page is open.
        </li>
      </ul>
      <p>Some of these providers process data outside Azerbaijan, including in the United States, under their own data protection terms.</p>
      <h2>How long we keep it</h2>
      <p>Form messages are kept for 12 months from the last contact, then deleted. You can ask for deletion earlier at any time.</p>
      <h2>Your rights</h2>
      <p>
        You can ask to access, correct, delete, restrict or export your data, object to its use, and withdraw your consent at any time,
        under the Law of the Republic of Azerbaijan on Personal Data and, where it applies, the GDPR. Write to {mail}. You can also
        complain to the data protection authority in your country.
      </p>
      <h2>Changes</h2>
      <p>If this policy changes, we update this page and the date above.</p>
    </>
  ),
  terms: (
    <>
      <h2>Scope</h2>
      <p>
        These terms govern use of this website. Use of a Strativu product (for example GRC360 during early access) is governed by a
        separate agreement for that product.
      </p>
      <p>
        Request the GRC360 early-access agreement at {mail}. A data processing agreement is signed with every early-access tenant before
        any personal data is processed.
      </p>
      <h2>Content</h2>
      <p>
        Content on this site describes products in development and planned products. Status, framework coverage and dates are stated as
        accurately as we can at the time of writing and may change. See also our <Link to="/privacy">Privacy Policy</Link>.
      </p>
      <h2>Intellectual property</h2>
      <p>
        The Strativu name, logos, product names, text, images and screenshots on this site belong to {site.company.legalName}. You may
        link to the site; do not copy or reuse its content for commercial purposes without our written permission.
      </p>
      <h2>Links to other sites</h2>
      <p>Links to other websites (for example LinkedIn or Instagram) are provided for convenience; we are not responsible for their content.</p>
      <h2>Liability</h2>
      <p>
        The site is provided as is. To the extent permitted by law, {site.company.legalName} is not liable for loss arising from reliance on
        the site&rsquo;s content.
      </p>
      <h2>Governing law</h2>
      <p>Laws of the Republic of Azerbaijan.</p>
    </>
  ),
  cookies: (
    <>
      <h2>Cookies</h2>
      <p>
        strativu.com sets <strong>no cookies</strong>. We run no analytics, no advertising and no tracking pixels, so there is nothing to
        accept or reject and the site does not show a cookie banner.
      </p>
      <h2>What the site stores in your browser</h2>
      <p>Two small entries in your browser&rsquo;s own storage, both needed for the site to work as you expect. Neither is sent to us.</p>
      <ul>
        <li>
          <strong>theme</strong> (local storage): your light or dark mode choice, kept until you clear your browser data.
        </li>
        <li>
          <strong>strativu:reloaded</strong> (session storage): lets the site reload a page once after we publish an update; removed when you
          close the tab.
        </li>
      </ul>
      <h2>Third parties</h2>
      <ul>
        <li>
          <strong>Instagram (Meta)</strong>: the About page shows images from our Instagram account, loaded from Instagram&rsquo;s servers.
          They receive your IP address and browser information when that page is open.
        </li>
        <li>
          <strong>Formspree</strong>: contacted only if our primary form delivery fails, when you send a form.
        </li>
      </ul>
      <h2>If this changes</h2>
      <p>
        If we ever add analytics or any other non-essential cookies, we will ask for your consent before they are set, offer a way to
        change your choice at any time, and update this page. Questions: {mail}.
      </p>
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
export const Cookies = () => <Legal doc="cookies" />;
