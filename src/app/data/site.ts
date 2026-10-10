/**
 * Sayt konfiqurasiyası.
 * Buradakı dəyərləri dəyişmək kifayətdir — kod dəyişmək lazım deyil.
 */
export const site = {
  name: "Strativu",
  /** Manifest (Website Blueprint v2): hero başlığı, footer, brauzer başlığı, sosial önizləmə. */
  tagline: "Technology is the tool. Value is the point.",
  /** Tərif: Strativu nədir (JSON-LD Organization description, meta). */
  definition: "Strativu is an ecosystem of products, each built to solve a real problem in its market.",
  /** Ekosistem vədi. */
  promise: "Different markets. Different problems. One way of creating value.",
  /** Sosial şəbəkə və axtarış üçün tam təsvir (og:description). Yalnız təsdiqlənmiş faktlar. */
  description:
    "Strativu is an ecosystem of products, each built to solve a real problem in its market. Different markets. Different problems. One way of creating value.",
  /** Qısa təsvir (meta description, ≤160 simvol). */
  descriptionShort:
    "Strativu is an ecosystem of products, each built to solve a real problem in its market. Different markets. Different problems. One way of creating value.",
  domain: "https://strativu.com",
  /** Sosial şəbəkə önizləmə şəkli (1200×630). public/og.png */
  ogImage: "/og.png",

  logo: {
    /** Tam loqo (işarə + yazı). Açıq temada göstərilir. */
    src: "/brand/logo-full.png",
    /** Yalnız işarə. Tünd temada CSS yazı ilə birlikdə göstərilir. */
    mark: "/brand/logo-mark.png",
    /** Tünd tema üçün hazır açıq-rəngli loqo faylınız varsa yolunu yazın: "/brand/logo-dark.png". */
    darkSrc: null as string | null,
    height: 28,
  },

  /** Formspree form ID-si (Contact və GRC360 early access formları). */
  formspreeId: "xvzjezqa",

  company: {
    legalName: "Strativu LLC",
    jurisdiction: "Registered in Baku, Azerbaijan",
    /** Qeydiyyat nömrəsi. Real nömrə gələnə qədər null — null olanda saytda göstərilmir. */
    registrationNo: null as string | null,
    email: "contact@strativu.com",
    address: "Baku, Azerbaijan",
    /**
     * Sosial linklər. Hesab hələ yoxdursa null yazın — null olan link saytda göstərilmir.
     * Status səhifəsi yalnız həqiqətən işləyən status.strativu.com olanda doldurulmalıdır.
     */
    statusPage: null as string | null,
    linkedin: "https://www.linkedin.com/company/strativu-co/" as string | null,
    github: null as string | null,
    instagram: "https://www.instagram.com/strativu/" as string | null,
  },
};
