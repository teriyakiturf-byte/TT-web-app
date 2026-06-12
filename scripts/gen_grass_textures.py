#!/usr/bin/env python3
"""Generate procedural turf-texture images for the onboarding grass quiz.

These are *generated illustrations*, not photographs. They give each grass
card a believable turf look until real licensed photos are dropped in. Run:

    pip install Pillow
    python3 scripts/gen_grass_textures.py

Outputs 800x800 JPGs to public/images/grass/ matching the filenames the
onboarding photo quiz (src/app/onboarding/page.tsx) references.
"""

import math
import os
import random

from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images", "grass")
SS = 1000  # supersample resolution, downscaled to 800 for smooth edges
FINAL = 800


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def make(
    name,
    bg_top,
    bg_bot,
    blade_lo,
    blade_hi,
    n_blades,
    width_range,
    len_range,
    angle_jitter,
    seed,
):
    random.seed(seed)
    img = Image.new("RGB", (SS, SS))
    d = ImageDraw.Draw(img)

    # Vertical lighting gradient: lit canopy up top, shadowed thatch at base.
    for y in range(SS):
        d.line([(0, y), (SS, y)], fill=lerp(bg_top, bg_bot, y / SS))

    # Draw blades back-to-front so nearer (taller, brighter) ones overlap.
    blades = []
    for _ in range(n_blades):
        base_y = random.uniform(SS * 0.5, SS + 30)
        blades.append(base_y)
    blades.sort()  # lower base_y (further back) first

    for base_y in blades:
        x = random.uniform(-20, SS + 20)
        depth = max(0.0, min(1.0, (base_y - SS * 0.5) / (SS * 0.5)))  # 0 back, 1 front
        length = random.uniform(*len_range) * (0.55 + depth * 0.6)
        ang = math.radians(random.uniform(90 - angle_jitter, 90 + angle_jitter))
        w = random.uniform(*width_range) * (0.7 + depth * 0.5)
        col = lerp(blade_lo, blade_hi, random.random())
        col = tuple(int(c * (0.55 + 0.45 * depth)) for c in col)  # darken back blades
        sway = random.uniform(-0.28, 0.28)

        px, py = x, base_y
        segs = 9
        for s in range(1, segs + 1):
            t = s / segs
            ww = max(1, w * (1 - 0.85 * t))  # taper toward the tip
            cx = x + math.cos(ang) * length * t + sway * length * (t * t)
            cy = base_y - math.sin(ang) * length * t
            d.line([(px, py), (cx, cy)], fill=col, width=int(round(ww)))
            px, py = cx, cy

        if random.random() < 0.28:  # occasional sunlit tip
            d.line([(px, py), (px, py - 2)], fill=lerp(col, (255, 255, 255), 0.25), width=1)

    img = img.filter(ImageFilter.GaussianBlur(0.7))
    img = img.resize((FINAL, FINAL), Image.LANCZOS)
    os.makedirs(OUT, exist_ok=True)
    img.save(os.path.join(OUT, name), "JPEG", quality=86)
    print("wrote", name)


# Tall Fescue — broad, coarse, deep blue-green blades.
make("tall-fescue.jpg", (26, 66, 46), (12, 34, 22), (28, 78, 46), (78, 140, 84),
     2600, (3.0, 6.0), (380, 640), 14, 11)

# Kentucky Bluegrass — fine, dense, bright green.
make("kentucky-bluegrass.jpg", (40, 92, 52), (18, 48, 28), (64, 150, 78), (132, 206, 122),
     4400, (1.5, 3.0), (360, 600), 10, 23)

# Zoysia — very dense, carpet-like, lighter with a warm cast.
make("zoysia.jpg", (72, 122, 82), (40, 84, 54), (96, 156, 104), (172, 202, 140),
     5400, (2.0, 4.0), (300, 520), 8, 31)

# Mixed / Not Sure — wide variety of widths and greens.
make("mixed.jpg", (40, 86, 52), (20, 50, 30), (40, 100, 56), (152, 206, 132),
     3600, (1.5, 5.0), (320, 620), 16, 42)
