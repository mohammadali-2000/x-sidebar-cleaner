#!/usr/bin/env python3
"""
Creates a clean, production-ready ZIP archive of X Sidebar Cleaner
for submission to the Google Chrome Web Store.
Ensures manifest.json is at the root and all dev files/tests are excluded.
"""

import os
import zipfile
import json

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DIST_DIR = os.path.join(ROOT_DIR, "dist")
os.makedirs(DIST_DIR, exist_ok=True)

# Read version from manifest.json
manifest_path = os.path.join(ROOT_DIR, "manifest.json")
with open(manifest_path, "r", encoding="utf-8") as f:
    manifest_data = json.load(f)

version = manifest_data.get("version", "1.0.0")
zip_filename = f"x-sidebar-cleaner-v{version}.zip"
zip_filepath = os.path.join(DIST_DIR, zip_filename)

# Files and directories required for runtime
INCLUDE_FILES = [
    "manifest.json",
    "content.js",
    "styles.css",
    "popup.html",
    "popup.css",
    "popup.js",
    "LICENSE",
]

INCLUDE_DIRS = [
    "icons",
]

print(f"📦 Packaging X Sidebar Cleaner v{version} for Chrome Web Store...")

with zipfile.ZipFile(zip_filepath, "w", zipfile.ZIP_DEFLATED) as zipf:
    # Add root files
    for filename in INCLUDE_FILES:
        full_path = os.path.join(ROOT_DIR, filename)
        if os.path.exists(full_path):
            zipf.write(full_path, arcname=filename)
            print(f"  + Added {filename}")
        else:
            print(f"  ⚠️ Warning: {filename} not found!")

    # Add directory trees
    for dirname in INCLUDE_DIRS:
        full_dir = os.path.join(ROOT_DIR, dirname)
        for root, dirs, files in os.walk(full_dir):
            for file in sorted(files):
                if file.endswith(".png"):
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path, ROOT_DIR)
                    zipf.write(full_path, arcname=rel_path)
                    print(f"  + Added {rel_path}")

print(f"\n✅ Production bundle created successfully:")
print(f"   File: {zip_filepath}")
print(f"   Size: {os.path.getsize(zip_filepath):,} bytes")
