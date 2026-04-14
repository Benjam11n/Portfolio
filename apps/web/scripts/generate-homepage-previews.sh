#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECTS_DIR="$ROOT_DIR/public/projects"

mapfile -d '' PROJECT_DIRS < <(
  find "$PROJECTS_DIR" -mindepth 1 -maxdepth 1 -type d -print0 | sort -z
)

for project_dir in "${PROJECT_DIRS[@]}"; do
  project_id="$(basename "$project_dir")"
  source_video="$project_dir/video.mp4"
  preview_video="$project_dir/preview.mp4"
  preview_poster="$project_dir/preview-poster.jpg"

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
