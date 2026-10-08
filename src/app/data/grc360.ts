/**
 * GRC 360 — məhsul məlumatları (/platform/grc səhifəsi).
 * Mənbə: Strativuco/GRC_Frontend_Code (main) və GRC_Backend_Code (develop), 2026-10-04 —
 * "GRC 360: sayt üçün materiallar" sənədi. Yalnız kodda yoxlanılmış rəqəmlər yazın.
 *
 * Yazmayın (hələ doğru deyil): "X kontrol xəritələnib", "N framework hazır gəlir",
 * AWS/GitHub evidence kollektorları, hash-zəncirli audit jurnalı, Jira inteqrasiyası.
 */

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

/** Doğrulanmış rəqəmlər (kodda var). `suffix` istəyə görədir, məs. "+". */
export const grcFigures: { value: number; suffix?: string; label: string }[] = [
  { value: grcModules.length, label: "modules" },
  { value: 31, label: "screens" },
  { value: 600, suffix: "+", label: "API endpoints" },
  { value: 2, label: "languages, Azerbaijani and English" },
];

/** Demo build-də yüklənmiş paket nümunələri (screenshot 04). Kataloq hazır gəlmir: paketlər yaradılır və ya CSV ilə import olunur. */
export const grcFrameworkPackages = ["ISO/IEC 27001:2022", "SOC 2 Type II", "NIST CSF 2.0", "GDPR", "PCI DSS v4.0.1", "AZ Law on Personal Data"];

/** Giriş və inteqrasiya — "Integrations & Automation" modulu. */
export const grcConnections = ["LDAP / Active Directory", "OAuth SSO", "SAML SSO", "CSV import and export", "REST API", "Notifications"];

/** On-premise üçün Docker Compose tərkibi. */
export const grcStack = ["App", "PostgreSQL", "Redis", "MinIO", "Nginx", "Prometheus", "Grafana"];

/** Ekran görüntüləri: public/projects/grc360/. Demo data ilə çəkilib (adlar uydurmadır). */
export const grcScreens = [
  { key: "command-center", label: "Command Center", src: "/projects/grc360/01-command-center.webp", alt: "GRC 360 Command Center: overdue, today and upcoming tasks above an asset-risk heat map." },
  { key: "asset-risks", label: "Asset Risks", src: "/projects/grc360/02-asset-risks.webp", alt: "GRC 360 asset-risk register with reviews, risk contacts and next review dates." },
  { key: "controls", label: "Controls", src: "/projects/grc360/03-controls.webp", alt: "GRC 360 control list." },
  { key: "packages", label: "Compliance Packages", src: "/projects/grc360/04-compliance-packages.webp", alt: "GRC 360 compliance packages: AZ Law on Personal Data, PCI DSS, GDPR, NIST CSF 2.0, SOC 2 Type II, ISO/IEC 27001:2022." },
  { key: "audit-findings", label: "Audit Findings", src: "/projects/grc360/05-audit-findings.webp", alt: "GRC 360 external audit findings with owners and due dates." },
  { key: "trust-center", label: "Trust Center", src: "/projects/grc360/06-trust-center.webp", alt: "GRC 360 public Trust Center page." },
  { key: "policies", label: "Policies", src: "/projects/grc360/07-policies-standards.webp", alt: "GRC 360 policies and standards with versions and review dates." },
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
