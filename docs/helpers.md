# Optional motion helpers

Import or copy `skills/remotion-product-motion/scripts/motion.mjs`. It has no dependencies and stores no frame state. Inputs must be finite; frame arguments may be fractional or negative. Invalid durations and cut schedules throw instead of silently producing a broken render.

| Export | Contract |
|---|---|
| `progress(frame, start, end)` | Clamped 0–1; `end > start`. |
| `expoIn(p, exponent=6)`, `expoOut(p, exponent=6)` | Clamp progress; exponent 0–20. Zero gives linear motion. Exact endpoints; `expm1` stabilizes small exponents. |
| `track(frame, {start,end,from,to,ease='out',exponent=6})` | Holds both endpoints. Ease is `in`, `out` or `linear`. |
| `cameraAt(frame, {x=[],y=[],zoom=[]})` | Sums x/y offsets and multiplies positive zoom factors. Neutral tracks must start at 0 for pan and 1 for zoom. |
| `project({x,y}, {x,y,zoom}, {width,height})` | Viewport-centered projection: `width/2 + (point.x-camera.x)*zoom`, likewise y. Use this same transform convention in CSS. |
| `selectState(frame, [{frame,id},...])` | Strictly increasing cut times; the boundary selects the incoming state. Pre-roll holds the first state. Call outside the blur wrapper for hard cuts. |
| `cueStartFrame({eventFrame,leadingSilenceSeconds,fps})` | Rounded start for an **untrimmed** cue. Negative output means pre-roll or trimming is required. For a trimmed cue, pass zero silence; do not compensate twice. |
| `duckGain(frame, windows, {fadeFrames=4,floor=.35})` | Each `{start,end}` is a full-duck interval, with fades outside it. Overlaps use the deepest envelope, not multiplication. Output is a multiplier; multiply by your baseline music gain. |

Convert seconds to the target composition's frames explicitly. Example defaults express design choices, not physical requirements. Exponential endpoints are position-continuous but do not guarantee velocity continuity at a joined track; inspect the composed path and use a spline or explicit derivatives where that guarantee matters.

`selectState` validates the full cut schedule on each call. For a large catalog, validate and compile a specialized lookup once rather than rebuilding arrays in a pixel or per-item loop. The included demo has only a few cuts.
