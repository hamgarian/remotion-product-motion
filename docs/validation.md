# Validation record — 1.0.0

Executed on 2026-10-19 with Node.js 24.11.0, npm 11.6.1, Windows x64, and pinned Remotion 4.0.534. These results describe this environment; other operating systems and dependency versions have not been exercised here.

## Executed technical checks

- `npm run check`: helper unit tests and packaging checks; TypeScript checks the example and helper integration. Detailed output is retained in [test-results.txt](test-results.txt).
- `npm run test:render -- --video`: six fixed-state boundary checks (frames 29, 30 and 31 across canvas and fallback blur), two moving-marker checks against unblurred baselines, twelve product stills across landscape and portrait and a landscape H.264 encode. [Machine-readable render results](render-results.json).
- Canvas control at frame 30: RGBA `[128, 0, 128, 255]`, mixing outgoing red and incoming blue. Fixed-state result: `[0, 0, 255, 255]`, retaining the intended incoming screen.
- The fallback control remains pure at that integer cut in this pinned implementation. Its results do not demonstrate the same defect. The test still verifies fixed-state output at all three boundary frames.
- The moving-marker row contains 16 partial-coverage pixels with canvas blur and 18 with fallback blur, versus zero in each unblurred baseline. This separately verifies that continuous motion still receives temporal sampling after discrete state is fixed.
- The encoded landscape file reports H.264, 1280x720, 210 frames, and 7.000000 seconds via the bundled ffprobe. Full decode using `ffmpeg -v error -i out/product.mp4 -c:v rawvideo -f null -` returned exit 0.
- [Landscape contact sheet](../assets/review-landscape.png) and [portrait contact sheet](../assets/review-portrait.png) were visually inspected for framing, text placement, state labels and crops.

## What is and is not established

The fixtures demonstrate hard-cut state isolation on a synthetic solid-background test. They do not measure every glyph edge, subjective motion quality, long-video reliability, or performance against another product. The helper tests cover seeking and fractional math; the render test records a small set of output frames rather than every possible state.

The demo is intentionally silent. No music, Foley, beat detector or source-silence detector is shipped. Audio placement and duck-envelope math are tested; actual audio mixing and listening are outside this demo. Normal-speed pacing was not auditioned during this validation.

Camera track objects are shared across fractional samples; the render check reuses one browser and bundle. These reduce avoidable setup/allocation work, but no numerical speedup is claimed. Blur quality is kept at eight samples for the fixture and example.

The independent behavioral evaluation, clean-checkout test, skill validator, installation test, release review and secret scan are recorded in [release-checks.md](release-checks.md). The release manifest is the final publication boundary.

The [forward evaluation](evaluation.md) records a fresh agent's response to a novel silent/static brief and distinguishes planned checks from executed rendering.
