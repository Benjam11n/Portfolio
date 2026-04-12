#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

PROJECT_IDS=(
  "zucchini"
  "disknee"
  "twinAI"
  "chip"
  "worldquant"
  "birds-of-a-feather"
)

for project_id in "${PROJECT_IDS[@]}"; do
  source_video="$ROOT_DIR/public/projects/$project_id/video.mp4"
  preview_video="$ROOT_DIR/public/projects/$project_id/preview.mp4"
  preview_poster="$ROOT_DIR/public/projects/$project_id/preview-poster.jpg"

  if [[ ! -f "$source_video" ]]; then
    echo "Skipping $project_id: missing $source_video"
    continue
  fi

  echo "Generating homepage preview for $project_id"

  ffmpeg -y \
    -ss 0 \
    -t 3 \
    -i "$source_video" \
    -an \
    -movflags +faststart \
    -vf "fps=18,scale=640:-2:flags=lanczos" \
    -c:v libx264 \
    -preset veryslow \
    -crf 32 \
    "$preview_video"

  ffmpeg -y \
    -ss 0.5 \
    -i "$source_video" \
    -frames:v 1 \
    -vf "scale=640:-2:flags=lanczos" \
    -q:v 4 \
    "$preview_poster"

  du -h "$preview_video" "$preview_poster"
done
