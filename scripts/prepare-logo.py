"""
Prepares the brand mark from a source logo image.

    python scripts/prepare-logo.py "C:/Users/.../C logo final.jpg"

The source is a flat cyan mark on a flat dark ground, so the background is keyed
out by coverage rather than by magic wand: for every pixel we measure how far it
has travelled from the background colour toward the foreground colour, use that
as alpha, then repaint the result in the flat foreground colour. That keeps the
anti-aliased edges clean instead of leaving a dark fringe.

All the maths runs through Pillow channel ops, so no numpy is required.

Outputs (repo root, mirrored into dist/ by vite.config.js):
    logo.png             512x512 transparent - nav / general use
    favicon-32.png       browser tabs
    favicon-192.png      PWA + android
    favicon-512.png      PWA
    apple-touch-icon.png 180, iOS home screen
    favicon.svg          SVG wrapping a small PNG, so existing <link> tags keep working

Also prints the mark's accent colour so the theme can adopt it.
"""

import base64
import io
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageStat

ROOT = Path(__file__).resolve().parent.parent

source = Path(sys.argv[1]) if len(sys.argv) > 1 else None
if source is None or not source.exists():
    raise SystemExit("usage: python scripts/prepare-logo.py <source image>")

img = Image.open(source).convert("RGB")
w, h = img.size

# Smallest denominator allowed when turning a channel difference into coverage.
MIN_DENOM = 24


def const(value, size):
    return Image.new("L", size, max(0, min(255, int(round(value)))))


def percentile(channel, fraction):
    """Per-channel percentile from the 256-bin histogram."""
    hist = channel.histogram()
    target = sum(hist) * fraction
    acc = 0
    for value, count in enumerate(hist):
        acc += count
        if acc >= target:
            return value
    return 255


# --- background: median of the four corners ---
k = max(8, min(w, h) // 20)
corners = Image.new("RGB", (k * 2, k * 2))
corners.paste(img.crop((0, 0, k, k)), (0, 0))
corners.paste(img.crop((w - k, 0, w, k)), (k, 0))
corners.paste(img.crop((0, h - k, k, h)), (0, k))
corners.paste(img.crop((w - k, h - k, w, h)), (k, k))
bg = ImageStat.Stat(corners).median


def coverage(fg_triple):
    """Alpha image: per-pixel max of |channel - bg| scaled by |fg - bg|.

    Uses an absolute difference rather than a signed one because some channels
    move *down* toward the mark (this cyan's red is darker than the background's
    red). Each denominator is floored so a near-identical channel cannot amplify
    JPEG noise into full opacity.
    """
    channels = []
    for band, bg_c, fg_c in zip(img.split(), bg, fg_triple):
        delta = ImageChops.difference(band, const(bg_c, img.size))
        denom = max(abs(fg_c - bg_c), MIN_DENOM)
        channels.append(delta.point(lambda v, d=denom: min(255, int(round(v * 255.0 / d)))))
    return ImageChops.lighter(ImageChops.lighter(channels[0], channels[1]), channels[2])


# --- foreground: two passes so the flat fill colour is measured, not guessed ---
rough = [percentile(band, 0.995) for band in img.split()]
solid = coverage(rough).point(lambda v: 255 if v > 220 else 0)
solid_stat = ImageStat.Stat(img, mask=solid)
fg = solid_stat.mean if solid_stat.count[0] > 50 else [max(rough[0], 1), max(rough[1], 1), max(rough[2], 1)]

alpha = coverage(fg)

# The source is a JPEG, so the flat background carries compression noise. Left
# alone that becomes a hazy, badly-compressing alpha channel, so anything below
# the floor is forced clear and the remainder is re-expanded to full range.
FLOOR = 34
alpha = alpha.point(
    lambda v: 0 if v <= FLOOR else min(255, int(round((v - FLOOR) * 255.0 / (255 - FLOOR))))
)

flat = Image.merge(
    "RGBA",
    (
        const(fg[0], img.size),
        const(fg[1], img.size),
        const(fg[2], img.size),
        alpha,
    ),
)

# --- tight crop, then pad to a centred square ---
bbox = alpha.point(lambda v: 255 if v > 8 else 0).getbbox()
if bbox:
    flat = flat.crop(bbox)

side = max(flat.size)
pad = int(round(side * 0.07))
canvas = Image.new("RGBA", (side + pad * 2, side + pad * 2), (0, 0, 0, 0))
canvas.paste(flat, ((canvas.width - flat.width) // 2, (canvas.height - flat.height) // 2))
mark = canvas


def save(name, size):
    out = ROOT / name
    mark.resize((size, size), Image.LANCZOS).save(out, "PNG", optimize=True)
    print(f"{name:<22} {size}x{size}  {out.stat().st_size / 1024:.1f} KB")


save("logo.png", 256)
save("favicon-32.png", 32)
save("favicon-192.png", 192)
save("favicon-512.png", 512)
save("apple-touch-icon.png", 180)

# --- favicon.svg wrapping a small PNG so existing references stay valid ---
buf = io.BytesIO()
mark.resize((64, 64), Image.LANCZOS).save(buf, "PNG", optimize=True)
b64 = base64.b64encode(buf.getvalue()).decode("ascii")
svg = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">'
    f'<image width="64" height="64" href="data:image/png;base64,{b64}"/>'
    "</svg>"
)
(ROOT / "favicon.svg").write_text(svg, encoding="utf-8")
print(f"{'favicon.svg':<22} 64x64   {(ROOT / 'favicon.svg').stat().st_size / 1024:.1f} KB")

hexify = lambda c: "#{:02x}{:02x}{:02x}".format(*(max(0, min(255, int(round(v)))) for v in c))
print(f"\nbackground sampled  {hexify(bg)}")
print(f"accent extracted    {hexify(fg)}")
