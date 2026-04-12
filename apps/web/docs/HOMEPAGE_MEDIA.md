# Homepage Media Workflow

These assets exist to keep the homepage lightweight while preserving hover
preview polish.

## Output Files

Each homepage project card uses:

- `public/projects/<id>/preview.mp4`
- `public/projects/<id>/preview-poster.jpg`

The GovTech experience logo uses a checked-in lightweight asset:

- `public/experiences/govtech-preview.mp4`

## Generation Targets

- Preview duration: `3s`
- Preview frame rate: `18fps`
- Preview resolution cap: `640px` wide
- Video codec: H.264 (`libx264`)
- Audio: stripped
- MP4 fast start: enabled
- Poster format: JPEG

JPEG is used here because the local ffmpeg build in this workspace does not
include `libwebp`. If WebP support is added later, posters can switch to WebP
without changing the homepage loading strategy.

## Regenerating Assets

Run from the repo root:

```bash
bash apps/web/scripts/generate-homepage-previews.sh
```

## Usage Rules

- Homepage cards must use `preview.mp4`, never `video.mp4`
- Homepage cards must not attach a preview video source on initial render
- Full demo videos remain available for project detail pages
- Raw GIFs should not be used directly on the homepage when a compressed
  preview can do the job
