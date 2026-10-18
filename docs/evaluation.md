# Independent forward evaluation

A fresh agent received only the installed skill files and this novel brief:

> Plan an eight-second silent portrait approval-flow showcase: document list, native modal opening, Pending-to-Approved hard cut during camera travel, then a fully static completion hold. A wrapped caption moves the approval button down. Use blur on travel.

The agent produced a shot plan, a React integration sketch, and a validation plan in an isolated temporary workspace. The builder inspected all three artifacts. This was a behavioral planning evaluation, not an executed second video; its suggested render commands were not counted as passing tests.

| Requirement | Observed behavior |
|---|---|
| Eight-second portrait film | Plan specifies 1080x1920, 30 fps and 240 frames. |
| Silent request | No audio components or soundtrack are proposed. |
| Native opening | Modal mounts at frame 60; the plan preserves its local clock across approval and specifies deterministic scrubbing. |
| Cut during travel | Pending changes to Approved at frame 120 while the camera travels during 114–138. Screen selection occurs above sampling; continuous hooks stay below. |
| Static completion | Frames 180–239 bypass the sampler and contain static content, with no time-dependent camera, cursor, noise or spinner. |
| Caption reflow | Caption occupies document flow; button/cursor targets depend on updated measured geometry, including modal and camera transforms. |
| Honest verification | Repeated-seek comparisons, cut-boundary images, transformed hit bounds, all-frame static-hold comparison and encoded metadata checks are planned rather than reported as already run. |

Outcome: the skill supplied guidance for every explicit requirement at the planning/sketch level. The brief supplied no real UI or native animation asset, so fidelity to an unknown implementation cannot be established. The agent identified that limitation and marked sampler/native-animation adapters as integration work, not bundled working APIs.

The first-release example is deliberately smaller: it supplies actual executable evidence for the helpers and sampled-cut behavior, not a complete CSS-scrubbing framework. A future evaluation could implement the full approval flow and render it in a second clean project.
