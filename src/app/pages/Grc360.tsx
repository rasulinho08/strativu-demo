import { useEffect, useRef, useState, type FocusEvent, type PointerEvent } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Btn, Container, Duo, Eyebrow, PageHeader, Rows, Section, TextLink } from "../components/site/primitives";
import { Reveal } from "../components/site/Reveal";
import { Grc360Nav } from "../components/site/Grc360Nav";
import { EarlyAccessForm } from "../components/site/EarlyAccessForm";
import { ProductClosing, ProductFigures, ProductPoints } from "../components/site/ProductOverview";
import { GRC, GRC_SCREEN_SIZE, GRC_SITE, SCREEN_SIZES, grcAz, grcFigures, grcFilm, grcRelease, grcScreens, screenSrcSet } from "../data/grc360";
import { Film, FilmScenes } from "../components/site/Film";
import { useLang } from "../i18n";

/**
 * GRC360 by Strativu on strativu.com: a short overview (/products/grc360) and the early access / demo form
 * (/products/grc360/early-access). Modules, security, frameworks and setup in full live on the GRC360 website (GRC_SITE);
 * the early access and demo forms are on both sites.
 */

const BODY = "mt-5 max-w-[52ch] text-[17px] leading-[1.65] text-ink-2";
/** Duo-nun sağ sütununda ilk abzas (yuxarı boşluq lazım deyil). */
const BODY_R = "max-w-[52ch] text-[17px] leading-[1.65] text-ink-2";
/** Links inside running text: always underlined (not by colour alone, WCAG 1.4.1). */
const INLINE_LINK =
  "text-brand-ink underline decoration-[color-mix(in_srgb,currentColor_45%,transparent)] underline-offset-4 transition-colors hover:decoration-current";

/**
 * Auto-advance for the gallery and the module explorer (WCAG 2.2.2):
 *  - only while on screen and without reduced motion;
 *  - pauses while the mouse is over it or focus is inside it;
 *  - stops for good after the first click, tap, touch or key press inside it.
 */
function useAutoAdvance<T extends HTMLElement>(count: number, ms: number) {
  const [idx, setIdx] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [held, setHeld] = useState(false);
  const ref = useRef<T>(null);
  const inView = useInView(ref, { margin: "-20% 0px -20% 0px" });
  const reduce = useReducedMotion();
  useEffect(() => {
    if (pinned || held || reduce || !inView) return;
    const id = window.setInterval(() => setIdx((v) => (v + 1) % count), ms);
    return () => window.clearInterval(id);
  }, [pinned, held, reduce, inView, count, ms]);
  const bind = {
    onPointerEnter: (e: PointerEvent) => {
      if (e.pointerType === "mouse") setHeld(true);
    },
    onPointerLeave: (e: PointerEvent) => {
      if (e.pointerType === "mouse") setHeld(false);
    },
    onPointerDown: () => setPinned(true),
    onKeyDown: () => setPinned(true),
    onFocus: () => setHeld(true),
    onBlur: (e: FocusEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
    },
  };
  const select = (i: number) => {
    setIdx(i);
    setPinned(true);
  };
  return { ref, idx, select, bind, reduce };
}

function ScreenGallery() {
  const az = useLang() === "az";
  const { ref, idx, select, bind, reduce } = useAutoAdvance<HTMLElement>(grcScreens.length, 4200);
  const sc = grcScreens[idx];
  const warmNext = () => {
    const next = grcScreens[(idx + 1) % grcScreens.length];
    const load = () => {
      const img = new Image();
      img.sizes = SCREEN_SIZES;
      img.srcset = screenSrcSet(next.src);
    };
    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(load, { timeout: 3000 });
    else setTimeout(load, 1200);
  };
  return (
    <figure ref={ref} {...bind}>
      <div role="tablist" aria-label={az ? "GRC360 ekranları" : "GRC360 screens"} className="-mx-1 flex gap-1 overflow-x-auto pb-3 [scrollbar-width:none]">
        {grcScreens.map((g, i) => {
          const on = i === idx;
          return (
            <button
              key={g.key}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => select(i)}
              className={`relative shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors pointer-coarse:min-h-11 ${
                on ? "text-ink" : "text-ink-2 hover:text-ink"
              }`}
            >
              {on && (
                <motion.span
                  layoutId="screen-pill"
                  className="absolute inset-0 rounded-full bg-ink/[0.07]"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              <span className="relative">{g.label}</span>
            </button>
          );
        })}
      </div>
      <div className="relative overflow-hidden rounded-[var(--r-xl)] border border-line bg-surface shadow-[var(--e3)]" style={{ aspectRatio: `${GRC_SCREEN_SIZE.width} / ${GRC_SCREEN_SIZE.height}` }}>
        <AnimatePresence initial={false}>
          <motion.img
            key={sc.key}
            src={sc.src}
            srcSet={screenSrcSet(sc.src)}
            sizes={SCREEN_SIZES}
            width={GRC_SCREEN_SIZE.width}
            height={GRC_SCREEN_SIZE.height}
            alt={az ? (grcAz.screenAlt[sc.key] ?? sc.alt) : sc.alt}
            onLoad={warmNext}
            initial={reduce ? false : { opacity: 0, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 block h-full w-full object-cover object-top"
            decoding="async"
          />
        </AnimatePresence>
      </div>
      <figcaption className="mt-3 flex items-center justify-between gap-4 font-mono text-[11px] text-ink-2">
        <span>
          {az
            ? `${sc.label}, hazırkı versiya. Demo məlumatlar: adlar və qeydlər uydurmadır.`
            : `${sc.label}, current build. Demo data: names and records are made up.`}
        </span>
        <span className="hidden sm:inline">
          {String(idx + 1).padStart(2, "0")} / {String(grcScreens.length).padStart(2, "0")}
        </span>
      </figcaption>
    </figure>
  );
}

/** Four points from the GRC360 landing page; the modules, security and setup in full live on the GRC360 website. */
const POINTS = [
  {
    title: { en: "One risk register", az: "Bir risk reyestri" },
    body: {
      en: "Asset, business and third-party risks with an owner, controls, a treatment plan and your own risk matrix.",
      az: "Aktiv, biznes və üçüncü tərəf riskləri: sahibi, nəzarətləri, müalicə planı və təşkilatın öz risk matrisi ilə.",
    },
  },
  {
    title: { en: "Approvals with a history", az: "Tarixçəsi olan təsdiqlər" },
    body: {
      en: "Exceptions approved step by step: who, when and with what comment, with reminders before the deadline.",
      az: "İstisnalar addım-addım təsdiqlənir: kim, nə vaxt, hansı şərhlə; vaxt bitməzdən əvvəl xatırlatma.",
    },
  },
  {
    title: { en: "Compliance as packages", az: "Paket kimi uyğunluq" },
    body: {
      en: "ISO 27001, PCI DSS, NIST CSF, GDPR, the Personal Data Law, regulator requirements or your own policies, assessed requirement by requirement.",
      az: "ISO 27001, PCI DSS, NIST CSF, GDPR, Fərdi məlumatlar haqqında qanun, tənzimləyici tələbləri və ya daxili siyasətlər, tələb-tələb qiymətləndirilir.",
    },
  },
  {
    title: { en: "Your data stays with you", az: "Məlumat sizdə qalır" },
    body: {
      en: "On your own servers or in an in-country data centre, with MFA, SSO and every action logged.",
      az: "Öz serverlərinizdə və ya ölkədaxili məlumat mərkəzində; MFA, SSO və hər əməliyyatın jurnalı ilə.",
    },
  },
];

export function Grc360() {
  const lang = useLang();
  const az = lang === "az";
  const rel = az ? grcAz.release : grcRelease;
  const site = az ? GRC_SITE.az : GRC_SITE.en;
  const t = (p: { en: string; az: string }) => p[lang];
  const ctas = (
    <>
      <Btn to={`${GRC.earlyAccess}?type=early-access`} size="lg">
        {az ? "Erkən giriş istəyin" : "Request early access"}
      </Btn>
      <Btn to={`${GRC.earlyAccess}?type=demo`} size="lg" variant="secondary">
        {az ? "Demo sifariş edin" : "Book a demo"}
      </Btn>
    </>
  );
  return (
    <>
      <PageHeader
        top={<Grc360Nav />}
        eyebrow={`${rel.label} · ${rel.detail}`}
        title={az ? "Risk, uyğunluq və audit. Bir platformada." : "Risk, compliance and audit. In one platform."}
        lead={
          az
            ? "GRC360 by Strativu risk reyestrlərini, nəzarətləri, siyasətləri, auditləri və tənzimləyici öhdəlikləri Azərbaycan və ingilis dilində bir yerə yığır. Öz serverlərinizdə və ya ölkədaxili məlumat mərkəzində işləyir; hostinq versiyası da var."
            : "GRC360 by Strativu brings risk registers, controls, policies, audits and regulatory obligations into one place, in Azerbaijani and English. It runs on your own servers or in an in-country data centre; a hosted version is also available."
        }
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-4">{ctas}</div>
        <div className="mt-6">
          <TextLink href={site}>{az ? "GRC360 saytı: modullar, təhlükəsizlik, quraşdırma" : "GRC360 website: modules, security, setup"}</TextLink>
        </div>
      </PageHeader>

      {/* Real screens from the current build — not mock-ups. Not faded in: it is the first large image on the page. */}
      <div className="pb-4 pt-4 md:pt-8">
        <Container>
          <Reveal fade={false}>
            <ScreenGallery />
          </Reveal>
        </Container>
      </div>

      <Section id="film">
        <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:items-start xl:gap-x-20">
          <Reveal>
            <Eyebrow>{az ? "Film" : "The film"}</Eyebrow>
            <h2 className="t-h2 text-ink">{az ? "40 saniyədə GRC360." : "GRC360 in 40 seconds."}</h2>
            <p className={BODY}>{az ? "Hazırkı versiyanın real ekranları, demo məlumatlarla." : "Real screens from the current build, with demo data."}</p>
          </Reveal>
          <div>
            <div className="overflow-hidden rounded-[var(--r-xl)] border border-line bg-surface shadow-[var(--e3)]">
              <Film
                src={grcFilm.src}
                webm={grcFilm.webm}
                poster={grcFilm.poster}
                label={az ? "GRC360 məhsul filmi" : "GRC360 product film"}
                describedBy="grc-film-scenes"
              />
            </div>
            <FilmScenes id="grc-film-scenes" className="mt-3" />
          </div>
        </div>
      </Section>

      <ProductPoints
        eyebrow={az ? "Nə edir" : "What it does"}
        title={az ? "GRC360 bir baxışda." : "GRC360 at a glance."}
        items={POINTS.map((p) => ({ title: t(p.title), body: t(p.body) }))}
      />

      <ProductFigures
        lang={lang}
        items={grcFigures.map((f, i) => ({ value: `${f.value}${f.suffix ?? ""}`, label: az ? (grcAz.figures.at(i) ?? f.label) : f.label }))}
      />

      <ProductClosing
        title={az ? "GRC360 2027-ci ilin yanvarında açılır." : "GRC360 opens in January 2027."}
        body={
          az
            ? "Erkən girişə yazılın və ya demonu sifariş edin. Modullar, təhlükəsizlik və quraşdırma barədə hər şey GRC360 saytındadır."
            : "Request early access or book a demo. Everything about the modules, security and setup is on the GRC360 website."
        }
      >
        {ctas}
        <TextLink href={site}>{az ? "GRC360 saytı" : "GRC360 website"}</TextLink>
      </ProductClosing>
    </>
  );
}

export function EarlyAccess() {
  const az = useLang() === "az";
  const rel = az ? grcAz.release : grcRelease;
  const site = az ? GRC_SITE.az : GRC_SITE.en;
  return (
    <>
      <PageHeader
        top={<Grc360Nav />}
        eyebrow={`${rel.label} · ${rel.detail}`}
        title={az ? "Erkən giriş və ya demo." : "Early access or a demo."}
        lead={
          az
            ? "GRC360 2027-ci ilin yanvarında açılır. Erkən girişə yazılın və ya demonu sifariş edin: formda birini seçin."
            : "GRC360 opens in January 2027. Request early access or book a demo: choose one in the form."
        }
      />
      <Section className="pt-0 md:pt-0" logoHide>
        <Duo
          sticky
          head={
            <Rows
              headingLevel={2}
              items={[
                {
                  title: az ? "Erkən giriş" : "Early access",
                  body: az
                    ? "Yanvardan: öz iş mühitiniz, mühəndislərimizlə birbaşa əlaqə və sizə lazım olan framework-lərə üstünlük. Erkən giriş müddətində ödəniş yoxdur."
                    : "From January: your own workspace, direct contact with our engineers and priority for the frameworks you need. No cost during early access.",
                },
                {
                  title: az ? "Demo" : "Demo",
                  body: az
                    ? "Platformanı proseslərinizə uyğun ssenari ilə göstəririk. Qiymət quraşdırma növündən və təşkilatın ölçüsündən asılıdır; təklifi demodan sonra hazırlayırıq."
                    : "We show the platform with a scenario built around your processes. Pricing depends on the type of installation and the size of your organisation; we prepare a quote after the demo.",
                },
                {
                  title: az ? "Kimlər üçündür" : "Who it is for",
                  body: az
                    ? "Banklar və maliyyə, dövlət qurumları, telekom və enerji şirkətləri və holdinqlərdə təhlükəsizlik, risk və uyğunluq komandaları."
                    : "Security, risk and compliance teams at banks, government, telecom and energy companies and holding groups.",
                },
                {
                  title: az ? "Sonra nə olur" : "What happens next",
                  body: (
                    <>
                      {az
                        ? "Komandamızdan bir nəfər beş iş günü ərzində cavab verir. Eyni formlar "
                        : "A person from our team replies within five working days. The same forms are also on the "}
                      <a href={site} target="_blank" rel="noreferrer" className={INLINE_LINK}>
                        {az ? "GRC360 saytında" : "GRC360 website"}
                      </a>
                      {az ? " da var." : "."}
                    </>
                  ),
                },
              ]}
            />
          }
        >
          <Reveal>
            <Eyebrow>{az ? "Sorğu" : "Your request"}</Eyebrow>
          </Reveal>
          <Reveal delay={0.06} className="mt-8">
            <EarlyAccessForm />
          </Reveal>
        </Duo>
      </Section>
    </>
  );
}
