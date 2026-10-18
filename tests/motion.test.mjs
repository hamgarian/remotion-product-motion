import test from 'node:test';
import assert from 'node:assert/strict';
import {progress,expoIn,expoOut,track,cameraAt,project,selectState,cueStartFrame,duckGain} from '../skills/remotion-product-motion/scripts/motion.mjs';

test('progress clamps both sides and preserves fractional frames',()=>{
  assert.equal(progress(-2,0,10),0); assert.equal(progress(12,0,10),1);
  assert.equal(progress(2.5,0,10),.25);
});
test('timelines reject nonfinite values and zero or reversed durations',()=>{
  for(const args of [[0,0,0],[0,2,1],[NaN,0,1],[0,0,Infinity]]) assert.throws(()=>progress(...args));
});
test('exponential easing has exact endpoints and symmetric in/out',()=>{
  assert.equal(expoIn(0),0); assert.equal(expoIn(1),1); assert.equal(expoOut(0),0); assert.equal(expoOut(1),1);
  for(let i=0;i<=20;i++){const p=i/20; assert.ok(Math.abs(expoOut(p)-(1-expoIn(1-p)))<1e-12);}
  assert.equal(expoIn(.4,0),.4);
});
test('exponential curves stay monotone for supported exponents',()=>{
  for(const k of [0,.000001,6,20]){let prev=0; for(let i=0;i<=100;i++){const v=expoIn(i/100,k);assert.ok(v>=prev&&v<=1);prev=v;}}
  for(const k of [-1,21,NaN]) assert.throws(()=>expoIn(.5,k));
});
test('track holds endpoints and interpolates values',()=>{
  const t={start:10,end:20,from:-100,to:100,ease:'linear'};
  assert.equal(track(0,t),-100);assert.equal(track(15,t),0);assert.equal(track(30,t),100);
  assert.throws(()=>track(15,{...t,ease:'unknown'}));
});
const rig={x:[{start:0,end:40,from:0,to:300,ease:'out'},{start:25,end:60,from:0,to:50,ease:'in'}],y:[],zoom:[{start:0,end:60,from:1,to:1.2,ease:'linear'}]};
test('overlapping camera tracks are additive for pan, multiplicative for zoom',()=>{
  const c=cameraAt(30,rig);assert.ok(c.x>track(30,rig.x[0]));assert.equal(c.y,0);assert.equal(c.zoom,1.1);
  assert.deepEqual(cameraAt(1,{}),{x:0,y:0,zoom:1});
});
test('camera is deterministic under seeking and fractional sampling',()=>{
  const first=cameraAt(30.125,rig);cameraAt(59,rig);cameraAt(0,rig);assert.deepEqual(cameraAt(30.125,rig),first);
});
test('camera rejects nonpositive zoom at any point',()=>{
  assert.throws(()=>cameraAt(0,{zoom:[{start:0,end:1,from:0,to:1}]}));
  assert.throws(()=>cameraAt(1,{zoom:[{start:0,end:1,from:1,to:-1}]}));
});
test('projection uses a viewport-centered camera; screen motion can cancel',()=>{
  assert.deepEqual(project({x:50,y:20},{x:50,y:20,zoom:2},{width:800,height:600}),{x:400,y:300});
  assert.deepEqual(project({x:100,y:0},{x:50,y:0,zoom:2},{width:800,height:600}),{x:500,y:300});
  assert.throws(()=>project({x:0,y:0},{x:0,y:0,zoom:1},{width:0,height:600}));
});
test('discrete selection cuts at the boundary, clamping pre-roll',()=>{
  const cuts=[{frame:0,id:'a'},{frame:30,id:'b'},{frame:60,id:'c'}];
  assert.equal(selectState(-1,cuts),'a');assert.equal(selectState(29.75,cuts),'a');assert.equal(selectState(30,cuts),'b');assert.equal(selectState(999,cuts),'c');
});
test('discrete selection rejects empty, duplicate and unsorted cut lists',()=>{
  for(const cuts of [[],[{frame:1,id:'a'},{frame:1,id:'b'}],[{frame:3,id:'a'},{frame:2,id:'b'}]])assert.throws(()=>selectState(1,cuts));
});
test('audible attack timing reports negative pre-roll instead of silently clamping',()=>{
  assert.equal(cueStartFrame({eventFrame:60,leadingSilenceSeconds:.2,fps:30}),54);
  assert.equal(cueStartFrame({eventFrame:2,leadingSilenceSeconds:.2,fps:30}),-4);
  assert.equal(cueStartFrame({eventFrame:60,leadingSilenceSeconds:0,fps:60}),60);
  assert.throws(()=>cueStartFrame({eventFrame:1,leadingSilenceSeconds:-1,fps:30}));
});
test('duck envelopes retain baseline outside windows and reach floor inside',()=>{
  const w=[{start:10,end:20}];
  assert.equal(duckGain(0,w,{fadeFrames:4,floor:.3}),1);
  assert.equal(duckGain(10,w,{fadeFrames:4,floor:.3}),.3);
  assert.ok(Math.abs(duckGain(8,w,{fadeFrames:4,floor:.3})-.65)<1e-12);
  assert.ok(Math.abs(duckGain(22,w,{fadeFrames:4,floor:.3})-.65)<1e-12);
  assert.equal(duckGain(24,w,{fadeFrames:4,floor:.3}),1);
});
test('overlapping duck windows choose the deepest gain instead of multiplying',()=>{
  assert.equal(duckGain(15,[{start:10,end:20},{start:12,end:22}],{floor:.3}),.3);
  assert.equal(duckGain(0,[]),1);
  assert.throws(()=>duckGain(0,[{start:3,end:2}]));assert.throws(()=>duckGain(0,[],{floor:2}));
});
test('large finite ranges preserve midpoints and exact track endpoints',()=>{
  const max=Number.MAX_VALUE;
  assert.equal(progress(0,-max,max),.5);
  const t={start:0,end:2,from:-max,to:max,ease:'linear'};
  assert.equal(track(0,t),-max);assert.equal(track(1,t),0);assert.equal(track(2,t),max);
});
test('computed overflow is rejected instead of escaping into CSS or audio scheduling',()=>{
  assert.throws(()=>project({x:Number.MAX_VALUE,y:0},{x:-Number.MAX_VALUE,y:0,zoom:2},{width:800,height:600}));
  assert.throws(()=>cueStartFrame({eventFrame:0,leadingSilenceSeconds:Number.MAX_VALUE,fps:60}));
});
