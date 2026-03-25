#!/usr/bin/env python3
"""
Normalize Frisk app screenshots for the marketing site.

- Trims the top system/status strip (notch area) so app chrome lines up across shots.
- Center-crops to portrait aspect ratio 390:844 (matches site CSS).
- Resizes to fixed export size (default 780x1688 @2x) for consistent mockups.
- Tall sources get a centered window (marketing crop, not full scroll).

Processes every images/showcase-*.png (pain log, meal log, etc.).

Usage:
  python3 scripts/normalize_showcase_images.py
  python3 scripts/normalize_showcase_images.py --dry-run
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image

TARGET_ASPECT_W = 390
TARGET_ASPECT_H = 844
DEFAULT_EXPORT_W = 780
DEFAULT_EXPORT_H = 1688


def trim_status_bar(img: Image.Image, strip_px: int | None, strip_ratio: float) -> Image.Image:
    w, h = img.size
    if strip_px is not None:
        top = min(max(0, strip_px), h // 4)
    else:
        top = int(round(h * strip_ratio))
        top = max(48, min(top, h // 5))
    if top <= 0 or top >= h - 32:
        return img
    return img.crop((0, top, w, h))


def crop_to_aspect_center(img: Image.Image, aw: int, ah: int) -> Image.Image:
    iw, ih = img.size
    target_ar = aw / ah
    cur_ar = iw / ih
    if cur_ar > target_ar:
        nw = int(round(ih * target_ar))
        nw = min(nw, iw)
        x0 = (iw - nw) // 2
        return img.crop((x0, 0, x0 + nw, ih))
    nh = int(round(iw / target_ar))
    nh = min(nh, ih)
    y0 = (ih - nh) // 2
    return img.crop((0, y0, iw, y0 + nh))


def process_one(
    path: Path,
    out_w: int,
    out_h: int,
    strip_px: int | None,
    strip_ratio: float,
) -> Image.Image:
    im = Image.open(path)
    im = im.convert("RGBA")
    im = trim_status_bar(im, strip_px, strip_ratio)
    im = crop_to_aspect_center(im, TARGET_ASPECT_W, TARGET_ASPECT_H)
    im = im.resize((out_w, out_h), Image.Resampling.LANCZOS)
    return im.convert("RGB")


def main() -> int:
    ap = argparse.ArgumentParser(description="Normalize Frisk showcase PNGs for the website.")
    ap.add_argument("--images-dir", type=Path, default=Path("images"))
    ap.add_argument("--export-w", type=int, default=DEFAULT_EXPORT_W)
    ap.add_argument("--export-h", type=int, default=DEFAULT_EXPORT_H)
    ap.add_argument("--strip-ratio", type=float, default=0.065)
    ap.add_argument("--strip-px", type=int, default=None)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    root = args.images_dir
    if not root.is_dir():
        print(f"Not a directory: {root}", file=sys.stderr)
        return 1

    files = sorted(root.glob("showcase-*.png"))
    if not files:
        print(f"No showcase-*.png in {root}", file=sys.stderr)
        return 1

    for path in files:
        if args.dry_run:
            im = Image.open(path)
            print(f"{path.name} {im.size} -> ({args.export_w}, {args.export_h})")
            continue
        out = process_one(path, args.export_w, args.export_h, args.strip_px, args.strip_ratio)
        out.save(path, format="PNG", optimize=True)
        print(f"Wrote {path} ({args.export_w}x{args.export_h})")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
