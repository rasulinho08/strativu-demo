/**
 * GRC 360 — məhsul məlumatları (/platform/grc səhifəsi).
 * Mənbə: grc-front-end (sidebar), changelog. Yalnız doğrulanmış rəqəmlər yazın — seed/demo rəqəmləri yox.
 */

export type GrcModule = { name: string; does: string; screens: string[] };

export const grcModules: GrcModule[] = [
  { name: "Command Center", does: "Overdue, today's and upcoming tasks, risk heat maps and audit status per framework.", screens: [] },
  { name: "Governance Hub", does: "Coverage, objectives and issue tracking.", screens: ["Coverage", "Issues", "Objectives"] },
  { name: "Organization Hub", does: "Users, departments, roles and permissions.", screens: ["Users", "Departments", "Roles"] },
  { name: "Third Parties", does: "Vendor register and service agreements.", screens: ["Vendors", "Service Agreements"] },
  { name: "Asset Management", does: "Asset register and a map of how data moves.", screens: ["Assets", "Data Movement"] },
  {
    name: "Control Center",
    does: "Controls, policies and standards, exceptions, business continuity and recovery.",
    screens: ["Controls", "Policies & Standards", "Exceptions", "Continuity & Recovery"],
  },
  {
    name: "Risk Management",
    does: "Asset, third-party and operational risks with 5×5 scoring.",
    screens: ["Asset Risks", "Third-Party Risks", "Operational Risks", "Risk Exceptions"],
  },
  {
    name: "Compliance Hub",
    does: "Framework packages, assessments, obligations and audit findings.",
    screens: ["Frameworks", "Assessments", "Obligations", "Compliance Exceptions", "Audit Findings"],
  },
  { name: "Operations Center", does: "Projects and incidents.", screens: ["Projects", "Incidents"] },
  { name: "Trust Center", does: "A public page where customers see certifications, controls, subprocessors and documents.", screens: ["Public page"] },
  {
    name: "Integrations & Automation",
    does: "Connections to cloud, identity and work tools, plus automated workflows.",
    screens: ["Integrations", "Workflows"],
  },
  {
    name: "Settings",
    does: "Authentication (SSO, MFA), system health, updates and the system log.",
    screens: ["Authentication", "About", "System Health", "Updates", "System Log"],
  },
];

/** Doğrulanmış rəqəmlər (frontend kodundan). */
export const grcFigures = [
  { value: grcModules.length, label: "modules" },
  { value: 5, label: "framework packages" },
  { value: 11, label: "integrations in the catalogue" },
  { value: 2, label: "evidence collectors live" },
];

export const grcFrameworkPackages = ["ISO/IEC 27001:2022", "SOC 2 Type II", "NIST CSF 2.0", "PCI DSS v4.0", "CMMC"];

export const grcIntegrations = [
  "AWS", "Microsoft Azure", "Google Cloud", "Okta", "Google Workspace", "GitHub",
  "Jira", "Slack", "Datadog", "BambooHR", "CrowdStrike",
];

/** Status — changelog və site.ts ilə uyğun saxlayın. */
export const grcStatus = [
  {
    k: "Ready",
    v: "All twelve modules in the application; risk and control registers; cross-framework mapping; AWS IAM and GitHub evidence collectors.",
  },
  {
    k: "In progress",
    v: "Mapping for NIST CSF 2.0, GDPR and the Azerbaijan Law on Personal Data; connecting the remaining screens to the live back end.",
  },
  { k: "Next", v: "Early access opens in Q1 2027." },
];
