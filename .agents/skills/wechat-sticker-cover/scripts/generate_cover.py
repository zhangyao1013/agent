#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate WeChat Official Account sticker covers from app tab screenshots.

Outputs (default):
  - cover-sticker-1080x1440.png  (3:4, 关注的贴图 / 小绿书最佳比例)
  - cover-feed-900x383.png       (2.35:1, 订阅号头条封面)

Usage:
  python3 generate_cover.py --input-dir /path/to/pic/260524
  python3 generate_cover.py --input-dir ./pic/260524 --title "今天吃啥菜"
"""

from __future__ import annotations

import argparse
import glob
import os
import re
from datetime import datetime
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

# Brand: 抖音红 + 暖色底（活泼）
COLOR_PRIMARY = (254, 44, 85)
COLOR_PRIMARY_DARK = (224, 26, 69)
COLOR_ACCENT = (255, 102, 0)
COLOR_BG = (255, 248, 245)
COLOR_CREAM = (255, 237, 228)
COLOR_TEXT = (26, 10, 14)
COLOR_MUTED = (140, 100, 108)
COLOR_WHITE = (255, 255, 255)

STICKER_SIZE = (1080, 1440)  # 3:4
FEED_SIZE = (900, 383)       # 2.35:1

COVER_OUTPUT_NAMES = (
    "cover-sticker-1080x1440.png",
    "cover-feed-900x383.png",
)

IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp"}

# 文件名前缀 → (展示顺序, 标签)；新批次可写 screenshots.manifest.json 覆盖
TAB_CATALOG: list[tuple[str, str]] = [
    ("f0353e48", "AI 首页"),
    ("4cf73d77", "食谱心愿"),
    ("1fa833ed", "食圈动态"),
    ("ad64da3e", "菜谱管理"),
    ("75ecda13", "个人中心"),
]


def find_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = []
    if bold:
        candidates.extend([
            "/System/Library/Fonts/PingFang.ttc",
            "/System/Library/Fonts/STHeiti Medium.ttc",
            "/Library/Fonts/Arial Unicode.ttf",
        ])
    else:
        candidates.extend([
            "/System/Library/Fonts/PingFang.ttc",
            "/System/Library/Fonts/STHeiti Light.ttc",
            "/Library/Fonts/Arial Unicode.ttf",
        ])
    for path in candidates:
        if os.path.isfile(path):
            try:
                return ImageFont.truetype(path, size=size, index=0 if bold and "PingFang" in path else 0)
            except OSError:
                continue
    return ImageFont.load_default()


def rounded_rect(draw: ImageDraw.ImageDraw, xy, radius: int, fill, outline=None, width=0):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def _load_manifest(input_dir: Path) -> list[tuple[str, str]] | None:
    import json

    for name in ("screenshots.manifest.json", "manifest.json"):
        path = input_dir / name
        if path.is_file():
            data = json.loads(path.read_text(encoding="utf-8"))
            items = data.get("screenshots") or data.get("tabs") or data
            return [(str(i["file"]), str(i["label"])) for i in items]
    return None


def load_screenshots(input_dir: Path) -> list[Path]:
    manifest = _load_manifest(input_dir)
    all_files = [
        p
        for p in input_dir.iterdir()
        if p.suffix.lower() in IMAGE_EXTS and not p.name.startswith("cover-")
    ]
    if not all_files:
        raise FileNotFoundError(f"No screenshots in {input_dir}")

    if manifest:
        ordered: list[Path] = []
        for fname, _ in manifest:
            match = next((p for p in all_files if p.name == fname or fname in p.name), None)
            if match:
                ordered.append(match)
        if ordered:
            return ordered

    def sort_key(p: Path) -> int:
        for idx, (prefix, _) in enumerate(TAB_CATALOG):
            if p.name.startswith(prefix):
                return idx
        return 999

    return sorted(all_files, key=sort_key)[:6]


def fit_cover(img: Image.Image, size: tuple[int, int]) -> Image.Image:
    img = img.convert("RGBA")
    tw, th = size
    ratio = min(tw / img.width, th / img.height)
    nw, nh = int(img.width * ratio), int(img.height * ratio)
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    canvas.paste(resized, ((tw - nw) // 2, (th - nh) // 2))
    return canvas


def add_phone_frame(thumb: Image.Image, pad: int = 10) -> Image.Image:
    w, h = thumb.size
    fw, fh = w + pad * 2, h + pad * 2 + 8
    frame = Image.new("RGBA", (fw, fh), (0, 0, 0, 0))
    shadow = Image.new("RGBA", (fw, fh), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((pad + 4, pad + 10, fw - pad, fh - pad + 2), radius=28, fill=(0, 0, 0, 55))
    shadow = shadow.filter(ImageFilter.GaussianBlur(12))
    frame.alpha_composite(shadow)
    body = Image.new("RGBA", (fw, fh), (0, 0, 0, 0))
    bd = ImageDraw.Draw(body)
    bd.rounded_rectangle((0, 0, fw - 1, fh - 9), radius=32, fill=COLOR_WHITE)
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w, h), radius=24, fill=255)
    body.paste(thumb.convert("RGBA"), (pad, pad), mask)
    frame.alpha_composite(body)
    return frame


def draw_gradient_header(canvas: Image.Image, height: int, title: str, subtitle: str, date_str: str):
    w, _ = canvas.size
    grad = Image.new("RGB", (w, height))
    gd = ImageDraw.Draw(grad)
    for y in range(height):
        t = y / max(height - 1, 1)
        r = int(COLOR_PRIMARY[0] * (1 - t * 0.15) + COLOR_ACCENT[0] * t * 0.35)
        g = int(COLOR_PRIMARY[1] * (1 - t * 0.2) + COLOR_ACCENT[1] * t * 0.25)
        b = int(COLOR_PRIMARY[2] * (1 - t * 0.1))
        gd.line([(0, y), (w, y)], fill=(r, g, b))
    canvas.paste(grad, (0, 0))

    draw = ImageDraw.Draw(canvas)
    font_title = find_font(52, bold=True)
    font_sub = find_font(28)
    font_date = find_font(22)

    draw.text((48, 42), title, fill=COLOR_WHITE, font=font_title)
    draw.text((48, 108), subtitle, fill=(255, 230, 235), font=font_sub)
    tw = draw.textlength(date_str, font=font_date)
    rounded_rect(draw, (w - tw - 72, 44, w - 36, 88), 20, fill=(255, 255, 255, 40))
    draw.text((w - tw - 54, 52), date_str, fill=COLOR_WHITE, font=font_date)


def summarize_tabs(paths: list[Path]) -> list[str]:
    manifest = None
    input_dir = paths[0].parent if paths else Path(".")
    raw = _load_manifest(input_dir)
    if raw:
        manifest = {fname: label for fname, label in raw}

    labels: list[str] = []
    for p in paths:
        if manifest:
            label = next((v for k, v in manifest.items() if k in p.name), None)
            if label:
                labels.append(label)
                continue
        matched = next((lbl for pre, lbl in TAB_CATALOG if p.name.startswith(pre)), None)
        labels.append(matched or p.stem[:8])
    return labels


def build_sticker_cover(
    screenshots: list[Path],
    title: str,
    subtitle: str,
    bullets: list[str],
) -> Image.Image:
    w, h = STICKER_SIZE
    canvas = Image.new("RGB", STICKER_SIZE, COLOR_BG)
    header_h = 200
    draw_gradient_header(canvas, header_h, title, subtitle, datetime.now().strftime("%Y年%m月%d日"))

    draw = ImageDraw.Draw(canvas)
    font_bullet = find_font(26)
    font_label = find_font(20, bold=True)

    # Soft clay blobs (style ref: 图二暖色 3D 感)
    blob = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    bd = ImageDraw.Draw(blob)
    bd.ellipse((-80, 280, 220, 520), fill=(*COLOR_CREAM, 180))
    bd.ellipse((820, 900, 1120, 1280), fill=(*COLOR_PRIMARY[:3], 35))
    blob = blob.filter(ImageFilter.GaussianBlur(40))
    canvas.paste(blob, (0, 0), blob)

    labels = summarize_tabs(screenshots)
    thumbs = []
    for p in screenshots[:4]:
        im = Image.open(p).convert("RGB")
        thumbs.append(add_phone_frame(fit_cover(im, (200, 360))))

    # 2x2 grid of phones
    positions = [(48, 220), (280, 240), (512, 220), (744, 240)]
    for thumb, label, (x, y) in zip(thumbs, labels, positions):
        canvas.paste(thumb, (x, y), thumb)
        tw = draw.textlength(label, font=font_label)
        draw.text((x + (thumb.width - tw) // 2, y + thumb.height + 8), label, fill=COLOR_MUTED, font=font_label)

    # Summary panel (news-card style like 图一左卡)
    panel_y = 680
    rounded_rect(draw, (48, panel_y, w - 48, h - 80), 36, fill=COLOR_WHITE, outline=COLOR_CREAM, width=3)
    draw.text((80, panel_y + 36), "本期功能一览", fill=COLOR_PRIMARY_DARK, font=find_font(34, bold=True))

    y = panel_y + 100
    for i, line in enumerate(bullets):
        dot_color = COLOR_PRIMARY if i == 0 else COLOR_ACCENT
        draw.ellipse((88, y + 8, 108, y + 28), fill=dot_color)
        draw.text((124, y), line, fill=COLOR_TEXT, font=font_bullet)
        y += 52

    # Footer tag
    tag = "今天吃啥菜 · v1.0"
    rounded_rect(draw, (80, h - 130, 80 + draw.textlength(tag, font=font_label) + 40, h - 78), 18, fill=COLOR_PRIMARY)
    draw.text((100, h - 118), tag, fill=COLOR_WHITE, font=font_label)

    return canvas


def build_feed_cover(
    screenshots: list[Path],
    title: str,
    subtitle: str,
) -> Image.Image:
    w, h = FEED_SIZE
    canvas = Image.new("RGB", FEED_SIZE, COLOR_BG)
    draw_gradient_header(canvas, h, title, subtitle[:20] + "…" if len(subtitle) > 20 else subtitle, "")

    draw = ImageDraw.Draw(canvas)
    font_title = find_font(36, bold=True)
    draw.text((40, 28), title, fill=COLOR_WHITE, font=font_title)
    draw.text((40, 78), subtitle, fill=(255, 230, 235), font=find_font(20))

    strip_x = 420
    for i, p in enumerate(screenshots[:3]):
        im = Image.open(p).convert("RGB")
        thumb = add_phone_frame(fit_cover(im, (140, 250)))
        canvas.paste(thumb, (strip_x + i * 155, 60), thumb)

    return canvas


def main():
    parser = argparse.ArgumentParser(description="Generate WeChat sticker covers from app screenshots")
    parser.add_argument("--input-dir", "-i", required=True, help="Directory with tab screenshots (e.g. pic/260524)")
    parser.add_argument("--title", "-t", default="今天吃啥菜", help="App / cover title")
    parser.add_argument("--subtitle", "-s", default="AI 生成菜谱 · 食材识菜 · 食圈分享", help="One-line summary")
    parser.add_argument("--output-dir", "-o", default=None, help="Output directory (default: same as input)")
    args = parser.parse_args()

    input_dir = Path(args.input_dir).expanduser().resolve()
    output_dir = Path(args.output_dir or input_dir).expanduser().resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    shots = load_screenshots(input_dir)
    bullets = [
        "首页：输入菜名 AI 生成漫画风菜谱图",
        "食材荐菜：拍照识别食材智能配餐",
        "心愿单：收藏想做的菜，一键查看详情",
        "食圈：浏览他人作品，点赞加入心愿",
        "菜谱管理：历史生成记录，随时再生成",
    ]

    sticker = build_sticker_cover(shots, args.title, args.subtitle, bullets)
    feed = build_feed_cover(shots, args.title, args.subtitle)

    out_sticker = output_dir / COVER_OUTPUT_NAMES[0]
    out_feed = output_dir / COVER_OUTPUT_NAMES[1]
    sticker.save(out_sticker, "PNG", optimize=True)
    feed.save(out_feed, "PNG", optimize=True)

    print(f"✓ Sticker cover (3:4):  {out_sticker}")
    print(f"✓ Feed cover (2.35:1): {out_feed}")
    print(f"  Source screenshots: {len(shots)} files from {input_dir}")


if __name__ == "__main__":
    main()
