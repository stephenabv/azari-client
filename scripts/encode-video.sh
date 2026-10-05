#!/usr/bin/env bash
#
# Re-encodes background videos for the web: VP9 WebM (served first) plus an
# H.264 MP4 fallback, scaled to at most 720p, at a bitrate chosen to land
# under a target file size, and a WebP poster of the first frame (shown before
# the video starts and instead of it when motion is off). Originals are never
# modified; outputs go to a separate directory.
#
#   scripts/encode-video.sh                          # all site videos
#   scripts/encode-video.sh in.mp4 out/name [opts]   # one video
#
# Options (single-video mode):
#   --target-kb N    size budget per output file (default 600)
#   --max-seconds N  keep only the first N seconds (default: whole video)
#   --height N       output height in pixels (default 720)
#   --fps N          output frame rate (default 30)
#
# Requires ffmpeg with libvpx-vp9, libx264 and libwebp.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="$ROOT/src/assets/videos"
OUT_DIR="$SRC_DIR/web"

die() { echo "encode-video: $*" >&2; exit 1; }

command -v ffmpeg >/dev/null || die "ffmpeg not found"
command -v ffprobe >/dev/null || die "ffprobe not found"
encoders="$(ffmpeg -hide_banner -encoders 2>/dev/null)"
for enc in libvpx-vp9 libx264 libwebp; do
  grep -q " $enc " <<<"$encoders" || die "ffmpeg lacks $enc"
done

# encode <input> <output-base> <target-kb> <max-seconds|""> <height> <fps>
encode() {
  local input="$1" base="$2" target_kb="$3" max_seconds="$4" height="$5" fps="$6"
  [[ -f "$input" ]] || die "no such file: $input"
  [[ "$target_kb" =~ ^[0-9]+$ && "$height" =~ ^[0-9]+$ && "$fps" =~ ^[0-9]+$ ]] || die "numeric options expected"
  [[ -z "$max_seconds" || "$max_seconds" =~ ^[0-9]+$ ]] || die "--max-seconds must be a whole number"

  local duration
  duration="$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$input")"
  if [[ -n "$max_seconds" ]] && awk -v d="$duration" -v m="$max_seconds" 'BEGIN { exit !(d > m) }'; then
    duration="$max_seconds"
  fi

  # 92% of the budget for video; no audio track (backgrounds are muted).
  local kbps
  kbps="$(awk -v kb="$target_kb" -v d="$duration" 'BEGIN { printf "%d", (kb * 8 * 0.92) / d }')"
  (( kbps >= 150 )) || echo "encode-video: warning: $kbps kbps for $(basename "$input") will look poor; consider --max-seconds" >&2

  local trim=() scale="scale=-2:'min($height,ih)':flags=lanczos,fps=$fps"
  [[ -n "$max_seconds" ]] && trim=(-t "$max_seconds")

  mkdir -p "$(dirname "$base")"
  local out
  for out in "$base.webm" "$base.mp4" "$base-poster.webp"; do
    [[ "$(realpath -m "$out")" != "$(realpath "$input")" ]] || die "refusing to overwrite the original: $input"
  done
  local passlog
  passlog="$(mktemp -d)/pass"

  echo "→ $(basename "$base") (${duration}s, ${kbps} kbps, ≤${height}p @ ${fps}fps)"

  ffmpeg -hide_banner -loglevel error -y "${trim[@]}" -i "$input" -an -vf "$scale" \
    -c:v libvpx-vp9 -b:v "${kbps}k" -row-mt 1 -deadline good -cpu-used 2 \
    -pass 1 -passlogfile "$passlog" -f webm /dev/null
  ffmpeg -hide_banner -loglevel error -y "${trim[@]}" -i "$input" -an -vf "$scale" \
    -c:v libvpx-vp9 -b:v "${kbps}k" -row-mt 1 -deadline good -cpu-used 2 \
    -pass 2 -passlogfile "$passlog" "$base.webm"

  ffmpeg -hide_banner -loglevel error -y "${trim[@]}" -i "$input" -an -vf "$scale" \
    -c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -b:v "${kbps}k" \
    -maxrate "$((kbps * 3 / 2))k" -bufsize "$((kbps * 2))k" -movflags +faststart "$base.mp4"

  # The poster is the encoded video's own first frame, so the swap is seamless.
  ffmpeg -hide_banner -loglevel error -y -i "$base.webm" -frames:v 1 \
    -c:v libwebp -quality 60 -compression_level 6 "$base-poster.webp"

  rm -rf "$(dirname "$passlog")"
  for f in "$base.webm" "$base.mp4" "$base-poster.webp"; do
    printf "   %-40s %6d KB\n" "$(basename "$f")" "$(( $(stat -c %s "$f") / 1024 ))"
  done
}

if [[ $# -eq 0 ]]; then
  # The dark hero is a 64 s clip; a 600 KB budget only holds a short loop at
  # usable quality, so it is cut to its first 12 seconds. The light hero is a
  # 5 s clip whose original WebM is 390 KB, so it gets a 350 KB budget.
  encode "$SRC_DIR/bg_hero_section_dark.mp4"  "$OUT_DIR/hero-dark"   600 12 720 30
  encode "$SRC_DIR/bg_hero_section_light.mp4" "$OUT_DIR/hero-light"  350 "" 720 30
  encode "$SRC_DIR/solar_light.mp4"           "$OUT_DIR/solar-light" 900 12 720 30
  exit 0
fi

[[ $# -ge 2 ]] || die "usage: $0 [<input> <output-base> [--target-kb N] [--max-seconds N] [--height N] [--fps N]]"
input="$1" base="$2"; shift 2
target_kb=600 max_seconds="" height=720 fps=30
while [[ $# -gt 0 ]]; do
  case "$1" in
    --target-kb)   target_kb="${2:-}"; shift 2 ;;
    --max-seconds) max_seconds="${2:-}"; shift 2 ;;
    --height)      height="${2:-}"; shift 2 ;;
    --fps)         fps="${2:-}"; shift 2 ;;
    *) die "unknown option: $1" ;;
  esac
done
encode "$input" "$base" "$target_kb" "$max_seconds" "$height" "$fps"
