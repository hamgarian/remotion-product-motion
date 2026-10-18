/** Pure timeline helpers. Frames may be fractional; no retained state or wall clock.
 * @typedef {{start:number,end:number,from:number,to:number,ease?:string,exponent?:number}} Track
 */
const finite = (value, name) => {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
  return value;
};
const clamp = (value) => Math.min(1, Math.max(0, value));

export function progress(frame, start, end) {
  finite(frame, 'frame'); finite(start, 'start'); finite(end, 'end');
  if (end <= start) throw new RangeError('end must exceed start');
  if (frame <= start) return 0;
  if (frame >= end) return 1;
  const duration = end - start;
  if (Number.isFinite(duration)) return clamp((frame - start) / duration);
  const magnitude = Math.max(Math.abs(start), Math.abs(end));
  return clamp((frame / magnitude - start / magnitude) / (end / magnitude - start / magnitude));
}

export function expoIn(value, exponent = 6) {
  finite(value, 'progress'); finite(exponent, 'exponent');
  if (exponent < 0 || exponent > 20) throw new RangeError('exponent must be between 0 and 20');
  const p = clamp(value);
  if (p === 0 || p === 1 || exponent === 0) return p;
  // expm1 avoids loss of precision when exponent is close to zero.
  return Math.expm1(Math.LN2 * exponent * p) / Math.expm1(Math.LN2 * exponent);
}

export function expoOut(value, exponent = 6) {
  finite(value, 'progress');
  return 1 - expoIn(1 - clamp(value), exponent);
}

export function track(frame, {start, end, from, to, ease = 'out', exponent = 6}) {
  finite(from, 'from'); finite(to, 'to');
  const p = progress(frame, start, end);
  const eased = ease === 'linear' ? p : ease === 'in' ? expoIn(p, exponent) : ease === 'out' ? expoOut(p, exponent) : null;
  if (eased === null) throw new RangeError('ease must be linear, in or out');
  if (eased === 0) return from;
  if (eased === 1) return to;
  return finite(from * (1 - eased) + to * eased, 'track result');
}

/** x/y tracks are additive offsets; zoom tracks are multiplicative factors.
 * @param {number} frame
 * @param {{x?:Track[],y?:Track[],zoom?:Track[]}} rig
 */
export function cameraAt(frame, {x = [], y = [], zoom = []}) {
  finite(frame, 'frame');
  const z = zoom.reduce((value, t) => {
    if (t.from <= 0 || t.to <= 0) throw new RangeError('zoom endpoints must be positive');
    return value * track(frame, t);
  }, 1);
  if (!Number.isFinite(z) || z <= 0) throw new RangeError('zoom must be positive and finite');
  const sum = (tracks) => tracks.reduce((value, t) => value + track(frame, t), 0);
  return {x: finite(sum(x), 'camera x'), y: finite(sum(y), 'camera y'), zoom: z};
}

/** World coordinate to screen coordinate, with camera at viewport center. */
export function project(point, camera, viewport) {
  for (const [name, value] of Object.entries({x:point.x,y:point.y,cameraX:camera.x,cameraY:camera.y,zoom:camera.zoom,width:viewport.width,height:viewport.height})) finite(value,name);
  if (camera.zoom <= 0 || viewport.width <= 0 || viewport.height <= 0) throw new RangeError('zoom and viewport dimensions must be positive');
  return {x: finite(viewport.width / 2 + (point.x - camera.x) * camera.zoom, 'projected x'), y: finite(viewport.height / 2 + (point.y - camera.y) * camera.zoom, 'projected y')};
}

/** Cuts must be strictly increasing. Pre-roll holds the first state. */
export function selectState(frame, cuts) {
  finite(frame, 'frame');
  if (!Array.isArray(cuts) || cuts.length === 0) throw new RangeError('at least one cut is required');
  let selected = cuts[0].id;
  for (let i = 0; i < cuts.length; i++) {
    finite(cuts[i].frame, 'cut frame');
    if (i > 0 && cuts[i].frame <= cuts[i-1].frame) throw new RangeError('cuts must be strictly increasing');
    if (frame >= cuts[i].frame) selected = cuts[i].id;
  }
  return selected;
}

/** For untrimmed audio. A negative result needs pre-roll or source trimming. */
export function cueStartFrame({eventFrame, leadingSilenceSeconds, fps}) {
  finite(eventFrame,'eventFrame'); finite(leadingSilenceSeconds,'leadingSilenceSeconds'); finite(fps,'fps');
  if (fps <= 0 || leadingSilenceSeconds < 0) throw new RangeError('fps must be positive and silence nonnegative');
  return Math.round(finite(eventFrame - leadingSilenceSeconds * fps, 'cue start'));
}

/** Windows describe the full-duck intervals; fades extend on either side. */
export function duckGain(frame, windows, {fadeFrames = 4, floor = .35} = {}) {
  finite(frame,'frame'); finite(fadeFrames,'fadeFrames'); finite(floor,'floor');
  if (fadeFrames < 0 || floor < 0 || floor > 1) throw new RangeError('fade must be nonnegative and floor between 0 and 1');
  let gain = 1;
  for (const {start,end} of windows) {
    finite(start,'start'); finite(end,'end');
    if (end < start) throw new RangeError('window end must not precede start');
    const distance = frame < start ? start - frame : frame > end ? frame - end : 0;
    const weight = distance === 0 ? 1 : fadeFrames === 0 ? 0 : clamp(1 - distance / fadeFrames);
    gain = Math.min(gain, weight === 1 ? floor : floor + (1 - floor) * (1 - weight));
  }
  return gain;
}
