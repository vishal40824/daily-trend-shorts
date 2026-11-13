import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FONT_PATH = os.path.join(BASE_DIR, "shorts-animator", "public", "theboldfont.ttf")
LOGO_PATH = os.path.join(BASE_DIR, "bytedispatch_logo.png")
OUTPUT_BANNER = os.path.join(BASE_DIR, "bytedispatch_banner.png")

WIDTH = 2048
HEIGHT = 1152

def create_minimalist_banner(bg_image_path=None):
    # 1. Base Canvas
    if bg_image_path and os.path.exists(bg_image_path):
        bg = Image.open(bg_image_path).convert("RGBA")
        bg = bg.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
        # Apply dark cinematic overlay
        darken = Image.new("RGBA", (WIDTH, HEIGHT), (5, 7, 15, 140))
        canvas = Image.alpha_composite(bg, darken)
    else:
        # Generate Dark Mesh Gradient with Ambient Glows
        canvas = Image.new("RGBA", (WIDTH, HEIGHT), (6, 9, 18, 255))
        draw_glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))

        # Cyan Glow (Left-Center)
        glow_cyan = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        d_cyan = ImageDraw.Draw(glow_cyan)
        d_cyan.ellipse([300, 200, 1100, 1000], fill=(6, 182, 212, 100))
        glow_cyan = glow_cyan.filter(ImageFilter.GaussianBlur(140))

        # Violet Glow (Right-Center)
        glow_violet = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        d_violet = ImageDraw.Draw(glow_violet)
        d_violet.ellipse([900, 150, 1750, 950], fill=(139, 92, 246, 90))
        glow_violet = glow_violet.filter(ImageFilter.GaussianBlur(150))

        canvas = Image.alpha_composite(canvas, glow_cyan)
        canvas = Image.alpha_composite(canvas, glow_violet)

        # Subtle Cyber Grid Overlay
        grid_overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        d_grid = ImageDraw.Draw(grid_overlay)
        step = 64
        for x in range(0, WIDTH, step):
            d_grid.line([(x, 0), (x, HEIGHT)], fill=(255, 255, 255, 6), width=1)
        for y in range(0, HEIGHT, step):
            d_grid.line([(0, y), (WIDTH, y)], fill=(255, 255, 255, 6), width=1)
        canvas = Image.alpha_composite(canvas, grid_overlay)

    # 2. Subtle Horizon / Divider Line
    line_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d_line = ImageDraw.Draw(line_layer)
    # Fading neon line through center
    for x in range(WIDTH):
        dist = abs(x - WIDTH // 2) / (WIDTH // 2)
        alpha = int(max(0, 1 - dist) * 70)
        d_line.line([(x, 576), (x + 1, 576)], fill=(56, 189, 248, alpha), width=2)
    line_layer = line_layer.filter(ImageFilter.GaussianBlur(2))
    canvas = Image.alpha_composite(canvas, line_layer)

    # 3. Safe Zone Center Composition (1235 x 338 centered at 1024, 576)
    # Left: Logo (Circular with Neon Ring), Right: Typography & Badges
    logo_size = 210
    logo_img = None
    if os.path.exists(LOGO_PATH):
        raw_logo = Image.open(LOGO_PATH).convert("RGBA")
        raw_logo = raw_logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)

        # Create Circular Mask
        mask = Image.new("L", (logo_size, logo_size), 0)
        d_mask = ImageDraw.Draw(mask)
        d_mask.ellipse((0, 0, logo_size, logo_size), fill=255)

        # Circular Logo
        logo_circ = Image.new("RGBA", (logo_size, logo_size), (0, 0, 0, 0))
        logo_circ.paste(raw_logo, (0, 0), mask=mask)

        # Neon Glow Ring around Logo
        ring_layer = Image.new("RGBA", (logo_size + 40, logo_size + 40), (0, 0, 0, 0))
        d_ring = ImageDraw.Draw(ring_layer)
        d_ring.ellipse([10, 10, logo_size + 30, logo_size + 30], outline=(0, 240, 255, 180), width=4)
        ring_glow = ring_layer.filter(ImageFilter.GaussianBlur(8))
        ring_layer = Image.alpha_composite(ring_glow, ring_layer)

    # Typography & Placement
    # Center X = 1024, Center Y = 576
    content_width = 860
    start_x = 1024 - (content_width // 2)
    logo_x = start_x
    logo_y = 576 - (logo_size // 2)

    # Paste Logo
    if logo_img is not None or os.path.exists(LOGO_PATH):
        # Ring
        canvas.paste(ring_layer, (logo_x - 20, logo_y - 20), mask=ring_layer)
        # Logo
        canvas.paste(logo_circ, (logo_x, logo_y), mask=logo_circ)

    # Text Area
    text_x = logo_x + logo_size + 50
    text_draw = ImageDraw.Draw(canvas)

    # Fonts
    font_bold_title = ImageFont.truetype(FONT_PATH, 86)
    try:
        font_tagline = ImageFont.truetype("arialbd.ttf", 26)
        font_pill = ImageFont.truetype("arial.ttf", 20)
    except:
        font_tagline = font_bold_title
        font_pill = font_bold_title

    # 1. Main Title: BYTEDISPATCH
    title_text = "BYTEDISPATCH"
    title_y = 576 - 88
    # Subtle drop shadow
    text_draw.text((text_x + 3, title_y + 4), title_text, font=font_bold_title, fill=(0, 0, 0, 180))
    # Title Text
    text_draw.text((text_x, title_y), title_text, font=font_bold_title, fill=(255, 255, 255, 255))

    # 2. Tagline
    tagline_text = "THE INTERNET, EXPLAINED IN 30 SECONDS"
    tagline_y = title_y + 92
    text_draw.text((text_x, tagline_y), tagline_text, font=font_tagline, fill=(148, 163, 184, 255))

    # 3. Badges Pill: "🔴 DAILY UPLOADS • 5:30 PM IST"
    pill_text = "● DAILY TRENDS & TECH BREAKTHROUGHS"
    pill_y = tagline_y + 42
    pill_w = 430
    pill_h = 36

    pill_bg = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d_p = ImageDraw.Draw(pill_bg)
    d_p.rounded_rectangle([text_x, pill_y, text_x + pill_w, pill_y + pill_h], radius=18, fill=(15, 23, 42, 180), outline=(56, 189, 248, 80), width=1)
    d_p.text((text_x + 18, pill_y + 7), pill_text, font=font_pill, fill=(56, 189, 248, 240))
    canvas = Image.alpha_composite(canvas, pill_bg)

    # Save
    canvas.save(OUTPUT_BANNER, "PNG")
    print(f"✅ Generated 2048x1152 Minimalist Banner: {OUTPUT_BANNER}")
    return OUTPUT_BANNER

if __name__ == "__main__":
    create_minimalist_banner()
