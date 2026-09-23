/**
 * Komanda. Şəkillər public/team/ qovluğundadır (640×640 WebP).
 * Ad–rol uyğunluğu təxmini yazılıb; düzəltmək üçün name/role sətirlərini dəyişin.
 * Sosial link əlavə etmək üçün: links: [{ label: "LinkedIn", href: "https://..." }]
 */
export type TeamMember = {
  name: string | null;
  role: string;
  focus: string;
  photo: string | null;
  links?: { label: string; href: string }[];
};

export const team: TeamMember[] = [
  {
    name: "Daryanur",
    role: "Founder & CEO",
    focus: "Cybersecurity, governance and enterprise risk. Sets the product thesis and owns the compliance domain model.",
    photo: "/team/daryanur.webp",
  },
  {
    name: "Nihad",
    role: "GRC Product Lead",
    focus: "Business analysis and framework mapping. Turns auditor questions into product requirements.",
    photo: "/team/nihad.webp",
  },
  {
    name: "Rəsul",
    role: "Lead Software Engineer",
    focus: "Backend, cloud infrastructure and the tenancy model. Owns the audit-trail architecture.",
    photo: "/team/rasul.webp",
  },
  {
    name: "Turan",
    role: "Platform Engineer",
    focus: "Integrations, evidence collectors and the automation pipeline.",
    photo: "/team/turan.webp",
  },
];
