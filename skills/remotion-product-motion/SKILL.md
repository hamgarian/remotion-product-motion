---
name: remotion-product-motion
description: Create, revise, or review readable Remotion product demos, app showcases, and UI ads with purposeful choreography, authentic interface content, deterministic animation, and optional sound.
---

# Remotion product motion

Turn a product interaction into a clear visual story: establish context, show an action, make its result readable, then hand attention to the next action. Adapt the motion to the brief. Static shots, silent films, restrained transitions, and continuous camera travel are all valid choices.

## Establish the film

Identify the audience, product outcome, duration, dimensions, required screens, and supplied assets. Carry forward explicit choices about sound, camera movement, native UI behavior, and captions. Resolve missing essentials; choose reasonable defaults for incidental styling.

Inspect the actual interface and available content before planning claims. Preserve recognizable type, proportions, colors, labels, and interaction behavior. Use authentic authorized assets; label synthetic demonstration data. Record the source and snapshot date of advertised counts, the unit counted, filters, and deduplication method. A representative subset does not substantiate a full-catalog claim.

Write a compact shot plan with each shot's frame interval, focal target, action/result, readable interval, transition, and optional sound cue. Include the ending. Plan landscape and portrait framing separately when both are requested; cropping alone can lose a control or label.

## Choose the relevant guidance

- Read [choreography](references/choreography.md) when planning camera travel, easing, overlapping transitions, or adjusting layouts and cursor targets.
- Read [deterministic UI](references/deterministic-ui.md) when implementing animation, native CSS behavior, motion blur, or hard cuts between discrete screens.
- Read [sound and rendering](references/sound-and-render.md) when placing audio, optimizing exports, or validating the delivered film. Its visual verification section also applies to silent work.

Use [scripts/motion.mjs](scripts/motion.mjs) for reusable math where useful. It is dependency-free; copy or import it into the target project with an appropriate relative path. Inspect its exports and argument contracts before integration. `progress`, `expoIn`, `expoOut`, and `track` handle timing; `cameraAt` and `project` help evaluate composed framing; `selectState` selects cuts; `cueStartFrame` and `duckGain` help audio placement. The helper file is optional and does not create a Remotion project. This skill works independently of any repository demo.

## Build and inspect

Make animation a pure function of frame and fixed inputs. Preserve discrete screen selection outside temporal sampling, continuous animation hooks inside it, and audio outside it. See the deterministic reference for this distinction and its crossfade exception.

Implement one representative action and handoff first. Inspect rendered frames at the reading interval, speed peak, cut boundary, and destination before repeating the pattern. Change timing, staging, or hierarchy when the action is unclear; decoration cannot supply missing causality.

Camera motion should reveal context or guide attention. If continuous travel suits the brief, overlap independently timed pan and dolly tracks and inspect their projected result. A moving parent is not proof that its focal object moves on screen. Choose quiet or fully static holds when they serve the brief. Grain, breathing, shake, and perpetual motion are optional aesthetic decisions.

After any layout edit, re-evaluate downstream flow, camera targets, cursor hit points, scroll bounds, and framing. A successful render alone does not verify them.

## Deliver evidence

Render the requested formats with the project's pinned toolchain. Inspect consecutive frames around risky transitions and the encoded result at normal speed where playback is available. Verify text, real content, cursor alignment, crops, asset readiness, duration, and ending. For sound, distinguish measured signal checks from actual listening.

Report the output paths, commands/checks actually run, material limitations, and unresolved defects. State explicitly when real-time playback or audio audition was unavailable. A contact sheet supports visual review; it does not establish pacing or audio quality. Publish or send work externally only within the user's authorization.
