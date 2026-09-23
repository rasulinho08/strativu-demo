import { useEffect, useRef } from "react";

/**
 * 3D Strativu mark — TAM EKRAN SABİT FON SƏHNƏSİ (azcon.gov.az-dakı `#scene` kimi).
 *
 * Quruluş:
 *   <LogoScene/>        → position: fixed; inset: 0; z-index: 0   (bütün kontentin ARXASINDA)
 *   <main/>, <footer/>  → position: relative; z-index: 10         (səhnənin ÜSTÜNDƏ)
 * Kontent bölmələri yarımşəffaf (glass) olduğu üçün loqo bütün sayt boyu arxada görünür.
 *
 * Davranış:
 *  - Loqo ekranın sağ tərəfində SABİT dayanır. Scroll ilə dönmür, kiçilmir, solğunlaşmır.
 *  - Yalnız çox yavaş "nəfəs" hərəkəti var (bax: SWAY / BOB). 0 qoysanız tam hərəkətsiz olur.
 *
 * Model: `public/models/strativu-mark.glb` — Blender-də orijinal loqodan qurulub
 * (bax: tools/logo3d/README.md). Ön/arxa üz orijinal artwork teksturasıdır və İŞIQSIZ
 * render olunur ki, rənglər piksel-piksel loqo ilə eyni qalsın.
 *
 * Performans:
 *  - three.js və model yalnız burada, dinamik import ilə, səhifə yüklənib boşalandan sonra yüklənir.
 *  - `prefers-reduced-motion` və ya WebGL yoxdursa qurulmur.
 *  - Mobil (768px-dən dar) ekranda kiçik ölçü, aşağı şəffaflıq, 30 fps və yüngül bloom.
 *  - Tab görünməyəndə kadr render olunmur. Unmount-da bütün resurslar dispose edilir.
 *
 * Bloom (parıltı): three.js UnrealBloomPass. Yalnız parlaq hissələr (cyan kürələr, açıq üzlər)
 * parıldayır; qara konturlar BLOOM.threshold-dan aşağıda qalır.
 */

const MODEL_URL = "/models/strativu-mark.glb";

/** Loqodan ölçülmüş rənglər (public/brand/mark-texture.png). */
const BRAND_CYAN = "#03C1FD"; // dairələr və yuxarı qanadlar
const BRAND_DEEP = "#0159C5"; // içəri dağ / aşağı mavi

/* ── Tənzimləmə ── */
/** Masaüstü: loqonun yeri (x → sağa, y → yuxarı; ekran ölçüsünün payı) və eni (ekran eninin payı, hündürlük limiti ilə). */
const DESKTOP = { x: 0.3, y: 0.08, w: 0.25, hMax: 0.64, opacity: 0.62 };
/** Mobil (<768px): daha kiçik, yuxarı-sağda, mətnin arxasında daha solğun. */
const MOBILE = { x: 0.3, y: 0.31, w: 0.5, hMax: 0.3, opacity: 0.55 };
/** Baxış bucağı (radian). Y: sola-sağa çevrilmə, X: yuxarıdan baxış. */
const BASE_ROT_Y = -0.34;
const BASE_ROT_X = 0.1;
/** Yavaş nəfəs hərəkəti. SWAY: sağa-sola bucaq (radian), BOB: yuxarı-aşağı (ekran hündürlüyünün payı). 0 = hərəkətsiz. */
const SWAY: number = 0.09;
const BOB: number = 0.008;
/** Bloom. strength: parıltının gücü, radius: yayılma, threshold: hansı parlaqlıqdan yuxarı parıldasın (0-1). */
const BLOOM = { strength: 0.38, radius: 0.6, threshold: 0.55 };
const BLOOM_MOBILE = { strength: 0.3, radius: 0.5, threshold: 0.58 };

export function LogoScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const narrowMq = window.matchMedia("(max-width: 767px)");
    const layout = () => (narrowMq.matches ? MOBILE : DESKTOP);

    let disposed = false;
    const cleanups: Array<() => void> = [];

    /** Wait for window load, then for an idle slot, so the 3D bundle never competes with content. */
    const whenIdle = () =>
      new Promise<void>((resolve) => {
        const idle = () => {
          if (typeof window.requestIdleCallback === "function") {
            const id = window.requestIdleCallback(() => resolve(), { timeout: 2500 });
            cleanups.push(() => window.cancelIdleCallback(id));
          } else {
            const t = window.setTimeout(resolve, 600);
            cleanups.push(() => window.clearTimeout(t));
          }
        };
        if (document.readyState === "complete") idle();
        else {
          window.addEventListener("load", idle, { once: true });
          cleanups.push(() => window.removeEventListener("load", idle));
        }
      });

    (async () => {
      await whenIdle();
      if (disposed) return;
      const THREE = await import("three");
      const [{ GLTFLoader }, { EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }] =
        await Promise.all([
          import("three/examples/jsm/loaders/GLTFLoader.js"),
          import("three/examples/jsm/postprocessing/EffectComposer.js"),
          import("three/examples/jsm/postprocessing/RenderPass.js"),
          import("three/examples/jsm/postprocessing/UnrealBloomPass.js"),
          import("three/examples/jsm/postprocessing/OutputPass.js"),
        ]);
      if (disposed || !hostRef.current) return;

      // ── renderer ──────────────────────────────────────────────────────────
      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
      } catch {
        return; // WebGL yoxdur — səssizcə heç nə göstərmirik
      }
      const pixelRatio = Math.min(window.devicePixelRatio, narrowMq.matches ? 1.25 : 1.5);
      renderer.setPixelRatio(pixelRatio);
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.NoToneMapping; // brend rəngləri olduğu kimi qalsın
      host.appendChild(renderer.domElement);
      Object.assign(renderer.domElement.style, { width: "100%", height: "100%", display: "block" });
      host.style.opacity = String(layout().opacity);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      camera.position.set(0, 0, 9);

      // İşıqlar yalnız yan üzlərə və kürələrə təsir edir.
      scene.add(new THREE.AmbientLight(0xffffff, 2.6));
      const key = new THREE.DirectionalLight(0xffffff, 0.9);
      key.position.set(2.6, 3.4, 4.2);
      scene.add(key);

      // ── model ─────────────────────────────────────────────────────────────
      const spin = new THREE.Group(); // baxış bucağı + nəfəs
      const rig = new THREE.Group(); // mövqe / ölçü
      rig.add(spin);
      scene.add(rig);

      const disposables: Array<{ dispose: () => void }> = [];

      const gltf = await new GLTFLoader().loadAsync(MODEL_URL).catch(() => null);
      if (disposed || !gltf) {
        renderer.dispose();
        renderer.domElement.remove();
        return;
      }

      const model = gltf.scene;
      model.traverse((child) => {
        const mesh = child as import("three").Mesh;
        if (!mesh.isMesh) return;
        if (mesh.geometry) disposables.push(mesh.geometry);

        const source = mesh.material as import("three").MeshStandardMaterial;

        if (source.map) {
          // Ön/arxa üz: işıqsız → ekrandakı piksel = orijinal loqo pikseli
          const flat = new THREE.MeshBasicMaterial({ map: source.map, side: source.side, toneMapped: false });
          flat.map!.anisotropy = 8;
          mesh.material = flat;
          disposables.push(flat);
          return;
        }

        // Yan üzlər və kürələr: tutqun (mat) material, loqodan ölçülmüş rənglərlə
        const isSide = source.name === "MarkSide";
        const matte = new THREE.MeshLambertMaterial({
          color: new THREE.Color(isSide ? BRAND_DEEP : BRAND_CYAN),
          side: source.side,
        });
        mesh.material = matte;
        disposables.push(matte);
      });

      // ── post-processing: bloom ────────────────────────────────────────────
      const composer = new EffectComposer(renderer);
      composer.setPixelRatio(pixelRatio);
      composer.addPass(new RenderPass(scene, camera));
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), BLOOM.strength, BLOOM.radius, BLOOM.threshold);
      composer.addPass(bloomPass);
      composer.addPass(new OutputPass());
      disposables.push(composer, bloomPass);

      const applyBloomPreset = () => {
        const b = narrowMq.matches ? BLOOM_MOBILE : BLOOM;
        bloomPass.strength = b.strength;
        bloomPass.radius = b.radius;
        bloomPass.threshold = b.threshold;
      };
      applyBloomPreset();

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      model.position.sub(box.getCenter(new THREE.Vector3()));
      spin.add(model);
      const unit = 1 / Math.max(size.x, size.y); // model eni = 1 vahid

      // ── vəziyyət ──────────────────────────────────────────────────────────
      let visible = true;
      let viewW = 1; // z=0 müstəvisində görünən en (vahid)
      let viewH = 1;
      let baseY = 0;

      const place = () => {
        const L = layout();
        const width = Math.min(viewW * L.w, viewH * L.hMax);
        rig.scale.setScalar(width * unit);
        rig.position.x = viewW * L.x;
        baseY = viewH * L.y;
        rig.position.y = baseY;
        host.style.opacity = String(L.opacity);
        applyBloomPreset();
      };

      const resize = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        composer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        viewH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
        viewW = viewH * camera.aspect;
        place();
      };

      const onVisibility = () => {
        visible = document.visibilityState === "visible";
      };

      window.addEventListener("resize", resize);
      document.addEventListener("visibilitychange", onVisibility);
      cleanups.push(() => window.removeEventListener("resize", resize));
      cleanups.push(() => document.removeEventListener("visibilitychange", onVisibility));

      resize();

      // ── kadr döngəsi ──────────────────────────────────────────────────────
      const still = SWAY === 0 && BOB === 0;
      const t0 = performance.now();
      let last = 0;
      const frame = () => {
        if (!visible) return;
        const nowMs = performance.now();
        if (narrowMq.matches && nowMs - last < 1000 / 30) return; // mobil: 30 fps limiti
        last = nowMs;
        const t = (nowMs - t0) / 1000;
        spin.rotation.y = BASE_ROT_Y + Math.sin(t * 0.35) * SWAY;
        spin.rotation.x = BASE_ROT_X + Math.sin(t * 0.22) * SWAY * 0.3;
        rig.position.y = baseY + Math.sin(t * 0.5) * viewH * BOB;
        composer.render();
      };

      if (still) {
        spin.rotation.set(BASE_ROT_X, BASE_ROT_Y, 0);
        composer.render();
        const rerender = () => composer.render();
        window.addEventListener("resize", rerender);
        cleanups.push(() => window.removeEventListener("resize", rerender));
      } else {
        renderer.setAnimationLoop(frame);
      }

      cleanups.push(() => {
        renderer.setAnimationLoop(null);
        disposables.forEach((d) => d.dispose());
        renderer.dispose();
        renderer.domElement.remove();
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
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}

export default LogoScene;
