# Sound, rendering, and evidence

## Sound follows visible events

Respect silent requests. For sound-enabled work, prefer supplied or authorized assets and keep a source/usage record. Choose a small set of meaningful cues: selection, arrival, confirmation, or completion. Vary repeated Foley only when it supports the action; one sound per moving layer creates clutter.

Measure leading silence before placing a cue. If an asset's audible attack occurs `a` seconds after its start, and playback trims `t` seconds, its remaining attack offset is `a - t`. Place playback that much before the visual event, accounting for FPS and frame rounding. If this would start before the composition, trim further or revise staging. Inspect the helper's `cueStartFrame` contract before use; a negative scheduled start needs explicit handling by the composition.

Good: trim a quiet lead-in, align the attack to the visible confirmation, and briefly duck the music around it. Bad: place the file start at the confirmation and assume the sound's attack is aligned.

Analyze the selected music excerpt, including its source offset, for candidate beats and bass/onset peaks. Put major visual accents on suitable peaks when musically useful; keep smaller UI actions in a coherent causal order. Refresh cue times after inserting shots or changing the music offset. Beat detection is evidence about a signal, not proof that a cut feels right.

Apply a short gain envelope around feedback, with attack and recovery times that preserve the music phrase. Account for overlapping cues: use a bounded combined envelope rather than accidentally multiplying many reductions into near-silence. Set a gain floor and examine peak levels in the final encoded mix. Listen at normal speed if available. Waveform analysis can verify timing, clipping, and levels; report it as analysis, not an ear check. Version changed preview media or clear caches so review uses the new mix.

## Benchmark before optimizing

Use a representative short range containing real assets, text, the fastest move, a cut, and blur if present. Compare the same frame range, dimensions, codec, source revision, asset readiness, and machine. Record elapsed time, settings, and visible differences; account for cold versus warm caches. A simpler opening shot is a poor proxy for a dense sampled transition.

Change one dimension at a time:

- **Samples/exposure:** reduce temporal samples or exposure only after checking the same frames for stepping and legibility. More samples multiply visual work.
- **Concurrency:** benchmark several reasonable worker counts and monitor memory. Increasing workers can slow a memory-limited or contended workload. Remotion's [renderMedia options](https://www.remotion.dev/docs/renderer/render-media) define supported concurrency and render controls for the installed version.
- **GPU:** establish whether the current browser/runtime and workload use the desired acceleration path. GPU availability is not a general promise that React layout, raster work, or encoding becomes faster. Consult [Remotion's GPU guidance](https://www.remotion.dev/docs/gpu), then benchmark this machine separately.

Prefer bounded assets, shared calculations, and useful viewport virtualization before removing necessary product detail. Avoid reporting a speedup without comparable timings and visual checks.

## Preflight and chunk boundaries

Preflight composition metadata, expected duration, asset/font loading, missing images, requested dimensions, and at least one representative render before a long export. Confirm sufficient disk space for temporary images and output. Preflight lowers risk; it does not verify every frame or replace inspecting the encoded film.

Chunk only when needed for the renderer or available resources. Preserve global frame numbers, deterministic inputs, asset versions, and codec settings. Handle sampled exposure near chunk edges without resetting shot state. Join frames in exact order without duplicate or omitted boundaries; mix audio on a consistent full timeline or verify offsets and encoder padding at every join. Decode and inspect seam frames and listen across seams. A set of individually successful chunks does not prove a correct final film.

## Verify the deliverable

Inspect consecutive frames at entrances, readable holds, speed peaks, state cuts, handoffs, scroll limits, and the ending. Confirm product names, key text, genuine results, cursor targets, crops, caption collisions, and complete assets. Check any marketed totals against the recorded counting method. Review each requested aspect ratio separately.

Decode the encoded file, verify dimensions, frame count/duration, and audio presence or intentional absence. Watch at normal speed and listen where possible. Numeric trajectory checks establish continuity; still frames establish composition; playback establishes temporal readability. None substitutes for all the others.

Report exact artifacts and checks performed, render settings relevant to reproducibility, and remaining uncertainty. Use statements such as “inspected boundary frames; playback unavailable” or “measured peak levels; audio not auditioned” when accurate. Never report an unrun check as passed.
