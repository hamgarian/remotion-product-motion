import {bundle} from '@remotion/bundler';
import {openBrowser,renderStill,selectComposition,renderMedia} from '@remotion/renderer';
import {PNG} from 'pngjs';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';

await mkdir('out',{recursive:true});
const started=performance.now();
const serveUrl=await bundle({entryPoint:path.resolve('examples/index.tsx')});
const browser=await openBrowser('chrome');
const results=[];
const motionResults=[];
try {
  for(const backend of ['canvas','fallback']){
    for(const frame of [29,30,31]){
      const pixels={};
      for(const fixed of [false,true]){
        const inputProps={fixed,backend};
        const composition=await selectComposition({serveUrl,id:'CutFixture',inputProps,puppeteerInstance:browser});
        const output=`out/${backend}-${fixed?'fixed':'control'}-${frame}.png`;
        await renderStill({serveUrl,composition,inputProps,frame,output,puppeteerInstance:browser,logLevel:'error'});
        const png=PNG.sync.read(await readFile(output));
        const offset=(16*png.width+16)*4;
        pixels[fixed?'fixed':'control']=[...png.data.subarray(offset,offset+4)];
      }
      const expected=frame<30?[255,0,0,255]:[0,0,255,255];
      // Canvas readback may round channels; allow a small quantization error.
      assert.ok(pixels.fixed.every((v,i)=>Math.abs(v-expected[i])<=2),`${backend} fixed frame ${frame}: ${pixels.fixed}`);
      results.push({backend,frame,...pixels});
    }
    const boundary=results.filter(r=>r.backend===backend&&r.frame>=30);
    if(backend==='canvas') assert.ok(boundary.some(r=>r.control[0]>10&&r.control[2]>10),'canvas: control must reproduce cross-screen ghosting');
    const rows=[];
    for(const disabled of [false,true]){
      const inputProps={fixed:true,backend,disabled};
      const composition=await selectComposition({serveUrl,id:'CutFixture',inputProps,puppeteerInstance:browser});
      const output=`out/${backend}-${disabled?'unblurred':'moving'}-31.png`;
      await renderStill({serveUrl,composition,inputProps,frame:31,output,puppeteerInstance:browser,logLevel:'error'});
      const png=PNG.sync.read(await readFile(output));
      let partialPixels=0;
      for(let x=80;x<260;x++){
        const red=png.data[(75*png.width+x)*4];
        if(red>8&&red<247)partialPixels++;
      }
      rows.push(partialPixels);
    }
    assert.ok(rows[0]>rows[1]+2,`${backend}: moving marker must spread across more pixels than an unblurred control (${rows})`);
    motionResults.push({backend,blurredPartialPixels:rows[0],unblurredPartialPixels:rows[1]});
  }
  for(const id of ['ProductLandscape','ProductPortrait']){
    const composition=await selectComposition({serveUrl,id,puppeteerInstance:browser});
    for(const frame of [24,89,90,149,150,209]){
      await renderStill({serveUrl,composition,frame,output:`out/${id}-${frame}.png`,puppeteerInstance:browser,logLevel:'error'});
    }
  }
  if(process.argv.includes('--video')){
    const composition=await selectComposition({serveUrl,id:'ProductLandscape',puppeteerInstance:browser});
    await renderMedia({serveUrl,composition,codec:'h264',outputLocation:'out/product.mp4',concurrency:1,puppeteerInstance:browser,logLevel:'error'});
  }
  const report={status:'PASS',checks:results.length,motionChecks:motionResults.length,results,motionResults,elapsedSeconds:Math.round((performance.now()-started)/100)/10};
  await writeFile('out/render-check.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
} finally {await browser.close({silent:true});}
