# Logo → 3D pipeline

Loqonu şəkildən 3D modelə çevirən zəncir. Loqo dəyişsə, bu üç skripti sırayla işlətmək kifayətdir.

| Addım | Skript | Nə edir | Çıxış |
| :-- | :-- | :-- | :-- |
| 1 | `trace_logo.py` | `tools/logo3d/assets/logo-source.jpeg`-dən siluet konturunu, üç dairənin mərkəz/radiusunu çıxarır və tekstura kəsimini saxlayır | `mark.json`, `tools/logo3d/assets/mark-texture.png`, `trace-check.png` (yoxlama) |
| 2 | `build_mark.py` | Blender-də konturu qalınlaşdırıb faska verir, üç kürəni əlavə edir, artwork teksturasını ön/arxa üzə UV ilə oturdur, GLB export edir | `public/models/strativu-mark.glb` |
| 3 | `make_transparent.py` | Qara fonu silib şəffaf PNG-lər hazırlayır (header və footer üçün) | `public/brand/logo-full.png`, `public/brand/logo-mark.png` |

## İşə salma

```bash
# 1 və 3 — adi Python (numpy + Pillow lazımdır)
python tools/logo3d/trace_logo.py
python tools/logo3d/make_transparent.py

# 2 — Blender (background rejimi, pəncərə açılmır)
"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" --background --factory-startup --python tools/logo3d/build_mark.py
```

Skriptlərdəki yollar skriptin öz qovluğuna nisbətəndir: mənbə fayllar `tools/logo3d/assets/`-dədir (saytla birlikdə
dərc olunmur), çıxışlar `public/models/` və `public/brand/`-a yazılır. `build_mark.py` `mark.json`-u öz qovluğundan oxuyur.

## Tənzimləmə nöqtələri

`build_mark.py`:
- `DEPTH` — gövdə qalınlığı (default `0.13`)
- `BEVEL` — kənar faskası (default `0.018`)
- `TARGET` — modelin ən böyük ölçüsü (default `2.0` vahid)

`src/app/components/site/LogoScene.tsx` (saytdakı davranış — sabit fon, scroll ilə xoreoqrafiya):
- `CHOREO` — hər səhifə növü (home / page) və ekran (desktop ≥1024px / mobile <1024px) üçün `hero`, `rest`, `end` pozaları:
  yer (`x`, `y`), ölçü (`size`) və şəffaflıq (`op`, tünd tema üçün `opDark`)
- `OP_SCREENS` — şəffaflığın hero → rest keçidi (ekran payı); `INTRO_SCREENS` — mövqe/ölçü keçidi
- `HIDE_RAMP` — `[data-logo-hide]` (forma) bölməsi ekrana girəndə loqonun solma sürəti
- `INTRO` — açılış animasiyası; `TRAILS` — kürələrin işıq izləri; `STUDIO` — işıq və material
- `BASE_ROT_Y`, `BASE_ROT_X` — baxış bucağı; `SWAY`, `BOB` — yavaş nəfəs hərəkəti

## Qeydlər

- glTF "Y-up" çevrilməsi (`x, y, z → x, z, -y`) səbəbindən model ixracdan əvvəl X oxu ətrafında 90° çevrilir.
  Bu sətir silinsə, loqo brauzerdə yan yatacaq.
- Əyri→mesh çevrilməsi öz UV qatını yaradır; skript onu silir ki, tekstura `TEXCOORD_0`-a düşsün.
  Əks halda ön üz qapqara görünür.
- Model teksturası ilə birlikdə ~238 KB-dır və səhifə açılanda yox, `LogoScene` qurulanda yüklənir.
