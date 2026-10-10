/**
 * Public build log. Yeni giriş əlavə edəndə siyahının əvvəlinə yazın (ən yeni yuxarıda).
 * GRC360-ın build log-u (/products/grc360/changelog). Tarix formatı: YYYY-MM-DD.
 */
export type ChangelogEntry = {
  date: string;
  title: string;
  body: string;
  tag: "product" | "platform" | "coverage" | "company";
};

export const changelog: ChangelogEntry[] = [
  {
    date: "2026-10-04",
    title: "All twelve modules on the live back end",
    body: "Every module now reads and writes through the API, with server-side paging and CSV import and export on every register.",
    tag: "product",
  },
  {
    date: "2026-10-04",
    title: "Sign-in with LDAP, OAuth and SAML; permissions per action",
    body: "LDAP and Active Directory, OAuth and SAML single sign-on next to email and password. Permissions are granted per module and per action and checked on the server.",
    tag: "platform",
  },
  {
    date: "2026-10-04",
    title: "Trust Center and notifications",
    body: "A public security page for customers, and scheduled alerts for expiring contracts and exceptions, due objective audits and overdue targets.",
    tag: "product",
  },
  {
    date: "2026-09-04",
    title: "GRC360 front end 0.1.0",
    body: "First versioned release of the web application: twelve modules, thirty-one screens, fully in Azerbaijani and English.",
    tag: "product",
  },
];
