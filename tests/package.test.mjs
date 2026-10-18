import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,access,cp,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {PNG} from 'pngjs';

const root=path.resolve(import.meta.dirname,'..');
async function files(dir){
  const result=[];
  for(const entry of await readdir(dir,{withFileTypes:true})){
    if(['node_modules','out','.local','.git'].includes(entry.name))continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())result.push(...await files(full));else result.push(full);
  }
  return result;
}
test('every local Markdown link points to a published file',async()=>{
  for(const file of (await files(root)).filter(f=>f.endsWith('.md'))){
    const text=await readFile(file,'utf8');
    for(const match of text.matchAll(/\]\(([^)]+)\)/g)){
      const href=match[1].split('#')[0];
      if(!href||/^[a-z]+:/i.test(href))continue;
      await access(path.resolve(path.dirname(file),href));
    }
  }
});
test('social preview has the release dimensions and remains under one megabyte',async()=>{
  const bytes=await readFile(path.join(root,'assets/social-preview.png'));
  const image=PNG.sync.read(bytes);
  assert.deepEqual([image.width,image.height],[1280,640]);assert.ok(bytes.length<1_000_000);
});
test('release version matches changelog and all Remotion dependencies are pinned together',async()=>{
  const pkg=JSON.parse(await readFile(path.join(root,'package.json'),'utf8'));
  const lock=JSON.parse(await readFile(path.join(root,'package-lock.json'),'utf8'));
  assert.equal(pkg.version,lock.version);
  assert.ok((await readFile(path.join(root,'CHANGELOG.md'),'utf8')).includes(`## ${pkg.version}`));
  const versions=Object.entries(pkg.dependencies).filter(([name])=>name==='remotion'||name.startsWith('@remotion/')).map(([,v])=>v);
  assert.equal(new Set(versions).size,1);assert.match(versions[0],/^\d+\.\d+\.\d+$/);
});
test('skill copies and executes without repository dependencies',async()=>{
  const target=await mkdtemp(path.join(tmpdir(),'product-motion-skill-'));
  try{
    const skill=path.join(target,'remotion-product-motion');
    await cp(path.join(root,'skills/remotion-product-motion'),skill,{recursive:true});
    const text=await readFile(path.join(skill,'SKILL.md'),'utf8');
    assert.match(text,/^---\r?\nname: remotion-product-motion\r?\ndescription: .+\r?\n---/);
    const math=await import(pathToFileURL(path.join(skill,'scripts/motion.mjs')).href);
    assert.equal(math.selectState(30,[{frame:0,id:'before'},{frame:30,id:'after'}]),'after');
    for(const match of text.matchAll(/\]\(([^)]+)\)/g))await access(path.resolve(skill,match[1]));
  }finally{await rm(target,{recursive:true,force:true});}
});
