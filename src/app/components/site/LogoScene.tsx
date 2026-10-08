import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

/**
 * 3D Strativu mark — tam ekran, sabit fon səhnəsi (azcon.gov.az-dakı `#scene` kimi).
 *
 * Quruluş:
 *   <LogoScene/>        → position: fixed; inset: 0; z-index: 0   (bütün kontentin ARXASINDA)
 *     .quiet-light      → iki çox yumşaq işıq sahəsi (CSS qatları, theme.css → "background concept")
 *     <canvas/>         → loqo + onun kontakt kölgəsi (şəffaf WebGL)
 *   <main/>, <footer/>  → position: relative; z-index: 10         (səhnənin ÜSTÜNDƏ)
 *
 * Davranış (aşağıdakı CHOREO cədvəli ilə idarə olunur):
 *  - Ana səhifə açılanda loqo böyük və parlaqdır (hero). Scroll etdikcə fırlanır və ~0.2 ekranda (OP_SCREENS)
 *    solğun "rest" vəziyyətinə keçir ki, başlıq və mətn onun üstündən tam parlaq loqo üzərində keçməsin.
 *  - Daxili səhifələr: masaüstündə (≥1024px) çox zəif fon (görünən ≈0.06 light, ≈0.04 dark); telefon və planşetdə (<1024px)
 *    açılış animasiyasından sonra tam solur.
 *  - Forma olan bölmə (`[data-logo-hide]`) ekranda olanda loqo 0-a enir.
 *  - Fon "sakit işıq"dır: xətt, hissəcik, şüa yoxdur. Loqonun arxasında bir böyük yumşaq işıq, altında
 *    yastı "döşəmə" işığı. Hər ikisi loqonu yavaşca izləyir və demək olar ki hiss olunmadan sürüşür.
 *  - Loqo məhsul fotosu kimi işıqlandırılır: yumşaq studiya işığı, altında kontakt kölgəsi (tündə yer işığı).
 *  - Səhifənin sonunda (closing CTA) mərkəzə qayıdır və üzü yenidən qabağa dönür.
 *  - Siçanı hərəkət etdirdikdə loqo yüngülcə ona tərəf əyilir.
 *  - Səhifə dəyişəndə loqo yeni pozaya yumşaq "uçur".
 *
 * Model: `public/models/strativu-mark.glb` (bax: tools/logo3d/README.md). Ön/arxa üz orijinal
 * artwork teksturasıdır; rənglər loqo ilə eyni qalsın deyə əsasən öz işığı (emissive) ilə görünür.
 * Kürələr və yan faskalar studiya əks-işığı (RoomEnvironment) ilə parlaq, cilalı görünür.
 *
 * Performans: three.js, loader-lər və model ilk rəsmdən, şriftlərdən və boş anı gözlədikdən sonra paralel yüklənir;
 * `prefers-reduced-motion`, WebGL yoxdursa, yalnız proqram WebGL (failIfMajorPerformanceCaveat), Save-Data və ya
 * deviceMemory ≤ 2 olanda qurulmur (statik işarə göstərilir); mobildə 30 fps; tab gizli olanda render yoxdur;
 * SLEEP_AFTER_MS hərəkətsizlikdən sonra render dövrü dayanır.
 * İşıq sahələri yalnız `transform` ilə hərəkət edir (kompozitor, yenidən rəsm yoxdur). WebGL yalnız
 * loqonu və kölgəni çəkir və canvas bütün ekran deyil, yalnız loqonun ətrafındakı kəsikdir (CROP):
 * kamera `setViewOffset` ilə tam ekran kadrının həmin hissəsini çəkir, canvas `transform` ilə loqonu izləyir.
 * Bloom default olaraq söndürülüb → post-processing keçidi yoxdur.
 */

const MODEL_URL = "/models/strativu-mark.glb";

/** Loqodan ölçülmüş rənglər (tools/logo3d/assets/mark-texture.png). */
const BRAND_CYAN = "#03C1FD"; // dairələr və yuxarı qanadlar
const BRAND_DEEP = "#0159C5"; // içəri dağ / aşağı mavi

/* ── Tənzimləmə ── */
/**
 * Scroll xoreoqrafiyası (azcon.gov.az üslubu): loqo səhifə boyu "səyahət" edir.
 * Hər poza: x/y → mərkəzdən sürüşmə (ekran eni/hündürlüyünün payı, x sağa, y yuxarı),
 * size → loqonun ölçüsü (ekran hündürlüyünün payı), op → şəffaflıq (0–1), opDark → tünd temada şəffaflıq (yoxdursa op).
 * "mobile" pozaları <1024px üçündür (telefon və planşet: bu enlərdə layout tək sütunludur).
 *
 *   hero  → səhifə açılanda (scroll = 0)
 *   rest  → bir ekran aşağı scroll edəndən sonra, məzmunun arxasında (solğun); şəffaflıq OP_SCREENS-də çatır
 *   end   → `data-logo-stage` elementi ekrana gələndə (ana səhifədə closing CTA): mərkəzə qayıdır
 *           və həmin bölmə ilə birlikdə yuxarı qalxır, footer-in üstünə düşmür.
 */
type Pose = { x: number; y: number; size: number; op: number; opDark?: number };
type Choreo = { hero: Pose; rest: Pose; end?: Pose };

/*
 * Qeyd: `op` materialın şəffaflığıdır. Loqonun ön və arxa üzü üst-üstə düşdüyü üçün görünən şəffaflıq təxminən
 * 1 − (1 − op)² olur (op 0.03 → ~0.06 görünür). "rest" dəyərləri buna görə seçilib: mətn (h1 ≥3:1, adi mətn ≥4.5:1)
 * loqonun üstündə oxunaqlı qalır.
 */
const CHOREO: Record<"home" | "page", { desktop: Choreo; mobile: Choreo }> = {
  home: {
    desktop: {
      hero: { x: 0, y: 0.16, size: 0.44, op: 1 },
      rest: { x: 0, y: 0.02, size: 0.36, op: 0.04, opDark: 0.03 },
      end: { x: 0, y: 0.17, size: 0.34, op: 1 },
    },
    mobile: {
      hero: { x: 0, y: 0.17, size: 0.3, op: 1 },
      rest: { x: 0, y: 0.04, size: 0.26, op: 0.04, opDark: 0.03 },
      end: { x: 0, y: 0.24, size: 0.22, op: 1 },
    },
  },
  page: {
    // Daxili səhifələrdə mətn loqonun üstündədir: masaüstündə çox zəif fon (görünən ~0.06 light, ~0.04 dark),
    // telefon/planşetdə açılışdan sonra 0.
    desktop: {
      hero: { x: 0, y: 0.04, size: 0.4, op: 0.03, opDark: 0.02 },
      rest: { x: 0, y: 0.02, size: 0.36, op: 0.03, opDark: 0.02 },
    },
    mobile: {
      hero: { x: 0, y: 0.3, size: 0.17, op: 0 },
      rest: { x: 0, y: 0.04, size: 0.26, op: 0 },
    },
  },
};
/** Şəffaflıq hero → rest keçidini bu qədər ekranda tamamlayır (mövqe/ölçü keçidi INTRO_SCREENS-də qalır). */
const OP_SCREENS = 0.2;
/** `[data-logo-hide]` bölməsi ekrana girəndə loqo ekran hündürlüyünün bu payında tam solur. */
const HIDE_RAMP = 0.2;

/**
 * Fon işıq sahələrinin forması (rənglər theme.css-də: --ql-*). Ölçülər loqonun eninə görə:
 * spread → yayılma (Gauss sigma), lift → əsas işığın loqodan yuxarı sürüşməsi,
 * drop → döşəmə işığının loqonun mərkəzindən aşağı düşməsi, follow → döşəmə loqonun x-ini nə qədər izləyir.
 * minSize → kiçik loqoda da fon işığı çox kiçilməsin (ekran hündürlüyünün payı).
 */
const FIELD = {
  keySpreadX: 0.74,
  keySpreadY: 0.66,
  keyLift: 0.08,
  floorSpreadX: 1.2,
  floorSpreadY: 0.24,
  floorDrop: 0.46,
  floorFollow: 0.85,
  minSize: 0.3,
};
/**
 * İşıq sahələrinin gücü loqonun görünməsi ilə birlikdə dəyişir: loqo tam parlaq olanda (hero, end, açılış) 1,
 * loqo solğun və ya gizli olanda FIELD_REST. Beləliklə mətnin arxasındakı mavi işıq kontrastı aşağı salmır.
 */
const FIELD_REST = 0.25;
/** İşıq sahələri loqonu bundan yavaş izləyir (FOLLOW-dan kiçik → işıq bir az gecikir, üzvi görünür). */
const LIGHT_FOLLOW = 2.2;
/** Scroll ilə döşəmə işığının yana sürüşməsi (ekran hündürlüyünün payı). */
const SCROLL_SHIFT = 0.05;

/**
 * Kontakt kölgəsi (açıq tema) / yer işığı (tünd tema), loqonun ayaqlarının altında.
 * shadow → kölgənin gücü (0–1), glow → altdan yumşaq işıq gölü. width/height → loqonun eninə görə ölçü.
 */
const GROUND = {
  light: { shadow: 0.34, glow: 0, shadowColor: "#0A1A33", glowColor: "#2F8FEA" },
  dark: { shadow: 0.6, glow: 0.1, shadowColor: "#000000", glowColor: "#2A4677" },
  width: 1.16,
  height: 0.2,
  drop: 0.012,
};

/**
 * Studiya işığı. env → yumşaq otaq əks-işığı (RoomEnvironment), faceGlow → ön üzün öz işığı
 * (rəngin loqoya sadiq qalması üçün), faceLit → ön üzə düşən studiya işığının payı,
 * key/rim → yuxarı-soldan əsas və arxa-sağdan kənar işığı (siyan-ağ), hemi → ümumi dolğu işığı.
 * sphere* → kürələr: geniş, yumşaq "softbox" parıltısı (sancaq kimi nöqtə yox), specular ≈ 28% az.
 * side* → yan faskalar: metal kimi, əks-işıq brend mavisi ilə rənglənir.
 * roomTint → otaq divarlarının rəngi (soyuq polad-siyan): ağ divar faskanı bənövşəyi-boz çalara ağardırdı.
 */
const STUDIO = {
  env: 0.8,
  faceGlow: 0.86,
  faceLit: 0.5,
  key: 1.2,
  rim: 2.2,
  rimColor: "#BFEFFF",
  hemi: 0.6,
  sphereRoughness: 0.42,
  sphereSpecular: 0.72,
  sideMetalness: 0.8,
  sideRoughness: 0.4,
  roomTint: "#5AB0DA",
};

/** Baxış bucağı (radian). */
const BASE_ROT_Y = -0.34;
const BASE_ROT_X = 0.1;
/**
 * Ana səhifə "turntable": loqo mərkəzdə qalır və scroll ilə tam 360° fırlanır (soldan sağa).
 * Bu qədər ekran scroll-da bir tam dövr edir. Kiçik → daha sürətli fırlanır.
 */
const SCREENS_PER_TURN = 1.6;
/** Açılış (mərkəz) pozasından sağdakı pozaya keçid neçə ekran scroll-da tamamlanır. */
const INTRO_SCREENS = 1.05;
/**
 * Açılış animasiyası (sayt yüklənəndə bir dəfə): loqo yaxından, böyük və dönərək görünür,
 * sonra geri "düşür" — öz yerinə və ölçüsünə; daxili səhifələrdə həm də fona solğunlaşır.
 * Bitəndən sonra hər şey adi scroll xoreoqrafiyası ilə davam edir.
 *   duration → saniyə, delay → model yüklənəndən sonra gözləmə, scale → başlanğıc ölçü (1 = adi),
 *   spin → neçə tam dövr (soldan sağa), tiltX → başlanğıc aşma (radian), rise → başlanğıcda nə qədər aşağıda (ekran payı),
 *   glow → başlanğıcda şəffaflıq (daxili səhifələrdə loqo əvvəl parlaq görünür, sonra fona keçir).
 */
const INTRO = { duration: 2.4, delay: 0.1, scale: 1.75, spin: 1, tiltX: -0.55, rise: 0.1, glow: 1 };
/** Siçan ilə əyilmə (radian). 0 = söndürülür. */
const TILT = 0.14;
/** Hərəkətin yumşaqlığı: böyük → daha sürətli izləyir. */
const FOLLOW = 4.2;
/** Yavaş "nəfəs" hərəkəti (radian / ekran payı). */
const SWAY = 0.05;
const BOB = 0.006;
/**
 * Canvas kəsiyi, loqonun maksimal eninə görə: w/h → kəsiyin eni/hündürlüyü, top → loqo mərkəzinin
 * kəsiyin yuxarısından məsafəsi (hündürlüyün payı; aşağıda kölgəyə yer qalsın).
 */
const CROP = { w: 1.34, h: 1.02, top: 0.47 };
/** Sakit vəziyyətdə (scroll/siçan/keçid yoxdur) kadr tezliyi — yavaş nəfəs üçün kifayətdir, enerjiyə qənaət. */
const IDLE_FPS = 20;
/** Bu qədər hərəkətsizlikdən sonra (scroll, siçan, ölçü, tema, səhifə dəyişmir) render dövrü tam dayanır; hərəkətlə yenidən başlayır. */
const SLEEP_AFTER_MS = 2500;
/** Test üçün: localStorage-da bu açar "force" olsa, zəif cihaz/proqram WebGL yoxlaması keçilir. */
const FORCE_KEY = "strativu:logo3d";

/**
 * Hər tərəfə fırlanma (scroll ilə): Y → soldan sağa tam dövr (SCREENS_PER_TURN),
 * X → qabağa/arxaya aşma, Z → künclərdən yana əyilmə. Amplituda radianla, tezlik "hər ekran" üçün.
 * Sonda ("Let's talk") hamısı sıfıra qayıdır və loqo üzü qabağa dayanır.
 */
const TUMBLE = { x: 0.85, xFreq: 1.25, z: 0.5, zFreq: 0.8, easeIn: 0.6 };

/**
 * İşıq izləri (GTA/Tron motosikleti kimi): üç kürə hərəkət edəndə arxasında parlaq xətt qoyur.
 * life → izin ömrü (san.), width → başda qalınlıq (px), glow → parıltı enliyi (qalınlığa vurulur),
 * opacity → ümumi güc, colorLight/colorDark → rəng. İzlər səhifə ilə birlikdə sürüşür, yəni scroll
 * edəndə loqonun arxasında uzanan işıq yolu kimi görünür.
 */
const TRAILS = {
  life: 1.6,
  maxPoints: 110,
  width: 3.2,
  glow: 2.2,
  opacity: 0.5,
  /** İz yalnız kürə ekranda bundan sürətli hərəkət edəndə yaranır (px/san) — boş dayananda iz yoxdur. */
  minSpeed: 40,
  colorLight: "#6F8BB8",
  colorDark: "#8FA6CF",
};
/**
 * Bloom. strength: parıltının gücü (0 = söndürülür, post-processing ümumiyyətlə qurulmur),
 * radius: yayılma, threshold: hansı parlaqlıqdan yuxarı parıldasın (0-1).
 * "Sakit işıq" üçün hər iki temada söndürülüb: loqo məhsul fotosu kimi təmiz görünür, siyan halə yoxdur.
 */
const BLOOM = {
  light: { strength: 0, radius: 0.4, threshold: 0.9 },
  dark: { strength: 0, radius: 0.45, threshold: 0.8 },
};
const BLOOM_MOBILE = {
  light: { strength: 0, radius: 0.4, threshold: 0.9 },
  dark: { strength: 0, radius: 0.4, threshold: 0.8 },
};

/**
 * İşıq sahəsi elementi öz real ölçüsündə rəsm olunur (böyüdülmüş gradient 8-bit zolaqlar verir).
 * Ölçü bu paydan çox dəyişəndə yenidən rəsm olunur; arada fərqi yüngül `scale` örtür.
 */
const FIELD_RESIZE = 0.03;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => t * t * (3 - 2 * t);
/** Kinematoqrafik keçid: yavaş başlayır, ortada sürətlənir, yumşaq dayanır. */
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const mixPose = (a: Pose, b: Pose, t: number): Pose => ({
  x: mix(a.x, b.x, t),
  y: mix(a.y, b.y, t),
  size: mix(a.size, b.size, t),
  op: mix(a.op, b.op, t),
  opDark: mix(a.opDark ?? a.op, b.opDark ?? b.op, t),
});

/** Kontakt kölgəsi + yer işığı. Premultiplied çıxış: rgb = işıq (əlavə olunur), alpha = kölgə (arxanı qaraldır). */
const GROUND_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const GROUND_FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform float uShadow;
  uniform float uGlow;
  uniform float uFeet;
  uniform vec3 uShadowColor;
  uniform vec3 uGlowColor;
  void main() {
    vec2 d = (vUv - 0.5) * 2.0;
    float edge = 1.0 - smoothstep(0.5, 1.0, dot(d, d));
    // geniş yumşaq kölgə + ayaqların altında daha tünd iki təmas nöqtəsi
    float soft = exp(-(d.x * d.x * 2.4 + d.y * d.y * 9.0));
    float fx = abs(d.x) - uFeet;
    float feet = exp(-(fx * fx * 40.0 + d.y * d.y * 34.0));
    float a = clamp(soft * 0.62 + feet * 0.5, 0.0, 1.0) * edge * uShadow;
    float g = exp(-(d.x * d.x * 1.6 + d.y * d.y * 5.0)) * edge * uGlow;
    vec3 sc = linearToOutputTexel(vec4(uShadowColor, 1.0)).rgb;
    vec3 gc = linearToOutputTexel(vec4(uGlowColor, 1.0)).rgb;
    gl_FragColor = vec4(sc * a + gc * g, a);
  }
`;

export function LogoScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  const keyRef = useRef<HTMLDivElement>(null);
  const floorRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const modeRef = useRef<"home" | "page">(pathname === "/" ? "home" : "page");
  modeRef.current = pathname === "/" ? "home" : "page";
  /** Dayanmış render dövrünü yenidən başladır (səhifə dəyişəndə də). */
  const wakeRef = useRef<() => void>(() => {});
  useEffect(() => wakeRef.current(), [pathname]);

  useEffect(() => {
    const host = hostRef.current;
    const keyEl = keyRef.current;
    const floorEl = floorRef.current;
    if (!host || !keyEl || !floorEl) return;

    const root = document.documentElement;
    /** 3D qurulmur → statik işarə görünür (theme.css → html[data-logo3d="off"] .logo-fallback). */
    const off = () => {
      root.dataset.logo3d = "off";
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return off();
    let force = false;
    try {
      force = localStorage.getItem(FORCE_KEY) === "force";
    } catch {}
    // Save-Data, az yaddaşlı cihaz və ya yalnız proqram WebGL (VDI, Citrix, GPU-suz kompüter): 3D-ni ümumiyyətlə yükləmirik.
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const lowEnd = nav.connection?.saveData === true || (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2);
    const gpuOk = (() => {
      try {
        const c = document.createElement("canvas");
        const opts = { failIfMajorPerformanceCaveat: !force };
        const gl = (c.getContext("webgl2", opts) || c.getContext("webgl", opts)) as WebGLRenderingContext | null;
        if (!gl) return false;
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return true;
      } catch {
        return false;
      }
    })();
    if ((lowEnd && !force) || !gpuOk) return off();
    // <1024px: tək sütunlu layout (telefon və planşet) → "mobile" pozalar.
    const narrowMq = window.matchMedia("(max-width: 1023px)");

    let disposed = false;
    const cleanups: Array<() => void> = [];

    /** First paint, then the fonts, then an idle slot — so the 3D download never competes with the text. */
    const whenReady = async () => {
      await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
      await Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 2000))]);
      await new Promise<void>((resolve) => {
        if (typeof window.requestIdleCallback === "function") {
          const id = window.requestIdleCallback(() => resolve(), { timeout: 1500 });
          cleanups.push(() => window.cancelIdleCallback(id));
        } else {
          const t = window.setTimeout(resolve, 300);
          cleanups.push(() => window.clearTimeout(t));
        }
      });
    };

    (async () => {
      await whenReady();
      if (disposed) return;
      // three.js, the loaders and the model download in parallel.
      let THREE: typeof import("three");
      let GLTFLoader: typeof import("three/examples/jsm/loaders/GLTFLoader.js").GLTFLoader;
      let RoomEnvironment: typeof import("three/examples/jsm/environments/RoomEnvironment.js").RoomEnvironment;
      let modelBuffer: ArrayBuffer | null;
      try {
        [THREE, { GLTFLoader }, { RoomEnvironment }, modelBuffer] = await Promise.all([
          import("three"),
          import("three/examples/jsm/loaders/GLTFLoader.js"),
          import("three/examples/jsm/environments/RoomEnvironment.js"),
          fetch(MODEL_URL)
            .then((r) => (r.ok ? r.arrayBuffer() : null))
            .catch(() => null),
        ]);
      } catch {
        return off(); // chunk failed to load (e.g. an old tab after a deploy)
      }
      if (disposed || !hostRef.current) return;
      if (!modelBuffer) return off();

      // Model parsed while the renderer and the studio light are prepared.
      const gltfPromise = new GLTFLoader().parseAsync(modelBuffer, "").catch(() => null);

      // ── renderer ──────────────────────────────────────────────────────────
      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
          failIfMajorPerformanceCaveat: !force,
        });
      } catch {
        return off(); // WebGL yoxdur — statik işarə göstərilir
      }
      const pixelRatio = Math.min(window.devicePixelRatio, narrowMq.matches ? 1.25 : 1.5);
      renderer.setPixelRatio(1); // bufer ölçüsünü özümüz (cihaz pikseli ilə) veririk, bax: resize
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.NoToneMapping; // brend rəngləri olduğu kimi qalsın
      const canvas = renderer.domElement;
      // İşıq izləri üçün ayrıca tam-ekran 2D qat (loqo kəsiyinin altında, kəsiklə kəsilmir).
      const trailCanvas = document.createElement("canvas");
      Object.assign(trailCanvas.style, { position: "absolute", inset: "0", width: "100%", height: "100%", display: "block" });
      host.appendChild(trailCanvas);
      const tctx = trailCanvas.getContext("2d");
      cleanups.push(() => trailCanvas.remove());
      host.appendChild(canvas);
      Object.assign(canvas.style, { position: "absolute", left: "0", top: "0", display: "block", willChange: "transform" });
      host.style.opacity = "0";
      host.style.transition = "opacity 900ms ease";

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      camera.position.set(0, 0, 9);

      const disposables: Array<{ dispose: () => void }> = [];
      const bail = () => {
        disposables.forEach((d) => d.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };

      // ── studiya işığı ─────────────────────────────────────────────────────
      // Yumşaq otaq əks-işığı (bir dəfə hazırlanır) + yuxarı-soldan softbox + arxa-sağdan kənar işığı.
      const pmrem = new THREE.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      room.traverse((o) => {
        const m = (o as import("three").Mesh).material as import("three").MeshStandardMaterial | undefined;
        if (m && m.side === THREE.BackSide) m.color.set(STUDIO.roomTint);
      });
      const envMap = pmrem.fromScene(room, 0.04, 0.1, 100, { size: 64 }).texture;
      room.dispose();
      pmrem.dispose();
      disposables.push(envMap);

      scene.add(new THREE.HemisphereLight(0xf2f7ff, 0x0b2a5c, STUDIO.hemi));
      const key = new THREE.DirectionalLight(0xffffff, STUDIO.key);
      key.position.set(-3.2, 4.2, 5);
      scene.add(key);
      const rim = new THREE.DirectionalLight(new THREE.Color(STUDIO.rimColor), STUDIO.rim);
      rim.position.set(4.5, 2.2, -3.5);
      scene.add(rim);

      // ── model ─────────────────────────────────────────────────────────────
      const spin = new THREE.Group(); // bucaq
      const rig = new THREE.Group(); // mövqe / ölçü
      rig.add(spin);
      scene.add(rig);

      const logoMats: import("three").Material[] = [];

      const gltf = await gltfPromise;
      if (disposed || !gltf) {
        bail();
        if (!disposed) off();
        return;
      }

      const model = gltf.scene;
      let sphereMesh: import("three").Mesh | null = null;
      model.traverse((child) => {
        const mesh = child as import("three").Mesh;
        if (!mesh.isMesh) return;
        if (mesh.geometry) disposables.push(mesh.geometry);

        const source = mesh.material as import("three").MeshStandardMaterial;
        disposables.push(source);
        if (source.map) disposables.push(source.map);
        if (source.emissiveMap) disposables.push(source.emissiveMap);
        let mat:
          | import("three").MeshStandardMaterial
          | import("three").MeshPhysicalMaterial
          | import("three").MeshLambertMaterial;

        if (source.map) {
          // Ön/arxa üz: rəng əsasən öz işığından (emissive) gəlir → loqo pikselinə sadiq qalır;
          // studiya işığı üstünə yumşaq işıq-kölgə verir (loqo fırlananda üz bir az tündləşir).
          source.map.anisotropy = 8;
          mat = new THREE.MeshLambertMaterial({
            map: source.map,
            color: new THREE.Color(STUDIO.faceLit, STUDIO.faceLit, STUDIO.faceLit),
            emissiveMap: source.map,
            emissive: 0xffffff,
            emissiveIntensity: STUDIO.faceGlow,
          });
        } else if (source.name === "MarkSide") {
          // Yan üzlər: tünd brend mavisi, metal kimi — əks-işıq mavi ilə rənglənir, faskada bənövşəyi çalmır
          mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(BRAND_DEEP),
            roughness: STUDIO.sideRoughness,
            metalness: STUDIO.sideMetalness,
            envMap,
            envMapIntensity: STUDIO.env * 1.25,
          });
        } else {
          sphereMesh = mesh;
          // Kürələr: siyan, yarı-mat lak — geniş, yumşaq softbox parıltısı (specularIntensity → ≈28% az)
          mat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(BRAND_CYAN),
            emissive: new THREE.Color(BRAND_CYAN),
            emissiveIntensity: 0.22,
            roughness: STUDIO.sphereRoughness,
            metalness: 0,
            specularIntensity: STUDIO.sphereSpecular,
            envMap,
            envMapIntensity: STUDIO.env * 1.2,
          });
        }
        mat.side = source.side;
        mat.transparent = true; // CHOREO-dakı `op` üçün
        mat.forceSinglePass = true; // iki tərəfli şəffaf material bir keçiddə çəkilsin (2x ucuz)
        logoMats.push(mat);
        mesh.material = mat;
        disposables.push(mat);
      });

      // ── post-processing: bloom (yalnız BLOOM-da gücü 0-dan böyük preset varsa qurulur) ──
      const presets = [BLOOM.light, BLOOM.dark, BLOOM_MOBILE.light, BLOOM_MOBILE.dark];
      let composer: import("three/examples/jsm/postprocessing/EffectComposer.js").EffectComposer | null = null;
      let bloomPass: import("three/examples/jsm/postprocessing/UnrealBloomPass.js").UnrealBloomPass | null = null;
      if (presets.some((b) => b.strength > 0)) {
        const [{ EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }] = await Promise.all([
          import("three/examples/jsm/postprocessing/EffectComposer.js"),
          import("three/examples/jsm/postprocessing/RenderPass.js"),
          import("three/examples/jsm/postprocessing/UnrealBloomPass.js"),
          import("three/examples/jsm/postprocessing/OutputPass.js"),
        ]);
        if (disposed) {
          bail();
          return;
        }
        composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0, 0.4, 0.9);
        composer.addPass(bloomPass);
        composer.addPass(new OutputPass());
        disposables.push(composer, bloomPass);
      }

      let themeDark = false;
      const applyBloomPreset = () => {
        if (!bloomPass) return;
        const b = (narrowMq.matches ? BLOOM_MOBILE : BLOOM)[themeDark ? "dark" : "light"];
        bloomPass.strength = b.strength;
        bloomPass.radius = b.radius;
        bloomPass.threshold = b.threshold;
        bloomPass.enabled = b.strength > 0;
      };

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      model.position.sub(box.getCenter(new THREE.Vector3()));
      spin.add(model);
      const unit = 1 / Math.max(size.x, size.y); // modelin ən böyük ölçüsü = 1 vahid

      // ── işıq izləri: üç kürənin mərkəzi (kürə torunun təpələri x-ə görə üç qrupa bölünür) ──
      const tips: import("three").Vector3[] = [];
      if (sphereMesh) {
        const sm = sphereMesh as import("three").Mesh;
        const pos = sm.geometry.getAttribute("position");
        sm.geometry.computeBoundingBox();
        const bb = sm.geometry.boundingBox!;
        const third = (bb.max.x - bb.min.x) / 3;
        const acc = [0, 1, 2].map(() => ({ v: new THREE.Vector3(), n: 0 }));
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const g = x < bb.min.x + third ? 0 : x > bb.max.x - third ? 2 : 1;
          acc[g].v.add(new THREE.Vector3(x, pos.getY(i), pos.getZ(i)));
          acc[g].n++;
        }
        for (const a of acc) if (a.n) tips.push(a.v.divideScalar(a.n));
      }
      type TrailPt = { x: number; py: number; t: number };
      const trails: TrailPt[][] = tips.map(() => []);
      const tipWorld = new THREE.Vector3();
      const prevTip: ({ x: number; py: number } | null)[] = tips.map(() => null);
      let trailPath = window.location.pathname;
      let lastTrailT = 0;
      let trailW = 0;
      let trailH = 0;
      let trailDpr = 1;
      let trailDirty = false;
      const sizeTrails = () => {
        trailDpr = Math.min(window.devicePixelRatio, narrowMq.matches ? 1.5 : 1.25);
        trailW = host.clientWidth;
        trailH = host.clientHeight;
        trailCanvas.width = Math.round(trailW * trailDpr);
        trailCanvas.height = Math.round(trailH * trailDpr);
      };
      sizeTrails();
      window.addEventListener("resize", sizeTrails);
      cleanups.push(() => window.removeEventListener("resize", sizeTrails));

      /** Kürələrin ekran mövqeyini qeydə alır və izləri çəkir. */
      const updateTrails = (nowS: number, op: number) => {
        if (!tctx || !tips.length) return;
        // Səhifə dəyişəndə köhnə izlər silinir (onlar əvvəlki səhifənin koordinatlarındadır).
        if (window.location.pathname !== trailPath) {
          trailPath = window.location.pathname;
          trails.forEach((l) => (l.length = 0));
          prevTip.fill(null);
        }
        const dtS = lastTrailT ? Math.max(1e-3, nowS - lastTrailT) : 0;
        lastTrailT = nowS;
        model.updateWorldMatrix(true, false);
        const sy = window.scrollY;
        tips.forEach((tip, i) => {
          tipWorld.copy(tip).applyMatrix4(model.matrixWorld).project(camera);
          const x = cropX + ((tipWorld.x + 1) / 2) * cropW;
          const yScreen = cropY + ((1 - tipWorld.y) / 2) * cropH;
          const list = trails[i];
          const lastPt = list[list.length - 1];
          const py = yScreen + sy;
          // İz yalnız kürə həqiqətən hərəkət edəndə (scroll, fırlanma) yaranır; yerində duranda köhnə iz sönür.
          const prev = prevTip[i];
          const speed = prev && dtS ? Math.hypot(prev.x - x, prev.py - py) / dtS : 0;
          prevTip[i] = { x, py };
          if (speed > TRAILS.minSpeed && (!lastPt || Math.hypot(lastPt.x - x, lastPt.py - py) > 1.5)) {
            list.push({ x, py, t: nowS });
          }
          while (list.length && (nowS - list[0].t > TRAILS.life || list.length > TRAILS.maxPoints)) list.shift();
        });
        const any = trails.some((l) => l.length > 1);
        if (!any && !trailDirty) return;
        tctx.setTransform(trailDpr, 0, 0, trailDpr, 0, 0);
        tctx.clearRect(0, 0, trailW, trailH);
        trailDirty = any;
        if (!any) return;
        const dark = document.documentElement.classList.contains("dark");
        tctx.globalCompositeOperation = "source-over"; // neon kimi parlamasın
        tctx.strokeStyle = dark ? TRAILS.colorDark : TRAILS.colorLight;
        tctx.lineCap = "butt"; // yuvarlaq uclar üst-üstə düşüb "muncuq" effekti yaradırdı
        tctx.lineJoin = "round";
        // Loqo solğun olanda (rest, daxili səhifələr, formalar) izlər də onunla birlikdə solur; tam parlaq loqoda dəyişmir.
        const strength = TRAILS.opacity * (0.55 + 0.45 * op) * clamp01(op / 0.14);
        for (const list of trails) {
          for (let j = 1; j < list.length; j++) {
            const a = list[j - 1];
            const b = list[j];
            const age = clamp01((nowS - b.t) / TRAILS.life);
            const along = j / list.length; // quyruq → baş
            const fade = (1 - age) * (1 - age) * along;
            if (fade < 0.01) continue;
            const w = TRAILS.width * (0.25 + 0.75 * along);
            // parıltı (geniş, zəif) + nüvə (nazik, parlaq)
            tctx.globalAlpha = fade * strength * 0.16;
            tctx.lineWidth = w * TRAILS.glow;
            tctx.beginPath();
            tctx.moveTo(a.x, a.py - sy);
            tctx.lineTo(b.x, b.py - sy);
            tctx.stroke();
            tctx.globalAlpha = fade * strength;
            tctx.lineWidth = w;
            tctx.stroke();
          }
        }
        tctx.globalAlpha = 1;
      };

      // ── kontakt kölgəsi / yer işığı ───────────────────────────────────────
      const groundW = size.x * GROUND.width;
      const groundUniforms = {
        uShadow: { value: 0 },
        uGlow: { value: 0 },
        uFeet: { value: (size.x * 0.9) / groundW }, // ayaqların yeri (kölgənin -1..1 enində)
        uShadowColor: { value: new THREE.Color() },
        uGlowColor: { value: new THREE.Color() },
      };
      const groundGeo = new THREE.PlaneGeometry(1, 1);
      const groundMat = new THREE.ShaderMaterial({
        uniforms: groundUniforms,
        vertexShader: GROUND_VERT,
        fragmentShader: GROUND_FRAG,
        transparent: true,
        premultipliedAlpha: true,
        depthTest: false,
        depthWrite: false,
      });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.renderOrder = -1;
      ground.position.set(0, -size.y / 2 - size.x * GROUND.drop, -size.z);
      rig.add(ground); // spin-ə yox, rig-ə bağlıdır: loqo fırlananda kölgə yerində qalır
      disposables.push(groundGeo, groundMat);
      const edgeOn = Math.min(1, size.z / size.x) + 0.1; // yandan baxanda kölgənin minimal eni

      /** Tema: kölgə/yer işığı rəngləri. Fon sahələrinin rəngləri CSS-dədir (--ql-*), özü dəyişir. */
      let themeKnown = false;
      const syncTheme = () => {
        const dark = document.documentElement.classList.contains("dark");
        if (themeKnown && dark === themeDark) return;
        themeKnown = true;
        themeDark = dark;
        const g = dark ? GROUND.dark : GROUND.light;
        groundUniforms.uShadowColor.value.set(g.shadowColor);
        groundUniforms.uGlowColor.value.set(g.glowColor);
        applyBloomPreset();
      };
      syncTheme();

      // ── vəziyyət ──────────────────────────────────────────────────────────
      let visible = document.visibilityState === "visible";
      let viewW = 1; // z=0 müstəvisində görünən en (vahid)
      let viewH = 1;
      let hostW = 1; // CSS px
      let hostH = 1;
      let cropW = 1; // canvas kəsiyi, CSS px
      let cropH = 1;
      let cropX = NaN;
      let cropY = NaN;
      /** Loqonun bütün pozalarda ən böyük ölçüsü (ekran hündürlüyünün payı) — kəsik bununla ölçülür. */
      const maxSize = (kind: "desktop" | "mobile") =>
        Math.max(
          ...(["home", "page"] as const).flatMap((m) => {
            const c = CHOREO[m][kind];
            return [c.hero.size, c.rest.size, c.end?.size ?? 0];
          }),
        );
      const pointer = { x: 0, y: 0 };
      /** Hazırkı (yumşaldılmış) vəziyyət. İlk kadrda birbaşa hədəfə qoyulur. */
      let cur: (Pose & { ry: number; rx: number; rz: number }) | null = null;
      /** İşıq sahələrinin (daha yavaş) izlədiyi mövqe. */
      const light = { x: 0, y: 0, size: 0 };
      /** Son yazılan transform-lar (dəyişməyibsə DOM-a toxunmuruq). */
      // [x, y, scaleX, scaleY, rasterW, rasterH]
      const lastKey = [NaN, NaN, NaN, NaN, 0, 0];
      const lastFloor = [NaN, NaN, NaN, NaN, 0, 0];
      let lastActive = performance.now();
      let lastScrollY = window.scrollY;
      /** Açılış animasiyası: ilk kadrda başlayır; bitəndə kəsik adi ölçüyə qaytarılır. */
      let introStart = NaN;
      let introDone = false;

      /** Scroll mövqeyindən hədəf pozanı hesablayır. */
      const target = () => {
        const vh = window.innerHeight || 1;
        const y = window.scrollY;
        const c = CHOREO[modeRef.current][narrowMq.matches ? "mobile" : "desktop"];

        const tRest = easeInOut(clamp01(y / (vh * INTRO_SCREENS)));
        let pose = mixPose(c.hero, c.rest, tRest);
        // Şəffaflıq daha tez solur: başlıq loqonun üstünə çatanda loqo artıq solğundur.
        const tOp = easeInOut(clamp01(y / (vh * OP_SCREENS)));
        pose.op = mix(c.hero.op, c.rest.op, tOp);
        pose.opDark = mix(c.hero.opDark ?? c.hero.op, c.rest.opDark ?? c.rest.op, tOp);
        let tEnd = 0;
        const stage = c.end ? document.querySelector("[data-logo-stage]") : null;
        if (c.end && stage) {
          const top = stage.getBoundingClientRect().top;
          tEnd = ease(clamp01(1 - top / (vh * 0.9)));
          pose = mixPose(pose, c.end, tEnd);
          // Bölmə yuxarı keçəndə loqo onunla birlikdə qalxır.
          if (top < 0) pose.y += -top / vh;
        }
        // Tema üzrə şəffaflıq, sonra forma bölməsi ekrandadırsa tam solma.
        let op = themeDark ? (pose.opDark ?? pose.op) : pose.op;
        let hide = 0;
        document.querySelectorAll("[data-logo-hide]").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.bottom <= 0 || r.top >= vh) return;
          hide = Math.max(hide, Math.min(clamp01((vh - r.top) / (vh * HIDE_RAMP)), clamp01(r.bottom / (vh * HIDE_RAMP))));
        });
        op *= 1 - hide;
        pose = { ...pose, op };

        // Scroll ilə fırlanma; sonda üzü qabağa (ən yaxın tam dövrə) qayıdır.
        // Ana səhifə: açılışda bir tam, yumşaq dövr (sağa üzü qabağa çatır); sonra yalnız yellənmə.
        // Bütün səhifələrdə "turntable": mərkəzdə, scroll ilə tam 360° dövr.
        const spinY = BASE_ROT_Y + (y / vh / SCREENS_PER_TURN) * Math.PI * 2;
        const home = BASE_ROT_Y + Math.round((spinY - BASE_ROT_Y) / (Math.PI * 2)) * Math.PI * 2;
        const ry = mix(spinY, home, tEnd) + pointer.x * TILT;
        const s = y / vh;
        // Açılışda (scroll = 0) hər iki əyilmə sıfırdır → loqo əvvəlki kimi düz dayanır;
        // aşma/yana əyilmə ilk ~yarım ekran scroll-da yumşaq başlayır.
        const tumbleIn = ease(clamp01(s / TUMBLE.easeIn));
        const tumbleX = Math.sin(s * TUMBLE.xFreq) * TUMBLE.x * tumbleIn;
        const tumbleZ = Math.sin(s * TUMBLE.zFreq) * TUMBLE.z * tumbleIn;
        const rx = BASE_ROT_X + mix(tumbleX, 0, tEnd) - pointer.y * TILT * 0.6;
        const rz = mix(tumbleZ, 0, tEnd);
        return { ...pose, ry, rx, rz };
      };

      const resize = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        if (!w || !h) return;
        hostW = w;
        hostH = h;
        const grow = introDone ? 1 : INTRO.scale; // açılışda loqo böyükdür — kəsik də böyük olsun
        const px = Math.min(maxSize(narrowMq.matches ? "mobile" : "desktop") * h * grow, w * 0.85 * grow);
        const bufW = Math.ceil(px * CROP.w * pixelRatio);
        const bufH = Math.ceil(px * CROP.h * pixelRatio);
        cropW = bufW / pixelRatio;
        cropH = bufH / pixelRatio;
        renderer.setSize(bufW, bufH, false);
        composer?.setSize(bufW, bufH);
        canvas.style.width = `${cropW}px`;
        canvas.style.height = `${cropH}px`;
        camera.aspect = w / h;
        cropX = NaN; // növbəti kadrda view offset yenilənsin
        viewH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
        viewW = viewH * camera.aspect;
        applyBloomPreset();
        lastActive = performance.now();
      };

      const onVisibility = () => {
        visible = document.visibilityState === "visible";
        if (visible) wake();
      };
      const onPointer = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
        lastActive = performance.now();
        wake();
      };
      const onResize = () => {
        resize();
        wake();
      };
      // Theme switch changes shadow colours: render again.
      const themeObserver = new MutationObserver(() => wake());
      themeObserver.observe(root, { attributes: true, attributeFilter: ["class"] });

      window.addEventListener("resize", onResize);
      window.addEventListener("scroll", wake, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("pointermove", onPointer, { passive: true });
      cleanups.push(() => window.removeEventListener("resize", onResize));
      cleanups.push(() => window.removeEventListener("scroll", wake));
      cleanups.push(() => document.removeEventListener("visibilitychange", onVisibility));
      cleanups.push(() => window.removeEventListener("pointermove", onPointer));
      cleanups.push(() => themeObserver.disconnect());

      resize();

      /** Bir işıq sahəsini yerləşdirir: mərkəz və Gauss sigma (CSS px). Yalnız dəyişəndə DOM-a yazır. */
      const placeField = (el: HTMLElement, last: number[], cx: number, cy: number, sx: number, sy: number) => {
        // Gradientin kənarı ≈ 3 sigma → elementin ölçüsü 6·sigma
        const w = 6 * sx;
        const h = 6 * sy;
        if (Math.abs(w / last[4] - 1) > FIELD_RESIZE || Math.abs(h / last[5] - 1) > FIELD_RESIZE) {
          last[4] = Math.round(w);
          last[5] = Math.round(h);
          el.style.width = `${last[4]}px`;
          el.style.height = `${last[5]}px`;
          el.style.marginLeft = `${-last[4] / 2}px`;
          el.style.marginTop = `${-last[5] / 2}px`;
          last[0] = NaN;
        }
        const kx = w / last[4];
        const ky = h / last[5];
        if (
          Math.abs(cx - last[0]) < 0.25 &&
          Math.abs(cy - last[1]) < 0.25 &&
          Math.abs(kx - last[2]) < 0.001 &&
          Math.abs(ky - last[3]) < 0.001
        )
          return;
        last[0] = cx;
        last[1] = cy;
        last[2] = kx;
        last[3] = ky;
        el.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0) scale(${kx.toFixed(4)}, ${ky.toFixed(4)})`;
      };

      /** Fon sahələri və kölgə: loqonun yavaş izlənən mövqeyindən. */
      let lastFieldOp = NaN;
      const updateLight = (dt: number, vis: number) => {
        if (!cur) return;
        const fieldOp = Math.round(mix(FIELD_REST, 1, clamp01(vis)) * 100) / 100;
        if (fieldOp !== lastFieldOp) {
          lastFieldOp = fieldOp;
          keyEl.style.opacity = String(fieldOp);
          floorEl.style.opacity = String(fieldOp);
        }
        const kl = 1 - Math.exp(-dt * LIGHT_FOLLOW);
        light.x = mix(light.x, cur.x, kl);
        light.y = mix(light.y, cur.y, kl);
        light.size = mix(light.size, cur.size, kl);

        const aspect = camera.aspect;
        const s = Math.max(Math.min(light.size, aspect * 0.85), FIELD.minSize) * hostH; // loqonun eni, px
        const cx = hostW / 2 + light.x * hostW;
        const cy = hostH / 2 - light.y * hostH;
        const screens = window.scrollY / (window.innerHeight || 1);

        placeField(keyEl, lastKey, cx, cy - s * FIELD.keyLift, s * FIELD.keySpreadX, s * FIELD.keySpreadY);
        placeField(
          floorEl,
          lastFloor,
          hostW / 2 + light.x * hostW * FIELD.floorFollow + Math.sin(screens * 0.42) * SCROLL_SHIFT * hostH,
          cy + s * FIELD.floorDrop,
          s * FIELD.floorSpreadX,
          s * FIELD.floorSpreadY,
        );

        // Kölgə loqonun görünən eninə uyğun daralır (yandan baxanda nazik olur).
        const g = themeDark ? GROUND.dark : GROUND.light;
        const facing = Math.abs(Math.cos(spin.rotation.y));
        ground.scale.set(groundW * mix(edgeOn, 1, facing), size.x * GROUND.height, 1);
        groundUniforms.uShadow.value = g.shadow * cur.op * mix(0.55, 1, facing);
        groundUniforms.uGlow.value = g.glow * cur.op;
      };

      // ── kadr döngəsi ──────────────────────────────────────────────────────
      const t0 = performance.now();
      let last = t0;
      /** Loqo tam şəffafdır və kadr artıq təmizlənib. */
      let blank = false;
      /** Render dövrü işləyir (SLEEP_AFTER_MS hərəkətsizlikdən sonra dayanır). */
      let running = false;
      function wake() {
        if (running || disposed) return;
        running = true;
        last = performance.now();
        lastActive = last;
        renderer.setAnimationLoop(frame);
      }
      wakeRef.current = wake;
      /** Uzun hərəkətsizlikdə dövrü dayandırır: son kadr ekranda qalır, "nəfəs" hərəkəti dayanır. */
      const maybeSleep = (now: number) => {
        if (introDone && now - lastActive > SLEEP_AFTER_MS) {
          running = false;
          renderer.setAnimationLoop(null);
        }
      };
      const frame = () => {
        if (!visible) return;
        const now = performance.now();
        if (window.scrollY !== lastScrollY) {
          lastScrollY = window.scrollY;
          lastActive = now;
        }
        const settled = now - lastActive > 700;
        const minGap = narrowMq.matches ? 1000 / 30 : settled ? 1000 / IDLE_FPS : 0; // mobil: 30 fps limiti
        if (now - last < minGap - 1) return;
        const dt = Math.min(0.1, (now - last) / 1000);
        last = now;
        const t = (now - t0) / 1000;

        const goal = target();
        if (!cur) {
          cur = { ...goal };
          light.x = goal.x;
          light.y = goal.y;
          light.size = goal.size;
          host.style.opacity = "1";
          host.dataset.ready = "";
          root.dataset.logo3d = "on";
        }
        const k = 1 - Math.exp(-dt * FOLLOW);
        if (Math.abs(goal.x - cur.x) + Math.abs(goal.y - cur.y) + Math.abs(goal.ry - cur.ry) > 0.002) lastActive = now;
        cur.x = mix(cur.x, goal.x, k);
        cur.y = mix(cur.y, goal.y, k);
        cur.size = mix(cur.size, goal.size, k);
        cur.op = mix(cur.op, goal.op, k);
        cur.ry = mix(cur.ry, goal.ry, k);
        cur.rx = mix(cur.rx, goal.rx, k);
        cur.rz = mix(cur.rz, goal.rz, k);

        // Açılış: böyük və dönərək başlayır, geri öz yerinə düşür (bax: INTRO).
        let iScale = 1;
        let iSpin = 0;
        let iTilt = 0;
        let iRise = 0;
        let iOp = cur.op;
        if (!introDone) {
          if (Number.isNaN(introStart)) introStart = now;
          const p = clamp01(((now - introStart) / 1000 - INTRO.delay) / INTRO.duration);
          const e = easeOutQuart(p);
          iScale = mix(INTRO.scale, 1, e);
          iSpin = (1 - e) * INTRO.spin * Math.PI * 2;
          iTilt = (1 - e) * INTRO.tiltX;
          iRise = (1 - ease(p)) * INTRO.rise;
          // əvvəl görünür olur, sonra (daxili səhifələrdə) fona solğunlaşır
          iOp = Math.min(clamp01(p / 0.22), mix(Math.max(INTRO.glow, cur.op), cur.op, ease(clamp01((p - 0.35) / 0.65))));
          lastActive = now;
          if (p >= 1) {
            introDone = true;
            resize();
          }
        }

        const px = Math.min(viewH * cur.size, viewW * 0.85) * iScale;
        rig.scale.setScalar(px * unit);
        rig.position.x = viewW * cur.x;
        rig.position.y = viewH * (cur.y - iRise) + Math.sin(t * 0.5) * viewH * BOB;
        spin.rotation.y = cur.ry - iSpin + Math.sin(t * 0.35) * SWAY;
        spin.rotation.x = cur.rx + iTilt + Math.sin(t * 0.22) * SWAY * 0.3;
        spin.rotation.z = cur.rz;
        for (const m of logoMats) m.opacity = iOp;

        // Kəsik loqonun ekran mövqeyini izləyir (cihaz pikselinə yuvarlaqlaşdırılır → bulanıqlıq yoxdur).
        const ox = Math.round((hostW * (0.5 + cur.x) - cropW * 0.5) * pixelRatio) / pixelRatio;
        const oy = Math.round((hostH * (0.5 - (cur.y - iRise)) - cropH * CROP.top) * pixelRatio) / pixelRatio;
        if (ox !== cropX || oy !== cropY) {
          cropX = ox;
          cropY = oy;
          camera.setViewOffset(hostW, hostH, ox, oy, cropW, cropH);
          canvas.style.transform = `translate3d(${ox}px, ${oy}px, 0)`;
        }
        syncTheme();
        updateLight(dt, iOp);
        // Tam şəffaf olanda (açılışdan sonra) WebGL rəsm etmir: bir dəfə təmizlənir, sonra boş qalır.
        if (introDone && iOp < 0.003) {
          if (!blank) {
            renderer.clear();
            trails.forEach((l) => (l.length = 0));
            prevTip.fill(null);
            if (tctx) {
              tctx.setTransform(1, 0, 0, 1, 0, 0);
              tctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
            }
            trailDirty = false;
            blank = true;
          }
          maybeSleep(now);
          return;
        }
        blank = false;
        updateTrails(now / 1000, iOp);
        if (composer && bloomPass?.enabled) composer.render();
        else renderer.render(scene, camera);
        maybeSleep(now);
      };
      wake();

      cleanups.push(() => {
        renderer.setAnimationLoop(null);
        running = false;
        wakeRef.current = () => {};
        delete host.dataset.ready;
        bail();
      });
    })();

    return () => {
      disposed = true;
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden
      data-logo-scene
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Sakit işıq: iki yumşaq sahə + vinyet + dənə (stil: theme.css → "background concept") */}
      <div className="quiet-light">
        <div ref={floorRef} className="quiet-light__field quiet-light__field--floor">
          <span />
        </div>
        <div ref={keyRef} className="quiet-light__field quiet-light__field--key">
          <span />
        </div>
        <span className="quiet-light__vignette" />
      </div>
    </div>
  );
}

export default LogoScene;
