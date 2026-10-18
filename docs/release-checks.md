# Release checks — 1.0.0

The technical render evidence and limits are in [validation.md](validation.md).

## Executed checks

- `npm run check`: 20 tests passed, zero failed; TypeScript passed. [Captured output](test-results.txt).
- `npm run test:render -- --video`: six boundary comparisons and two moving-marker blur checks passed, twelve landscape/portrait stills rendered, and the silent landscape example encoded. [Captured results](render-results.json).
- Bundled ffprobe: landscape output is H.264, 1280x720, 210 frames, seven seconds. Full rawvideo decode returned exit 0.
- Codex `quick_validate.py skills/remotion-product-motion`: `Skill is valid!`.
- Copied the self-contained folder to the local Codex skills directory and ran the same validator there: `Skill is valid!`. A packaging test independently copied it to temporary storage, imported its helper without repository dependencies, and resolved its entrypoint references.
- Loot's `scan.mjs` ran on an export of the staged publication files: `clean: no secrets found`. Its sole warning was `assets/demo.mp4`, which exceeds the scanner's one-megabyte text-scan limit. The video was reviewed as a fresh encode of the authored synthetic interface with no external assets or audio; full decode passed and metadata contains only container/encoder information and the Remotion version comment. `gitleaks` was unavailable. Publication begins from newly created repository history containing only these authored release files.
- A fresh agent completed the [behavioral evaluation](evaluation.md). This was a plan/sketch evaluation; it did not render a second film.
- Clean local Git clone: `npm ci --no-audit --no-fund` installed 323 packages from the lockfile. After checking out the corrected source with that unchanged lockfile, `npm run check` passed all 20 tests and TypeScript; `npm run test:render -- --video` passed six cut checks and two motion-spread checks, rendered twelve product stills and encoded the example. The clone's tracked worktree remained clean. [Test output](clean-checkout-tests.txt) and [render results](clean-render-results.json). Its encoded MP4 also fully decoded without errors.
- Reinstalled the corrected helper into the local Codex skill and reran `quick_validate.py`: `Skill is valid!`.

The Skills CLI install command and Claude Code copy instructions were inspected rather than executed. Codex manual installation and dependency-free skill loading were actually tested. GitHub Actions is included for future runs; no hosted CI run is claimed before publication.

Review frames were visually inspected. Normal-speed playback and audio audition were not performed; the example contains no audio. Linux/macOS, future versions, full CSS-scrubbing integration and numerical performance comparisons remain untested.
