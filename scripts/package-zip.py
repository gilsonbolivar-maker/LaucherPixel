#!/usr/bin/env python3
import os
import zipfile

OUTPUT_ZIP = os.path.abspath('public/pixel-nexo-launcher.zip')
ROOT_DIR = os.path.abspath('.')

EXCLUDE_DIRS = {
    'node_modules',
    '.git',
    'dist',
    '.cache',
    '.npm',
}

EXCLUDE_FILES = {
    'pixel-nexo-launcher.zip',
}

print(f"Creating zip archive at: {OUTPUT_ZIP}")

with zipfile.ZipFile(OUTPUT_ZIP, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(ROOT_DIR):
        # Modify dirs in-place to skip excluded directories
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]
        
        for file in files:
            if file in EXCLUDE_FILES:
                continue
            if file.endswith('.zip') or file.endswith('.pyc'):
                continue
            if file.startswith('.'):
                continue
            
            full_path = os.path.join(root, file)
            # Relative path inside the zip file under folder "pixel-nexo-launcher/"
            rel_path = os.path.relpath(full_path, ROOT_DIR)
            arcname = os.path.join('pixel-nexo-launcher', rel_path)
            
            zipf.write(full_path, arcname)

size_mb = os.path.getsize(OUTPUT_ZIP) / (1024 * 1024)
print(f"Zip archive created successfully! Size: {size_mb:.2f} MB")
