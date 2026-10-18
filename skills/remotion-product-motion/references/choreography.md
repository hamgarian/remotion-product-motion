# Choreography and readable motion

## Stage the interaction

Choose one primary event per attention interval. Show enough surrounding interface to locate the action, then emphasize its result. Size text for the delivered frame, including a phone-sized viewing check when appropriate. Allocate time according to the information the viewer must understand, rather than equal durations for every screen.

| Useful choice | Failure to correct |
| --- | --- |
| A card opens from the selected row and reveals its contents. | A detail screen appears without a visible source or a legible cut. |
| A brief still hold lets the viewer read a critical total. | Every label drifts simply to keep a numeric velocity nonzero. |
| An outgoing scroll prepares the next section's location. | Camera shake fills a pause without communicating anything. |

Treat captions as layout. Reserve their space before animating them. Keep controls, product names, and necessary feedback visible throughout their intended reading interval. Adjust travel, scale, or timing when a caption crosses an essential target.

## Layer pan and dolly when useful

A pan changes framing across the interface; a dolly changes the apparent distance or scale. With separate controllers, one can prepare the next destination while the other finishes revealing the current result. Their start, peak, and end times need not coincide. A slow outgoing dolly can overlap an incoming pan without requiring every object to move.

Name the purpose and focal target of each track. Evaluate the final screen-space position, not just each controller's values. Under a simple centered camera model:

```text
screenX = viewportCenterX + (worldX - cameraX) * scale
screenY = viewportCenterY + (worldY - cameraY) * scale
```

Increasing scale while moving the camera toward an object can keep its projected location almost unchanged. Nested CSS transforms can also cancel or reverse motion depending on transform order and origin. Use the bundled projection helper only when its camera convention matches the composition; otherwise measure the actual transformed element.

Sample focal position and scale over consecutive frames around handoffs. Look for unintended reversals, excessive displacement, crops, and pauses. For a requested continuous move, maintain a perceptible purposeful path across the handoff; for a static hold, make the stillness intentional. Position continuity alone does not establish velocity continuity.

## Easing is a parameter

For normalized progress `p` in `[0, 1]`, an endpoint-normalized exponential family is:

```text
E_in(p, k) = (2^(k*p) - 1) / (2^k - 1)
E_out(p, k) = 1 - E_in(1-p, k)
```

At `k = 0`, use the linear limit `p`; use numerically stable helpers near zero. Clamp progress where the intended track holds its endpoints. Validate finite inputs and positive track duration. Endpoint handling belongs in reusable math, not ad hoc exceptions in each shot.

An in/out pair can build momentum into a reveal or decelerate one track while another accelerates. It does not guarantee a smooth handoff. A larger exponent concentrates more travel into fewer frames; check peak displacement, legibility, and sampled blur. Repeated isolated rest-to-rest moves may feel like a series of stops even when each curve is smooth. Tune based on the composed trajectory and narrative purpose, not a supposedly premium exponent.

## Layout changes propagate

When a heading grows, document flow can move the button beneath it. Recompute the button's cursor target, the camera destination, and any scroll offset from the new layout. Prefer shared element bounds or semantic anchors to independently typed coordinates. Verify the cursor lands within the transformed hit area at the action frame.

For catalogs, virtualize only if useful for rendering. Keep complete source data and truthful totals; bound the visible range with enough overscan for the largest sampled movement and blur exposure. Inspect the first and last rows as well as the middle. A fast passage is a breadth impression, not an opportunity to read every entry.

An inserted shot changes timing dependencies. Keep an explicit mapping between composition time, shot-local time, and any paused story clock. Update later camera and sound cues using that mapping, then inspect the join and ending.
