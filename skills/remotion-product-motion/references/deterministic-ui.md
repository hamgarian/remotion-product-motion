# Deterministic UI and temporal sampling

## Render any frame independently

Derive transforms, opacity, scrolling, cursor position, and reveal progress from frame and fixed inputs. A render worker may request frames out of order. Support fractional frames when using temporal sampling. Avoid accumulated deltas, wall-clock timers, playback-dependent state, and unseeded randomness. Await fonts and assets before capture; use render-aware media loading. See Remotion's [flickering guidance](https://www.remotion.dev/docs/flickering) for frame independence and asset readiness.

Seek directly to a late frame, revisit an earlier frame, and render the late frame again. Compare results. Also test a fractional frame if sampled animation is enabled. Sequential playback can conceal an initialization dependency.

Native UI behavior may be part of authenticity. Prefer re-expressing its timing as frame-driven values. When preserving CSS keyframes or Web Animations, pause and set animation time explicitly from the local frame before capture. Check initial delay, fill mode, iterations, easing, transform origin, and element mount time. A negative CSS delay alone can leave transitions or mount effects uncontrolled. Native CSS scrubbing is an integration task; verify arbitrary seeking in the actual renderer. Disabling every animation can remove the interaction the user asked to show.

## Separate cuts from sampled motion

Temporal blur blends visual samples taken at different times within an output frame. That is useful for movement, but a shutter interval crossing a screen replacement can blend unrelated text or question states.

For a deliberate hard cut, select the screen once using the output frame outside the sampler. Pass that fixed selection down. Place hooks that calculate continuous motion inside the sampled visual subtree so they receive sampled time. Keep audio outside it so visual samples do not duplicate audio components.

```tsx
// Structural illustration: adapt props/imports to the installed Remotion version.
const Film = () => {
  const outputFrame = useCurrentFrame();
  const screen = selectScreenForOutputFrame(outputFrame);
  return <>
    <VisualSampler>
      <MovingScreen screen={screen} />
    </VisualSampler>
    <Soundtrack />
  </>;
};

const MovingScreen = ({screen}) => {
  const sampledFrame = useCurrentFrame();
  return <Screen state={screen} style={cameraStyle(sampledFrame)} />;
};
```

`VisualSampler`, `selectScreenForOutputFrame`, and `cameraStyle` above are explanatory names, not bundled APIs. Use `selectState` from the bundled helper when its contract suits the cut schedule.

Bad: select a question with `floor(sampledFrame / interval)` inside the blur subtree; shutter samples may contain different questions. Also bad: calculate all camera transforms above the sampler; each visual copy may receive the same transform and produce no temporal movement blur.

An intentional crossfade is a different editorial choice: render both states with explicit opacities and inspect the overlap. Do not apply fixed-state cut handling blindly to a dissolve or a native animated state transition. If a fresh screen contains a local entrance animation, define its local time and any pre-cut sample clamping deliberately.

## Choose and verify blur

Use blur only when it improves the requested motion. Remotion's [motion blur documentation](https://www.remotion.dev/docs/motion-blur) describes `HtmlInCanvasMotionBlur`, its preview support requirements, and `CameraMotionBlur`, whose layered blending can alter color and opacity. Inspect the installed version before integration. Shutter angle controls temporal exposure; sample count controls sampling density. Neither compensates for an unreadable camera path.

Check an unblurred baseline, then compare blur on the same frames. Start with modest settings and raise samples when visible stepping justifies the cost. Avoid stacking an unrelated Gaussian blur that merely hides text. A fallback preview can look different from the final renderer; verify the final implementation.

Render the frame before a cut, the cut frame, the next frame, and nearby speed peaks. Compare fixed-state selection against an intentionally sampled-selection control when diagnosing ghosting. Verify sharp discrete content and smoothly sampled continuous movement separately; inspecting a single middle frame does not exercise the boundary.
