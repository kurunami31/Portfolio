"""
Prepares the portrait asset from the source headshot.

    python scripts/prepare-portrait.py "C:/Users/.../Formal Attire.jpg"

Outputs (repo root, mirrored into dist/ by vite.config.js):
    christopher.webp  - 600x600, used by the landing card, the About section and the CV

The source is already square, so this is a straight downscale.
"""

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent

source = Path(sys.argv[1]) if len(sys.argv) > 1 else None
if source is None or not source.exists():
    raise SystemExit("usage: python scripts/prepare-portrait.py <source.jpg>")

image = Image.open(source).convert("RGB")

# Square-crop from the centre so a non-square source still behaves.
side = min(image.size)
left = (image.width - side) // 2
top = (image.height - side) // 2
image = image.crop((left, top, left + side, top + side))

out = ROOT / "christopher.webp"
image.resize((600, 600), Image.LANCZOS).save(out, "WEBP", quality=82, method=6)
print(f"{out.name:<20} 600x600   {out.stat().st_size / 1024:.1f} KB")
