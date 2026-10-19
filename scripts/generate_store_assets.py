#!/usr/bin/env python3
"""
Generate official Chrome Web Store promotional and screenshot assets for X Sidebar Cleaner.
Resolutions adhere strictly to Google Chrome Web Store Developer requirements:
- Store Screenshot 1: 1280x800
- Store Screenshot 2: 1280x800
- Small Promo Tile: 440x280
- Marquee Promo Tile: 1400x560
"""

import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "promo"))
os.makedirs(OUTPUT_DIR, exist_ok=True)

FONT_PATH = "/System/Library/Fonts/Supplemental/Arial.ttf"
if not os.path.exists(FONT_PATH):
    FONT_PATH = "/System/Library/Fonts/Helvetica.ttc"

def get_font(size, bold=False):
    try:
        return ImageFont.truetype(FONT_PATH, size)
    except Exception:
        return ImageFont.load_default()

def draw_rounded_rect(draw, bbox, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)

def generate_screenshot_1():
    """Screenshot 1 (1280x800): Main Before/After & Value Proposition"""
    width, height = 1280, 800
    img = Image.new("RGBA", (width, height), (10, 14, 20, 255))
    draw = ImageDraw.Draw(img)

    # Subtle background gradient/glow
    glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse([width - 400, -100, width + 300, 500], fill=(29, 155, 240, 25))
    glow_draw.ellipse([-100, height - 300, 500, height + 200], fill=(0, 186, 124, 20))
    glow = glow.filter(ImageFilter.GaussianBlur(80))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    # Top Header Banner
    font_badge = get_font(14)
    draw_rounded_rect(draw, (60, 45, 250, 75), radius=15, fill=(21, 32, 43, 255), outline=(29, 155, 240, 180), width=1)
    draw.text((80, 52), "MANIFEST V3 EXTENSION", font=font_badge, fill=(29, 155, 240, 255))

    font_title = get_font(38)
    draw.text((60, 90), "X Sidebar Cleaner", font=font_title, fill=(255, 255, 255, 255))

    font_sub = get_font(18)
    draw.text((60, 140), "Eliminate trending clutter and sponsored ads while keeping recommendations intact.", font=font_sub, fill=(148, 163, 184, 255))

    # Left Container: "Before" (With Trending Clutter)
    card1_x1, card1_y1, card1_x2, card1_y2 = 60, 200, 600, 730
    draw_rounded_rect(draw, (card1_x1, card1_y1, card1_x2, card1_y2), radius=16, fill=(15, 20, 25, 255), outline=(239, 68, 68, 120), width=2)

    # Before Tag
    draw_rounded_rect(draw, (card1_x1 + 20, card1_y1 + 16, card1_x1 + 150, card1_y1 + 44), radius=8, fill=(239, 68, 68, 40), outline=(239, 68, 68, 200))
    draw.text((card1_x1 + 35, card1_y1 + 22), "BEFORE: Default X", font=get_font(12), fill=(248, 113, 113, 255))

    # Simulated Cluttered Sidebar Items
    draw_rounded_rect(draw, (card1_x1 + 20, card1_y1 + 60, card1_x2 - 20, card1_y1 + 190), radius=12, fill=(22, 24, 28, 255), outline=(38, 44, 52, 255))
    draw.text((card1_x1 + 35, card1_y1 + 75), "Who to follow", font=get_font(17), fill=(231, 233, 234, 255))
    draw.text((card1_x1 + 35, card1_y1 + 110), "• Lilian Weng  @lilianweng", font=get_font(14), fill=(148, 163, 184, 255))
    draw.text((card1_x1 + 35, card1_y1 + 145), "• François Chollet  @fchollet", font=get_font(14), fill=(148, 163, 184, 255))

    # The unwanted "What's happening" card with red strike highlight
    draw_rounded_rect(draw, (card1_x1 + 20, card1_y1 + 210, card1_x2 - 20, card1_y2 - 25), radius=12, fill=(28, 20, 22, 255), outline=(239, 68, 68, 200), width=2)
    draw.text((card1_x1 + 35, card1_y1 + 225), "What's happening (Distraction)", font=get_font(17), fill=(248, 113, 113, 255))
    draw.text((card1_x1 + 35, card1_y1 + 265), "Promoted Bank • 7% Interest", font=get_font(13), fill=(248, 113, 113, 180))
    draw.text((card1_x1 + 35, card1_y1 + 295), "#Ranbirkapoor • Trending", font=get_font(14), fill=(231, 233, 234, 200))
    draw.text((card1_x1 + 35, card1_y1 + 330), "#14YearsOfAliaBhatt • Trending", font=get_font(14), fill=(231, 233, 234, 200))
    draw.text((card1_x1 + 35, card1_y1 + 365), "#Nazriya • Trending", font=get_font(14), fill=(231, 233, 234, 200))
    draw.text((card1_x1 + 35, card1_y1 + 400), "Show more...", font=get_font(14), fill=(29, 155, 240, 200))

    # Cross out line over the trending card
    draw.line((card1_x1 + 30, card1_y1 + 220, card1_x2 - 30, card1_y2 - 35), fill=(239, 68, 68, 220), width=3)

    # Right Container: "After" (Clean & Preserved)
    card2_x1, card2_y1, card2_x2, card2_y2 = 680, 200, 1220, 730
    draw_rounded_rect(draw, (card2_x1, card2_y1, card2_x2, card2_y2), radius=16, fill=(15, 20, 25, 255), outline=(0, 186, 124, 180), width=2)

    # After Tag
    draw_rounded_rect(draw, (card2_x1 + 20, card2_y1 + 16, card2_x1 + 200, card2_y1 + 44), radius=8, fill=(0, 186, 124, 40), outline=(0, 186, 124, 200))
    draw.text((card2_x1 + 35, card2_y1 + 22), "AFTER: X Sidebar Cleaner", font=get_font(12), fill=(52, 211, 153, 255))

    # Intact Who to Follow
    draw_rounded_rect(draw, (card2_x1 + 20, card2_y1 + 60, card2_x2 - 20, card2_y1 + 210), radius=12, fill=(22, 24, 28, 255), outline=(0, 186, 124, 120))
    draw.text((card2_x1 + 35, card2_y1 + 75), "Who to follow (PRESERVED)", font=get_font(17), fill=(52, 211, 153, 255))
    draw.text((card2_x1 + 35, card2_y1 + 115), "• Lilian Weng  @lilianweng          [Follow]", font=get_font(14), fill=(255, 255, 255, 255))
    draw.text((card2_x1 + 35, card2_y1 + 155), "• François Chollet  @fchollet    [Follow]", font=get_font(14), fill=(255, 255, 255, 255))

    # Clean Space Callout
    draw_rounded_rect(draw, (card2_x1 + 20, card2_y1 + 240, card2_x2 - 20, card2_y2 - 25), radius=12, fill=(18, 26, 36, 255), outline=(29, 155, 240, 120))
    draw.text((card2_x1 + 35, card2_y1 + 270), "Distraction-Free Focus Space", font=get_font(18), fill=(29, 155, 240, 255))
    draw.text((card2_x1 + 35, card2_y1 + 310), "✓ 'What's happening' section removed completely", font=get_font(14), fill=(231, 233, 234, 255))
    draw.text((card2_x1 + 35, card2_y1 + 345), "✓ Promoted advertisements blocked", font=get_font(14), fill=(231, 233, 234, 255))
    draw.text((card2_x1 + 35, card2_y1 + 380), "✓ Main feed & search bar remain 100% usable", font=get_font(14), fill=(231, 233, 234, 255))
    draw.text((card2_x1 + 35, card2_y1 + 415), "✓ Zero layout shift or flashing on page load", font=get_font(14), fill=(231, 233, 234, 255))

    img.save(os.path.join(OUTPUT_DIR, "store-screenshot-1.png"))
    print("Created store-screenshot-1.png (1280x800)")

def generate_screenshot_2():
    """Screenshot 2 (1280x800): Interactive Popup & Privacy First"""
    width, height = 1280, 800
    img = Image.new("RGBA", (width, height), (10, 14, 20, 255))

    glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse([200, 100, 1100, 700], fill=(29, 155, 240, 20))
    glow = glow.filter(ImageFilter.GaussianBlur(100))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    # Heading
    draw.text((60, 50), "Instant Control & Complete Privacy", font=get_font(36), fill=(255, 255, 255, 255))
    draw.text((60, 100), "Toggle cleaning anytime from the toolbar. No server, no telemetry, no tracking.", font=get_font(18), fill=(148, 163, 184, 255))

    # Center: Mockup of the Extension Popup
    pop_x1, pop_y1, pop_x2, pop_y2 = 140, 170, 560, 690
    draw_rounded_rect(draw, (pop_x1, pop_y1, pop_x2, pop_y2), radius=16, fill=(15, 20, 25, 255), outline=(56, 189, 248, 120), width=2)

    # Popup Header
    draw.text((pop_x1 + 30, pop_y1 + 25), "X Sidebar Cleaner", font=get_font(20), fill=(255, 255, 255, 255))
    draw_rounded_rect(draw, (pop_x2 - 90, pop_y1 + 24, pop_x2 - 30, pop_y1 + 48), radius=6, fill=(29, 155, 240, 30))
    draw.text((pop_x2 - 82, pop_y1 + 28), "v1.0.0", font=get_font(12), fill=(56, 189, 248, 255))

    # Toggle Row
    draw_rounded_rect(draw, (pop_x1 + 20, pop_y1 + 80, pop_x2 - 20, pop_y1 + 170), radius=12, fill=(22, 24, 28, 255), outline=(47, 51, 54, 255))
    draw.text((pop_x1 + 35, pop_y1 + 95), "Block \"What's happening\"", font=get_font(15), fill=(255, 255, 255, 255))
    draw_rounded_rect(draw, (pop_x1 + 35, pop_y1 + 125, pop_x1 + 100, pop_y1 + 150), radius=6, fill=(0, 186, 124, 30))
    draw.text((pop_x1 + 45, pop_y1 + 130), "ACTIVE", font=get_font(12), fill=(0, 186, 124, 255))

    # Toggle Switch graphic
    sw_x1, sw_y1, sw_x2, sw_y2 = pop_x2 - 80, pop_y1 + 105, pop_x2 - 35, pop_y1 + 135
    draw_rounded_rect(draw, (sw_x1, sw_y1, sw_x2, sw_y2), radius=15, fill=(29, 155, 240, 255))
    draw.ellipse([sw_x2 - 26, sw_y1 + 2, sw_x2 - 2, sw_y2 - 2], fill=(255, 255, 255, 255))

    # Scope List
    draw_rounded_rect(draw, (pop_x1 + 20, pop_y1 + 190, pop_x2 - 20, pop_y1 + 330), radius=12, fill=(22, 24, 28, 255))
    draw.text((pop_x1 + 35, pop_y1 + 205), "Scope & Guarantees", font=get_font(14), fill=(148, 163, 184, 255))
    draw.text((pop_x1 + 35, pop_y1 + 240), "✕ Hides trending & sponsored tags", font=get_font(13), fill=(248, 113, 113, 255))
    draw.text((pop_x1 + 35, pop_y1 + 280), "✓ Keeps 'Who to follow' intact", font=get_font(13), fill=(52, 211, 153, 255))

    # Privacy Box
    draw_rounded_rect(draw, (pop_x1 + 20, pop_y1 + 350, pop_x2 - 20, pop_y1 + 460), radius=12, fill=(21, 32, 43, 255), outline=(29, 155, 240, 100))
    draw.text((pop_x1 + 35, pop_y1 + 365), "Privacy First Guarantee", font=get_font(14), fill=(29, 155, 240, 255))
    draw.text((pop_x1 + 35, pop_y1 + 395), "100% Client-Side. No telemetry,\nno analytics, no network calls.", font=get_font(12), fill=(148, 163, 184, 255))

    # Right side: Feature Cards
    feats = [
        ("Zero Flash of Unstyled Content", "CSS injected at document_start eliminates flickering before the page renders."),
        ("Dynamic Navigation Support", "Listens for SPA route transitions and changes without requiring tab reloads."),
        ("Strict Permissions Hygiene", "Only requests 'storage' to remember whether the switch is ON or OFF."),
        ("Cross-Browser Compatible", "Runs smoothly in Google Chrome, Microsoft Edge, Brave, and other Chromium browsers.")
    ]

    for idx, (ftitle, fdesc) in enumerate(feats):
        fy = 170 + idx * 130
        draw_rounded_rect(draw, (620, fy, 1220, fy + 110), radius=14, fill=(15, 20, 25, 255), outline=(38, 44, 52, 255))
        draw.text((645, fy + 20), ftitle, font=get_font(18), fill=(255, 255, 255, 255))
        draw.text((645, fy + 55), fdesc, font=get_font(14), fill=(148, 163, 184, 255))

    img.save(os.path.join(OUTPUT_DIR, "store-screenshot-2.png"))
    print("Created store-screenshot-2.png (1280x800)")

def generate_small_promo():
    """Small Promo Tile (440x280)"""
    width, height = 440, 280
    img = Image.new("RGBA", (width, height), (10, 14, 20, 255))

    glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse([width - 150, -50, width + 50, 150], fill=(29, 155, 240, 40))
    glow_draw.ellipse([-50, height - 100, 150, height + 100], fill=(0, 186, 124, 30))
    glow = glow.filter(ImageFilter.GaussianBlur(40))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    # Border
    draw_rounded_rect(draw, (2, 2, width - 2, height - 2), radius=10, fill=None, outline=(38, 44, 52, 255), width=2)

    # Icon
    icon_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "icons", "icon-128.png"))
    if os.path.exists(icon_path):
        icon = Image.open(icon_path).resize((64, 64), Image.Resampling.LANCZOS)
        img.paste(icon, (35, 35), icon)

    draw.text((115, 42), "X Sidebar Cleaner", font=get_font(20), fill=(255, 255, 255, 255))
    draw.text((115, 72), "Distraction-Free Feed", font=get_font(13), fill=(29, 155, 240, 255))

    draw_rounded_rect(draw, (35, 125, width - 35, 235), radius=10, fill=(15, 20, 25, 255), outline=(38, 44, 52, 255))
    draw.text((50, 140), "✓ Removes 'What's happening' & Ads", font=get_font(13), fill=(231, 233, 234, 255))
    draw.text((50, 170), "✓ Keeps 'Who to follow' Intact", font=get_font(13), fill=(52, 211, 153, 255))
    draw.text((50, 200), "✓ 100% Private & Open Source", font=get_font(13), fill=(148, 163, 184, 255))

    img.save(os.path.join(OUTPUT_DIR, "small-promo-440x280.png"))
    print("Created small-promo-440x280.png (440x280)")

def generate_marquee_promo():
    """Marquee Promo Tile (1400x560)"""
    width, height = 1400, 560
    img = Image.new("RGBA", (width, height), (10, 14, 20, 255))

    glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse([width - 400, -100, width + 100, 400], fill=(29, 155, 240, 35))
    glow_draw.ellipse([100, 200, 700, height + 200], fill=(0, 186, 124, 25))
    glow = glow.filter(ImageFilter.GaussianBlur(80))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    # Icon
    icon_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "icons", "icon-128.png"))
    if os.path.exists(icon_path):
        icon = Image.open(icon_path).resize((96, 96), Image.Resampling.LANCZOS)
        img.paste(icon, (80, 80), icon)

    draw.text((200, 85), "X Sidebar Cleaner", font=get_font(42), fill=(255, 255, 255, 255))
    draw.text((200, 145), "Clean up your X (Twitter) experience without losing who to follow.", font=get_font(20), fill=(148, 163, 184, 255))

    cards = [
        ("Hide 'What's happening'", "Blocks trending hashtags, promoted tags, and sponsored noise instantly."),
        ("Preserve Recommendations", "'Who to follow' and the primary timeline remain 100% visible and functional."),
        ("Zero Telemetry & 100% Private", "No remote servers, no user tracking. Uses Manifest V3 minimal permissions.")
    ]

    for i, (title, sub) in enumerate(cards):
        cx1 = 80 + i * 420
        cx2 = cx1 + 390
        draw_rounded_rect(draw, (cx1, 230, cx2, 480), radius=16, fill=(15, 20, 25, 255), outline=(38, 44, 52, 255))
        draw.text((cx1 + 25, 260), title, font=get_font(18), fill=(29, 155, 240, 255))
        draw.text((cx1 + 25, 310), sub, font=get_font(15), fill=(231, 233, 234, 255))

    img.save(os.path.join(OUTPUT_DIR, "marquee-promo-1400x560.png"))
    print("Created marquee-promo-1400x560.png (1400x560)")

if __name__ == "__main__":
    generate_screenshot_1()
    generate_screenshot_2()
    generate_small_promo()
    generate_marquee_promo()
    print("All Chrome Web Store graphics generated successfully in promo/")
