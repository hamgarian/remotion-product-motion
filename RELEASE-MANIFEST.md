# Proposed GitHub release

- Destination: **hamgarian/remotion-product-motion** on GitHub, **public**.
- Version/tag: **v1.0.0**.
- Tagline: **Create fluid, readable product showcase videos in Remotion.**
- GitHub description: **Fluid, readable product showcase videos in Remotion. Published with Loot: https://github.com/hamgarian/loot-skill**
- Changelog: initial release of universal motion guidance, deterministic helpers, synthetic demo and regression evidence.
- Topics: `remotion`, `agent-skills`, `codex`, `react`, `video`, `motion-design`.
- Publish the repository and tag. No npm publication, launch messages, blog posts or third-party project assets are included. The social image is committed as an asset; changing GitHub's social-preview setting is not part of this manifest.

## Exact files (35)

```text
.github/workflows/checks.yml
.gitignore
CHANGELOG.md
LICENSE
README.md
RELEASE-MANIFEST.md
SPEC.md
assets/demo-landscape.png
assets/demo.mp4
assets/logo.svg
assets/review-landscape.png
assets/review-portrait.png
assets/social-preview.png
docs/clean-checkout-tests.txt
docs/clean-render-results.json
docs/evaluation.md
docs/helpers.md
docs/independent-review.md
docs/release-checks.md
docs/render-results.json
docs/sources.md
docs/test-results.txt
docs/validation.md
examples/index.tsx
package-lock.json
package.json
scripts/render-check.mjs
skills/remotion-product-motion/SKILL.md
skills/remotion-product-motion/references/choreography.md
skills/remotion-product-motion/references/deterministic-ui.md
skills/remotion-product-motion/references/sound-and-render.md
skills/remotion-product-motion/scripts/motion.mjs
tests/motion.test.mjs
tests/package.test.mjs
tsconfig.json
```

## Validation

- `npm run check`: **20 passed, zero failed; TypeScript passed**.
- `npm run test:render -- --video`: **six cut-boundary checks and two motion-spread checks passed**, twelve review stills rendered, seven-second landscape example encoded and decoded.
- The documented dependency install, checks and render were repeated in a clean local Git clone. [Recorded evidence](docs/release-checks.md).
- Independent forward evaluation respected silent/static requirements and identified the need for source assets before claiming native-animation fidelity. [Evaluation](docs/evaluation.md).
- Independent release review and corrections: [review record](docs/independent-review.md).
- Codex installation and skill validator passed. Loot's staged-export secret scan is clean; the generated video size warning was manually reviewed.

Limits: normal-speed pacing was not auditioned; no audio is bundled or listened to; macOS/Linux and future dependency versions are untested. No numerical performance advantage is claimed. The Skills CLI and Claude Code installation instructions were inspected, while Codex manual installation was executed. Hosted CI will first run after publication.

## Approval boundary

The selected Loot/skill-factory workflow requires a clear yes on this manifest before public upload. No GitHub repository or public tag has been created by this preparation run. A yes approves precisely the public repository, tag, files and description listed above.
