/**
 * GRC360 by Strativu — məhsul məlumatları (/products/grc360 və alt səhifələri).
 * GRC360-ın öz marketinq saytı hazır olana qədər məhsul səhifələri burada, /products/grc360 altında yaşayır
 * (əsas naviqasiyada deyil; Products səhifəsindəki kartdan açılır).
 * Mənbə: Strativuco/GRC_Frontend_Code (main) və GRC_Backend_Code (develop), 2026-10-04 —
 * "GRC360: sayt üçün materiallar" sənədi. Yalnız kodda yoxlanılmış rəqəmlər yazın.
 *
 * Yazmayın (hələ doğru deyil): "X kontrol xəritələnib", "N framework hazır gəlir",
 * AWS/GitHub kollektorları, hash-zəncirli jurnal, Jira inteqrasiyası, AI funksiyaları.
 */

/** GRC360 səhifələrinin ünvanları (bir yerdə; App.tsx, linklər və meta.ts bunu istifadə edir). */
export const GRC = {
  base: "/products/grc360",
  architecture: "/products/grc360/architecture",
  frameworks: "/products/grc360/frameworks",
  changelog: "/products/grc360/changelog",
  earlyAccess: "/products/grc360/early-access",
} as const;
export const frameworkPath = (slug: string) => `${GRC.frameworks}/${slug}`;

/** Status sətri (GRC360 səhifələrində). products.ts-dəki GRC360 kartı ilə uyğun saxlayın. */
export const grcRelease = { label: "Early access", detail: "Opens Q1 2027" };

/** 40 saniyəlik məhsul filmi (GRC360 səhifəsində). */
export const grcFilm = {
  src: "/projects/grc360/grc360-film.mp4",
  webm: "/projects/grc360/grc360-film.webm",
  poster: "/projects/grc360/grc360-film-poster.webp",
};

export type GrcModule = { name: string; does: string; screens: string[] };

export const grcModules: GrcModule[] = [
  {
    name: "Command Center",
    does: "Overdue, today's and upcoming tasks, heat maps for asset, business and third-party risks, and compliance status on one screen.",
    screens: [],
  },
  { name: "Governance Hub", does: "Strategic objectives, issues, and coverage of policies by controls.", screens: ["Coverage", "Issues", "Objectives", "Audits"] },
  {
    name: "Organization Hub",
    does: "Users, departments and groups, with permissions per module and per action.",
    screens: ["Users", "Departments", "Groups"],
  },
  { name: "Third Parties", does: "Vendor register and service agreements, with alerts before they expire.", screens: ["Vendors", "Service Agreements"] },
  { name: "Asset Management", does: "Asset register, data flows and GDPR questions.", screens: ["Assets", "Reviews", "Data Flows"] },
  {
    name: "Control Center",
    does: "Controls with their audits and maintenance, policies and standards, exceptions and continuity plans.",
    screens: ["Controls", "Policies & Standards", "Policy Exceptions", "Continuity Plans"],
  },
  {
    name: "Risk Management",
    does: "5×5 likelihood × impact scoring, your own risk-appetite thresholds, treatment plans and periodic review.",
    screens: ["Asset Risks", "Third Party Risks", "Business Risks", "Risk Exceptions"],
  },
  {
    name: "Compliance Hub",
    does: "Framework packages and their requirements, compliance analysis, obligations and external audit findings.",
    screens: ["Compliance Packages", "Compliance Analysis", "Obligations", "Compliance Exceptions", "External Audit Findings"],
  },
  { name: "Operations Center", does: "Security projects with tasks and costs, and security incidents handled in stages.", screens: ["Projects", "Security Incidents"] },
  {
    name: "Trust Center",
    does: "A public security page for your customers: the practices you apply, how data is processed, and your certification roadmap.",
    screens: [],
  },
  {
    name: "Integrations & Automation",
    does: "LDAP, OAuth and SAML single sign-on, CSV import and export, a REST API and notifications.",
    screens: [],
  },
  {
    name: "Settings",
    does: "Authentication, system health, updates, the system log and sessions.",
    screens: ["Authentication", "About", "System Health", "Updates", "System Log", "Clear Data"],
  },
];

/** Doğrulanmış rəqəmlər (kodda var). `suffix` istəyə görədir, məs. "+". "600+ API endpoints" Architecture səhifəsindədir. */
export const grcFigures: { value: number; suffix?: string; label: string }[] = [
  { value: grcModules.length, label: "modules" },
  { value: 31, label: "screens" },
  { value: 2, label: "languages, Azerbaijani and English" },
  { value: 2, label: "ways to run it: cloud or on-premise" },
];

/** "Who it's for" — üç sətir. CBAR / Decision 411 iddiası yoxdur (hüquqşünas yoxlamadan yazılmır). */
export const grcAudience = [
  {
    title: "Banks and financial institutions",
    body: "On-premise in your data centre, permissions per module and per action, a system log for auditors, and PCI DSS as a compliance package you build or import from CSV.",
  },
  {
    title: "Public bodies and critical infrastructure",
    body: "An air-gapped install with Docker Compose, sign-in through LDAP or Active Directory, and an interface fully in Azerbaijani.",
  },
  {
    title: "Growing companies",
    body: "A tenant in our cloud, and CSV import of the registers you keep in spreadsheets today.",
  },
];

/** Başlanğıc addımları — müddət yazılmır. */
export const grcOnboarding = [
  { n: "01", title: "Set up", body: "A tenant in our cloud, or an install on your own servers with Docker Compose." },
  { n: "02", title: "Connect sign-in", body: "LDAP or Active Directory, OAuth or SAML single sign-on, or email and password." },
  { n: "03", title: "Bring in your registers", body: "Import the risks, assets and vendors you keep in spreadsheets today from CSV." },
  {
    n: "04",
    title: "Load your frameworks",
    body: "Build compliance packages or import them from CSV. Azerbaijan’s Personal Data Law (998-IIIQ) loads as a package.",
  },
  {
    n: "05",
    title: "Score your first risks",
    body: "5×5 likelihood by impact against your own risk-appetite thresholds, with the residual risk calculated for you.",
  },
];

/** Demo build-də yüklənmiş paket nümunələri (screenshot 04). Kataloq hazır gəlmir: paketlər yaradılır və ya CSV ilə import olunur. */
export const grcFrameworkPackages = ["ISO/IEC 27001:2022", "SOC 2 Type II", "NIST CSF 2.0", "GDPR", "PCI DSS v4.0.1", "AZ Law on Personal Data"];

/** Giriş və inteqrasiya — "Integrations & Automation" modulu. */
export const grcConnections = ["LDAP / Active Directory", "OAuth SSO", "SAML SSO", "CSV import and export", "REST API", "Notifications"];

/** On-premise üçün Docker Compose tərkibi. */
export const grcStack = ["App", "PostgreSQL", "Redis", "MinIO", "Nginx", "Prometheus", "Grafana"];

/**
 * Ekran görüntüləri: public/projects/grc360/. Demo data ilə çəkilib (adlar uydurmadır).
 * Hər şəkil üçün 800/1200/1600w WebP variantları var (<ad>-800w.webp …); original 2000w-dir.
 * Yeni şəkil əlavə edəndə variantları da yaradın (README → "Screenshots").
 */
const SCREEN_WIDTHS = [800, 1200, 1600];
export const screenSrcSet = (src: string) =>
  [...SCREEN_WIDTHS.map((w) => `${src.replace(/\.webp$/, `-${w}w.webp`)} ${w}w`), `${src} 2000w`].join(", ");
/** Qalereya Container-in enində göstərilir (max 1200px, kənarlarda 20/33px boşluq). */
export const SCREEN_SIZES = "(min-width: 1200px) 1134px, (min-width: 768px) calc(100vw - 66px), calc(100vw - 41px)";

export const grcScreens = [
  { key: "command-center", label: "Command Center", src: "/projects/grc360/01-command-center.webp", alt: "GRC360 Command Center: overdue, today and upcoming tasks above an asset-risk heat map." },
  { key: "asset-risks", label: "Asset Risks", src: "/projects/grc360/02-asset-risks.webp", alt: "GRC360 asset-risk register with reviews, risk contacts and next review dates." },
  { key: "controls", label: "Controls", src: "/projects/grc360/03-controls.webp", alt: "GRC360 control list." },
  { key: "packages", label: "Compliance Packages", src: "/projects/grc360/04-compliance-packages.webp", alt: "GRC360 compliance packages: AZ Law on Personal Data, PCI DSS, GDPR, NIST CSF 2.0, SOC 2 Type II, ISO/IEC 27001:2022." },
  { key: "audit-findings", label: "Audit Findings", src: "/projects/grc360/05-audit-findings.webp", alt: "GRC360 external audit findings with owners and due dates." },
  { key: "trust-center", label: "Trust Center", src: "/projects/grc360/06-trust-center.webp", alt: "GRC360 public Trust Center page." },
  { key: "policies", label: "Policies", src: "/projects/grc360/07-policies-standards.webp", alt: "GRC360 policies and standards with versions and review dates." },
];
export const GRC_SCREEN_SIZE = { width: 2000, height: 1250 };

/** Status — changelog və site.ts ilə uyğun saxlayın. */
export const grcStatus = [
  {
    k: "Ready",
    v: "All twelve modules on the live back end; server-side paging; CSV import and export; roles and permissions; LDAP and SSO; Trust Center; notifications; session security.",
  },
  {
    k: "In progress",
    v: "Full sync of the OpenAPI contract, CI/CD, and audits for continuity plans.",
  },
  {
    k: "Planned",
    v: "Email digests and Jira integration, custom weights for the risk matrix, incident escalation rules. Early access opens in Q1 2027.",
  },
];
