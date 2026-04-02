@echo off
echo Converting images in %cd% to WebP with -q 82 -m 6...

for %%f in (*.jpg *.jpeg *.png *.bmp *.tiff *.tif *.gif*.webp) do (
    echo Converting %%f ...
    cwebp -q 75 -m 6 "%%f" -o "%%~nf.webp"
)

echo Done.
pause