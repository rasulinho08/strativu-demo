/**
 * Framework coverage. Status dəyişmək bir sətirdir:
 *   "package"     → GRC 360-da compliance paketi kimi işləyir (demo build-də var). Saytda: "Works as a package".
 *   "in-progress" → hazır paket hazırlanır
 *   "planned"     → planlaşdırılıb
 * Diqqət: hazır kataloq yoxdur — tələblər istifadəçi tərəfindən yaradılır və ya CSV ilə import olunur.
 * "scope" standartın öz ölçüsüdür (saytda "The standard: …" kimi göstərilir), GRC 360-da xəritələnmiş kontrol sayı DEYİL.
 * "summary" və "detail" bəndlərində standartın özünü təsvir edin; məhsulda olmayan funksiyanı yazmayın.
 * Sıra: əvvəl paket kimi işləyənlər (998-IIIQ, PCI DSS, ISO 27001, SOC 2, GDPR, NIST CSF), sonra planlaşdırılanlar.
 */
export type FrameworkStatus = "package" | "in-progress" | "planned";

export type Framework = {
  slug: string;
  id: string;
  name: string;
  body: string;
  status: FrameworkStatus;
  /** Standartın öz ölçüsü (məs. "93 Annex A controls · 4 themes"). */
  scope: string;
  summary: string;
  detail: string[];
};

/** Paket kimi işləyən framework-lər üçün ortaq, təsdiqlənmiş sətirlər. */
const IN_GRC_PKG = "In GRC 360 it is a compliance package you build or import from CSV.";
const IN_GRC = "In GRC 360 it is a compliance package you build or import from CSV, with each requirement linked to the controls that meet it.";

export const frameworks: Framework[] = [
  {
    slug: "az-personal-data",
    id: "Azerbaijan Law No. 998-IIIQ",
    name: "Law on Personal Data",
    body: "AZ",
    status: "package",
    scope: "Registration · consent · cross-border transfer",
    summary:
      "Domestic obligations for organisations processing personal data in Azerbaijan, including information-system registration and cross-border transfer rules. Loads as its own package, next to GDPR.",
    detail: [
      "Sets rules for consent, the rights of data subjects, the registration of information systems and cross-border transfer.",
      IN_GRC,
    ],
  },
  {
    slug: "pci-dss",
    id: "PCI DSS v4.0.1",
    name: "Payment card data security",
    body: "PCI SSC",
    status: "package",
    scope: "12 requirements · ~250 sub-requirements",
    summary: "Prescriptive and technical, and a standing requirement for banks and payment companies.",
    detail: ["12 principal requirements with testing procedures.", IN_GRC],
  },
  {
    slug: "iso-27001",
    id: "ISO/IEC 27001:2022",
    name: "Information security management",
    body: "ISO",
    status: "package",
    scope: "93 Annex A controls · 4 themes",
    summary:
      "The 2022 revision restructured Annex A into four themes: organisational, people, physical and technological. In GRC 360 each requirement links to the controls that meet it.",
    detail: [
      "93 Annex A controls in four themes: organisational, people, physical and technological.",
      "Clauses 4–10 set the management-system requirements: context, leadership, planning, support, operation, evaluation and improvement.",
      IN_GRC_PKG,
    ],
  },
  {
    slug: "soc-2",
    id: "SOC 2 (AICPA TSC 2017)",
    name: "Trust Services Criteria",
    body: "AICPA",
    status: "package",
    scope: "5 trust categories · CC1–CC9",
    summary: "SOC 2 auditors test controls against the Trust Services Criteria. In GRC 360 each criterion links to the controls that meet it.",
    detail: [
      "Security (common criteria CC1–CC9) plus Availability, Processing Integrity, Confidentiality and Privacy.",
      "Type I looks at control design at a point in time; Type II at operation over an observation period.",
      IN_GRC_PKG,
    ],
  },
  {
    slug: "gdpr",
    id: "GDPR (EU 2016/679)",
    name: "General Data Protection Regulation",
    body: "EU",
    status: "package",
    scope: "Art. 5–49 · 99 articles",
    summary:
      "GDPR obligations are organisational as much as technical. In GRC 360 the asset register carries data flows and GDPR questions alongside security controls.",
    detail: [
      "Data flows and GDPR questions per asset in Asset Management.",
      "Legal and contractual obligations tracked in the Obligations register.",
      "Vendors and service agreements in Third Parties.",
    ],
  },
  {
    slug: "nist-csf",
    id: "NIST CSF 2.0",
    name: "Cybersecurity Framework",
    body: "NIST",
    status: "package",
    scope: "6 functions · 106 subcategories",
    summary: "CSF 2.0 added the Govern function. Its six functions give boards and managers a shared way to discuss cyber risk.",
    detail: ["Govern, Identify, Protect, Detect, Respond and Recover functions.", IN_GRC],
  },
  {
    slug: "iso-42001",
    id: "ISO/IEC 42001:2023",
    name: "AI management system",
    body: "ISO",
    status: "planned",
    scope: "38 Annex A controls",
    summary: "The ISO standard for AI management systems, built on the same management-system clauses (4–10) as ISO 27001.",
    detail: [
      "Annex A controls for AI policy, impact assessment, data governance and lifecycle.",
      "The same management-system clauses 4–10 as ISO 27001.",
    ],
  },
  {
    slug: "hipaa",
    id: "HIPAA Security Rule",
    name: "45 CFR Part 164 Subpart C",
    body: "US HHS",
    status: "planned",
    scope: "Administrative · physical · technical safeguards",
    summary: "Required and addressable implementation specifications for electronic protected health information.",
    detail: [
      "Administrative, physical and technical safeguards.",
      "Some specifications are required; addressable ones need a documented decision on how they are met.",
    ],
  },
  {
    slug: "iso-22301",
    id: "ISO 22301:2019",
    name: "Business continuity management",
    body: "ISO",
    status: "planned",
    scope: "Clauses 4–10 · BIA · BCP",
    summary: "The ISO standard for business continuity management systems.",
    detail: ["Business impact analysis (BIA) and risk assessment.", "Business continuity plans (BCP), exercises and testing."],
  },
  {
    slug: "nist-800-53",
    id: "NIST SP 800-53 Rev. 5",
    name: "Security and privacy controls",
    body: "NIST",
    status: "planned",
    scope: "20 families · 1,000+ controls",
    summary: "The US federal catalogue of security and privacy controls that many other frameworks draw on.",
    detail: ["Control families with enhancements.", "Baselines for low, moderate and high impact systems."],
  },
  {
    slug: "dora",
    id: "DORA (EU 2022/2554)",
    name: "Digital Operational Resilience Act",
    body: "EU",
    status: "planned",
    scope: "ICT risk · incidents · third-party risk",
    summary:
      "Applies to EU financial entities from 17 January 2025, with a strong focus on information and communication technology (ICT) third-party risk.",
    detail: [
      "ICT risk management, incident reporting and digital operational resilience testing.",
      "A register of information on ICT third-party service providers.",
    ],
  },
  {
    slug: "nis2",
    id: "NIS2 (EU 2022/2555)",
    name: "Network and Information Security Directive",
    body: "EU",
    status: "planned",
    scope: "Art. 21 measures · reporting",
    summary: "Baseline cybersecurity measures and incident reporting for essential and important entities across the EU.",
    detail: [
      "Article 21 sets minimum cybersecurity risk-management measures.",
      "Article 23 sets 24-hour, 72-hour and one-month incident reporting deadlines.",
    ],
  },
];

export const statusLabel: Record<FrameworkStatus, string> = {
  package: "Works as a package",
  "in-progress": "In progress",
  planned: "Planned",
};
