#!/bin/sh
# Organizer helper. Keeps a valid existing image and verifies the actual hidden flag.
set -eu
cd "$(dirname "$0")/.."
image=public/uploads/stego_challenge.jpg
scratch_dir=$(mktemp -d)
trap 'rm -rf "$scratch_dir"' EXIT HUP INT TERM
printf '%s\n' 'AstroSec{st3g0_s4t3ll1t3_s3cr3t}' > "$scratch_dir/hidden_flag.txt"
if [ -f "$image" ] && timeout 15s steghide extract -sf "$image" -p cosmolog -xf "$scratch_dir/existing.txt" -f >/dev/null 2>&1 && cmp -s "$scratch_dir/hidden_flag.txt" "$scratch_dir/existing.txt"; then
  echo 'Existing Challenge 3 image verified.'
  exit 0
fi
mkdir -p public/uploads
# A repeatable diagram carrier; the original JPEG is what players must download.
convert -size 1200x800 gradient:'#14243c-#547891' \
  -fill '#d7e5ed' -stroke '#d7e5ed' -strokewidth 5 \
  -draw 'rectangle 160,400 580,650' \
  -fill '#243f55' -draw 'rectangle 215,450 300,520 rectangle 350,450 435,520 rectangle 480,450 530,520' \
  -fill none -stroke '#d7e5ed' -strokewidth 12 \
  -draw 'path "M 790,380 L 790,600 M 680,330 Q 790,475 900,330 M 790,370 L 790,220 M 580,560 L 790,560"' \
  -font DejaVu-Sans -fill white -stroke none -pointsize 40 \
  -annotate +80+100 'Gorgan Solutions' -pointsize 23 \
  -annotate +80+145 'Satellite uplink facility | Sector 7' \
  -quality 94 "$scratch_dir/carrier.jpg"
timeout 30s steghide embed -cf "$scratch_dir/carrier.jpg" \
  -ef "$scratch_dir/hidden_flag.txt" -p cosmolog -sf "$scratch_dir/challenge.jpg" -f
steghide extract -sf "$scratch_dir/challenge.jpg" -p cosmolog -xf "$scratch_dir/recovered.txt" -f
cmp "$scratch_dir/hidden_flag.txt" "$scratch_dir/recovered.txt"
cp "$scratch_dir/challenge.jpg" "$image"
echo 'Challenge 3 image prepared and extraction verified.'
