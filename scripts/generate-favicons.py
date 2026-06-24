"""Generate favicon, web logo, and OG image from src/assets/kairos_logo.png (master)."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src" / "assets"
MASTER = SRC / "kairos_logo.png"
# Match src/assets/kairos-tokens.css — light theme site background
PAPER = (251, 249, 243)  # --paper #FBF9F3
NAVY = (24, 52, 92)  # --navy #18345C (tagline on paper)
OG_TAGLINE = "Boutique College Admissions Consulting"

FAVICON_PNG_SIZE = 48
APPLE_TOUCH_SIZE = 180


def crop_icon_mark(img: Image.Image) -> Image.Image:
    """Symbol only — crop above the gap between mark and Kairos wordmark."""
    w, h = img.size
    alpha = img.split()[3]

    def row_alpha(y: int) -> float:
        return sum(alpha.getpixel((x, y)) for x in range(0, w, 4)) / (w // 4)

    gap_start = None
    in_gap = False
    for y in range(h // 3, int(h * 0.85)):
        if row_alpha(y) < 5:
            if not in_gap:
                gap_start = y
                in_gap = True
        elif in_gap and gap_start is not None:
            break
        else:
            in_gap = False

    bottom = gap_start if gap_start is not None else int(h * 0.65)
    mark = img.crop((0, 0, w, bottom))
    bb = mark.split()[3].getbbox()
    if not bb:
        return img

    x0, y0, x1, y1 = bb
    side = max(x1 - x0, y1 - y0)
    cx, cy = (x0 + x1) // 2, (y0 + y1) // 2
    return img.crop(
        (
            max(0, cx - side // 2),
            max(0, cy - side // 2),
            min(w, cx + side // 2),
            min(h, cy + side // 2),
        )
    )


def write_web_logo(img: Image.Image) -> None:
    out = SRC / "kairos_logo-web.png"
    resized = img.resize((512, 512), Image.LANCZOS)
    resized.save(out, format="PNG", optimize=True)
    print(f"wrote {out.name} ({out.stat().st_size} bytes, 512x512)")


def _og_font(size: int):
    candidates = [
        Path("C:/Windows/Fonts/arial.ttf"),
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
        Path("/System/Library/Fonts/Supplemental/Arial.ttf"),
    ]
    for path in candidates:
        if path.is_file():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def write_og_image(img: Image.Image) -> None:
    og_w, og_h = 1200, 630
    canvas = Image.new("RGB", (og_w, og_h), PAPER)
    draw = ImageDraw.Draw(canvas)

    # Soft top highlight — index landing radial-gradient feel
    for y in range(int(og_h * 0.45)):
        t = 1 - y / (og_h * 0.45)
        blend = int(255 * t * 0.35)
        row_color = (
            min(255, PAPER[0] + blend),
            min(255, PAPER[1] + blend),
            min(255, PAPER[2] + blend),
        )
        draw.line([(0, y), (og_w, y)], fill=row_color)

    max_h = int(og_h * 0.52)
    scale = max_h / img.height
    size = (int(img.width * scale), int(img.height * scale))
    logo = img.resize(size, Image.LANCZOS)
    logo_x = (og_w - size[0]) // 2
    logo_y = int(og_h * 0.14)
    canvas.paste(logo, (logo_x, logo_y), logo if logo.mode == "RGBA" else None)

    font = _og_font(34)
    tagline_bbox = draw.textbbox((0, 0), OG_TAGLINE, font=font)
    tagline_w = tagline_bbox[2] - tagline_bbox[0]
    tagline_x = (og_w - tagline_w) // 2
    tagline_y = int(og_h * 0.82)
    draw.text((tagline_x, tagline_y), OG_TAGLINE, fill=NAVY, font=font)

    out = SRC / "og-image.png"
    canvas.save(out, format="PNG", optimize=True)
    print(f"wrote {out.name} ({out.stat().st_size} bytes, {og_w}x{og_h})")


def main() -> None:
    img = Image.open(MASTER).convert("RGBA")
    mark = crop_icon_mark(img)

    favicon_png = SRC / "favicon-48x48.png"
    favicon_png_resized = mark.resize((FAVICON_PNG_SIZE, FAVICON_PNG_SIZE), Image.LANCZOS)
    favicon_png_resized.save(favicon_png, format="PNG", optimize=True)
    print(
        f"wrote {favicon_png.name} ({favicon_png.stat().st_size} bytes, "
        f"{FAVICON_PNG_SIZE}x{FAVICON_PNG_SIZE}, mark only)"
    )

    apple = SRC / "apple-touch-icon.png"
    apple_resized = img.resize((APPLE_TOUCH_SIZE, APPLE_TOUCH_SIZE), Image.LANCZOS)
    apple_resized.save(apple, format="PNG", optimize=True)
    print(f"wrote {apple.name} ({apple.stat().st_size} bytes, {APPLE_TOUCH_SIZE}x{APPLE_TOUCH_SIZE})")

    ico = SRC / "favicon.ico"
    mark.save(ico, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print(f"wrote {ico.name} ({ico.stat().st_size} bytes, mark only)")

    write_web_logo(img)
    write_og_image(img)


if __name__ == "__main__":
    main()
