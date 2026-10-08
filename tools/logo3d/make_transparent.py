"""Qara fonlu JPEG loqodan şəffaf PNG-lər: tam loqo + yalnız mark.
Mark daxilindəki qara xətlər itməsin deyə alfa kimi traced siluet istifadə olunur."""
import json
import os
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.normpath(os.path.join(HERE, "..", ".."))
SRC = os.path.join(HERE, "assets", "logo-source.jpeg")
OUT_FULL = os.path.join(REPO, "public", "brand", "logo-full.png")
OUT_MARK = os.path.join(REPO, "public", "brand", "logo-mark.png")

data = json.load(open(os.path.join(HERE, "mark.json"), encoding="utf-8"))
cx0, cy0, cx1, cy1 = data["crop"]
body = data["body"]

im = Image.open(SRC).convert("RGB")
a = np.asarray(im).astype(np.uint8)
Himg, Wimg = a.shape[:2]
lum = a.max(axis=2)

# 1) wordmark üçün: parlaqlıqdan alfa
alpha = np.clip(lum.astype(np.int16) * 1.35, 0, 255).astype(np.uint8)

# 2) mark üçün: siluet maskası (qara xətlər də daxil)
mask_img = Image.new("L", (cx1 - cx0, cy1 - cy0), 0)
from PIL import ImageDraw
ImageDraw.Draw(mask_img).polygon([(float(x), float(y)) for x, y in body], fill=255)
mask = np.asarray(mask_img)
region = alpha[cy0:cy1, cx0:cx1]
alpha[cy0:cy1, cx0:cx1] = np.maximum(region, mask)

rgba = np.dstack([a, alpha])
out = Image.fromarray(rgba, "RGBA")

# kənarları kəs
bbox = out.getbbox()
full = out.crop(bbox)
full.save(OUT_FULL)

mark = out.crop((cx0, cy0, cx1, cy1))
mark.save(OUT_MARK)
print("full", full.size, "mark", mark.size)
