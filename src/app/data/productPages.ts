/**
 * Short product pages on strativu.com for products that have their own website (HackOS, UniAz).
 * Each page: what it is, one picture (or the product film once it is ready), four points, a few figures, and the way
 * to the product's own site, where every detail lives. GRC360 has its own page (pages/Grc360.tsx).
 *
 * Film: when the product's team delivers the film, add `film: { src, webm?, poster }` (files in public/projects/<slug>/);
 * the page shows the film instead of the picture.
 * Figures: only numbers the product shows publicly or Strativu has confirmed, with the date in `figuresNote`.
 */
type Pair = { en: string; az: string };

export type ProductPageData = {
  slug: "hackos" | "uniaz";
  name: string;
  mark: string;
  site: string;
  status: Pair;
  title: Pair;
  lead: Pair;
  image: { src: string; srcSmall: string; width: number; height: number; alt: Pair };
  film?: { src: string; webm?: string; poster: string };
  points: { title: Pair; body: Pair }[];
  figures: { value: string; valueAz?: string; label: Pair }[];
  figuresNote: Pair;
  /** Extra line under the figures (who uses it), optional. */
  usedBy?: Pair;
  primary: { label: Pair; href: string };
  secondary?: { label: Pair; href: string };
};

export const productPagePath = (slug: ProductPageData["slug"]) => `/products/${slug}`;

export const productPages: ProductPageData[] = [
  {
    slug: "hackos",
    name: "HackOS",
    mark: "/projects/hackos/mark.svg",
    site: "https://www.hack-os.app",
    status: { en: "Live", az: "Canlı" },
    title: { en: "Hackathons, run from one system.", az: "Hakatonlar, bir sistemdən idarə olunur." },
    lead: {
      en: "HackOS by Strativu brings registration, teams, mentors, judging, results and certificates into one platform, instead of six spreadsheets and a group chat. Organisers, judges, mentors, participants and volunteers each work in their own view of the same event.",
      az: "HackOS by Strativu qeydiyyatı, komandaları, mentorları, münsifliyi, nəticələri və sertifikatları altı cədvəl və bir qrup çatı əvəzinə bir platformada birləşdirir. Təşkilatçılar, münsiflər, mentorlar, iştirakçılar və könüllülər eyni tədbirin hər biri öz görünüşündə işləyir.",
    },
    image: {
      src: "/projects/hackos/hero-1600.webp",
      srcSmall: "/projects/hackos/hero-800.webp",
      width: 1600,
      height: 1000,
      alt: {
        en: "The HackOS website: a live hackathon with a countdown, participant and team counts, activity and a leaderboard.",
        az: "HackOS saytı: geri sayım, iştirakçı və komanda sayı, fəaliyyət və reytinq cədvəli olan canlı hakaton.",
      },
    },
    points: [
      {
        title: { en: "Registration and teams", az: "Qeydiyyat və komandalar" },
        body: {
          en: "A public event page with its own form, approvals, join codes and team limits.",
          az: "Öz formu, təsdiqləri, qoşulma kodları və komanda limitləri olan ictimai tədbir səhifəsi.",
        },
      },
      {
        title: { en: "Judging", az: "Münsiflik" },
        body: {
          en: "Weighted criteria, judge assignment and blind scoring.",
          az: "Çəkili meyarlar, münsiflərin təyini və anonim qiymətləndirmə.",
        },
      },
      {
        title: { en: "Results and certificates", az: "Nəticələr və sertifikatlar" },
        body: {
          en: "Publish the results and send PDF certificates anyone can verify.",
          az: "Nəticələri dərc edin və hər kəsin yoxlaya biləcəyi PDF sertifikatlar göndərin.",
        },
      },
      {
        title: { en: "Communication", az: "Ünsiyyət" },
        body: {
          en: "Announcements by e-mail and Telegram, an event chat and a mentor help queue.",
          az: "E-poçt və Telegram ilə elanlar, tədbir çatı və mentor köməyi növbəsi.",
        },
      },
    ],
    figures: [
      { value: "2", label: { en: "events run", az: "keçirilmiş tədbir" } },
      { value: "213", label: { en: "participants registered", az: "qeydiyyatdan keçmiş iştirakçı" } },
      { value: "38", label: { en: "teams formed", az: "yaranmış komanda" } },
      { value: "37", label: { en: "projects submitted", az: "təqdim olunmuş layihə" } },
    ],
    figuresNote: { en: "From the live counter on hack-os.app, November 2026.", az: "hack-os.app-dakı canlı sayğacdan, noyabr 2026." },
    usedBy: {
      en: "Used at AZCON Future Tech 2026 and at Holberton School Azerbaijan.",
      az: "AZCON Future Tech 2026-da və Holberton School Azerbaijan-da istifadə olunub.",
    },
    primary: { label: { en: "Visit HackOS", az: "HackOS saytı" }, href: "https://www.hack-os.app" },
    secondary: { label: { en: "Plans and prices", az: "Planlar və qiymətlər" }, href: "https://www.hack-os.app/pricing" },
  },
  {
    slug: "uniaz",
    name: "UniAz",
    mark: "/projects/uniaz/mark-80.webp",
    site: "https://uniaz.info",
    status: { en: "Live", az: "Canlı" },
    title: { en: "The way to university, planned with numbers.", az: "Universitetə yol, rəqəmlərlə planlaşdırılır." },
    lead: {
      en: "UniAz by Strativu is a free platform for school-leavers and students in Azerbaijan: work out your exam score with the DİM rules, compare it with past passing scores and build a balanced list of programmes.",
      az: "UniAz by Strativu Azərbaycanda abituriyent və tələbələr üçün ödənişsiz platformadır: imtahan balını DİM qaydaları ilə hesabla, keçən illərin keçid balları ilə müqayisə et və balanslı ixtisas siyahısı qur.",
    },
    image: {
      src: "/projects/uniaz/hero-1600.webp",
      srcSmall: "/projects/uniaz/hero-800.webp",
      width: 1600,
      height: 1000,
      alt: {
        en: "The UniAz website: “Plan your education path more clearly”, with buttons to calculate your score and explore programmes.",
        az: "UniAz saytı: “Təhsil yolunu daha aydın planlaşdır”, balı hesablamaq və ixtisasları araşdırmaq düymələri ilə.",
      },
    },
    points: [
      {
        title: { en: "Score calculator", az: "Bal hesablama" },
        body: {
          en: "Enter your answers and see your final score, subject by subject, calculated with the rules DİM publishes.",
          az: "Cavablarını daxil et və DİM-in açıqladığı qaydalarla fənn-fənn hesablanmış yekun balını gör.",
        },
      },
      {
        title: { en: "Groups and programmes", az: "Qruplar və ixtisaslar" },
        body: {
          en: "All five exam groups, with their subjects and programmes in one place.",
          az: "Beş imtahan qrupunun hamısı, fənləri və ixtisasları ilə bir yerdə.",
        },
      },
      {
        title: { en: "Passing scores", az: "Keçid balları" },
        body: {
          en: "Put your score next to previous years' passing scores, and balance dream, realistic and safe choices.",
          az: "Balını əvvəlki illərin keçid balları ilə yan-yana qoy, arzu, real və ehtiyat seçimləri balansla.",
        },
      },
      {
        title: { en: "Opportunities", az: "İmkanlar" },
        body: {
          en: "Events and internships for students and recent graduates.",
          az: "Tələbələr və yeni məzunlar üçün tədbirlər və təcrübə proqramları.",
        },
      },
    ],
    figures: [
      { value: "78,817", valueAz: "78 817", label: { en: "users", az: "istifadəçi" } },
      { value: "5", label: { en: "exam groups covered", az: "imtahan qrupu" } },
      { value: "0 ₼", label: { en: "cost to students", az: "tələbə üçün qiymət" } },
    ],
    figuresNote: {
      en: "User count confirmed by Strativu, November 2026. UniAz is independent and has no official link with DİM or the universities.",
      az: "İstifadəçi sayı Strativu tərəfindən təsdiqlənib, noyabr 2026. UniAz müstəqildir; DİM və universitetlərlə rəsmi əlaqəsi yoxdur.",
    },
    primary: { label: { en: "Visit UniAz", az: "UniAz saytı" }, href: "https://uniaz.info" },
  },
];
