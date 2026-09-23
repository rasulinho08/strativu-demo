/**
 * Sayt konfiqurasiyası.
 * Buradakı dəyərləri dəyişmək kifayətdir — kod dəyişmək lazım deyil.
 */
export const site = {
  name: "Strativu",
  tagline: "Compliance evidence, engineered.",
  domain: "https://strativu.com",
  /** Sosial şəbəkə önizləmə şəkli (1200×630). public/og.png */
  ogImage: "/og.png",

  /** Hero-da və CTA yanında görünən status sətri. */
  status: {
    label: "In development",
    detail: "Early access opening Q1 2027",
  },

  /**
   * Logo. Default: koddakı SVG mark + wordmark (Logo.tsx, göndərdiyiniz loqonun yenidən çəkilişi).
   * Orijinal vektor faylınız varsa public/logo.svg atın və src: "/logo.svg" yazın.
   */
  logo: {
    /** Tam loqo (işarə + yazı). Açıq temada göstərilir. */
    src: "/brand/logo-full.png",
    /** Yalnız işarə. Tünd temada CSS yazı ilə birlikdə göstərilir. */
    mark: "/brand/logo-mark.png",
    /** Tünd tema üçün hazır açıq-rəngli loqo faylınız varsa yolunu yazın: "/brand/logo-dark.png". */
    darkSrc: null as string | null,
    height: 28,
  },

  /** Formspree form ID-si (Contact və Early access formları). */
  formspreeId: "xvzjezqa",

  company: {
    legalName: "Strativu LLC",
    jurisdiction: "Registered in Baku, Azerbaijan",
    registrationNo: "Company No. 0000000000",
    email: "hello@strativu.com",
    address: "Baku, Azerbaijan",
    statusPage: "https://status.strativu.com",
    linkedin: "https://www.linkedin.com/company/strativu",
    github: "https://github.com/strativu",
  },

  /**
   * Mock sübut bölmələri. Real data gələnə qədər true/false ilə idarə edin.
   * Məzmun: src/app/data/proof.ts
   */
  proof: {
    logoWall: true,
    stats: true,
    testimonials: true,
  },
};
