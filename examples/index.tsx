import React from 'react';
import {AbsoluteFill, Composition, HtmlInCanvas, registerRoot, useCurrentFrame, useVideoConfig} from 'remotion';
import {CameraMotionBlur, HtmlInCanvasMotionBlur} from '@remotion/motion-blur';
import {cameraAt, expoOut, progress, selectState} from '../skills/remotion-product-motion/scripts/motion.mjs';

const colors = {paper:'#f3f0e8',ink:'#182421',muted:'#53665e',accent:'#276750',line:'#d4dbd2'};
const cuts = [{frame:0,id:'Draft'},{frame:90,id:'Review'},{frame:150,id:'Ready'}];
// Reuse immutable track descriptions across every fractional shutter sample.
const rig={
  x:[{start:0,end:100,from:-35,to:20,ease:'out'},{start:75,end:210,from:0,to:28,ease:'in'}],
  y:[{start:0,end:210,from:12,to:-8,ease:'linear'}],
  zoom:[{start:0,end:135,from:.94,to:1.02,ease:'out'},{start:110,end:210,from:1,to:1.025,ease:'in'}],
};
type BlurProps = {children:React.ReactNode; backend?:'canvas'|'fallback'; disabled?:boolean};
const Blur = ({children,backend='canvas',disabled=false}:BlurProps) => {
  const {width,height}=useVideoConfig();
  if(disabled)return <>{children}</>;
  return backend==='canvas'&&HtmlInCanvas.isSupported()
    ? <HtmlInCanvasMotionBlur width={width} height={height} samples={8} shutterAngle={180}>{children}</HtmlInCanvasMotionBlur>
    : <CameraMotionBlur samples={8} shutterAngle={180}>{children}</CameraMotionBlur>;
};

function ProductVisual({state,outputFrame}:{state:string;outputFrame:number}) {
  const frame=useCurrentFrame();
  const {width,height}=useVideoConfig();
  const portrait=height>width;
  const camera=cameraAt(frame,rig);
  const panelWidth=portrait?570:770;
  const reveal=expoOut(progress(frame,0,24));
  return <AbsoluteFill style={{backgroundColor:colors.paper,color:colors.ink,fontFamily:'Arial, sans-serif',overflow:'hidden'}}>
    <div style={{position:'absolute',left:width/2,top:height/2,transform:`scale(${camera.zoom}) translate(${-camera.x}px, ${-camera.y}px)`}}>
      <div style={{position:'absolute',width:panelWidth,left:-panelWidth/2,top:portrait?-355:-220,opacity:reveal,transform:`translateY(${22*(1-reveal)}px)`}}>
        <div style={{fontSize:16,letterSpacing:4,color:colors.accent,fontWeight:700}}>FIELDNOTE / PRODUCT DEMO</div>
        <h1 style={{fontSize:portrait?56:60,letterSpacing:-2,lineHeight:1.05,margin:'16px 0 32px'}}>A clear path from<br/>draft to done.</h1>
        <div style={{border:`1px solid ${colors.line}`,backgroundColor:'#fff',padding:30,borderRadius:16}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
            <span style={{fontSize:24,fontWeight:700}}>Launch checklist</span>
            <span style={{fontSize:16,color:colors.accent,backgroundColor:'#e2eee5',padding:'8px 14px',borderRadius:20}}>{state}</span>
          </div>
          {['Write the brief','Review the details','Share the result'].map((label,i)=><div key={label} style={{padding:'18px 0',borderTop:`1px solid ${colors.line}`,display:'flex',alignItems:'center',gap:16,fontSize:22}}>
            <div style={{width:22,height:22,border:`2px solid ${colors.accent}`,borderRadius:7,backgroundColor:outputFrame>40+i*55?colors.accent:'transparent'}}/>{label}
          </div>)}
          <div style={{marginTop:16,height:6,backgroundColor:'#e8ede7',borderRadius:3,overflow:'hidden'}}><div style={{width:`${100*progress(frame,20,190)}%`,height:'100%',backgroundColor:colors.accent}}/></div>
        </div>
        <p style={{fontSize:17,color:colors.muted,marginTop:20}}>Synthetic interface. No customer data or external assets.</p>
      </div>
    </div>
  </AbsoluteFill>;
}
function Product(){
  // Discrete state uses the output frame, before fractional shutter sampling.
  const outputFrame=useCurrentFrame();
  const state=selectState(outputFrame,cuts);
  return <Blur><ProductVisual state={state} outputFrame={outputFrame}/></Blur>;
}

function CutContent({fixedState}:{fixedState?:string}){
  const sampleFrame=useCurrentFrame();
  const state=fixedState??selectState(sampleFrame,[{frame:0,id:'red'},{frame:30,id:'blue'}]);
  return <AbsoluteFill style={{backgroundColor:state==='red'?'rgb(255, 0, 0)':'rgb(0, 0, 255)'}}>
    <div style={{position:'absolute',left:140+(sampleFrame-30)*20,top:60,width:35,height:35,backgroundColor:'white'}}/>
  </AbsoluteFill>;
}
function CutFixture({fixed=false,backend='canvas',disabled=false}:{fixed?:boolean;backend?:'canvas'|'fallback';disabled?:boolean}){
  const state=selectState(useCurrentFrame(),[{frame:0,id:'red'},{frame:30,id:'blue'}]);
  return <Blur backend={backend} disabled={disabled}><CutContent fixedState={fixed?state:undefined}/></Blur>;
}
const Root=()=> <>
  <Composition id="ProductLandscape" component={Product} width={1280} height={720} fps={30} durationInFrames={210}/>
  <Composition id="ProductPortrait" component={Product} width={720} height={1280} fps={30} durationInFrames={210}/>
  <Composition id="CutFixture" component={CutFixture} width={320} height={180} fps={30} durationInFrames={60} defaultProps={{fixed:false,backend:'canvas' as const}}/>
</>;
registerRoot(Root);
