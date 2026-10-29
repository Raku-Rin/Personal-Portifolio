import * as THREE from 'three';
import {GLTFLoader} from './vendor/loaders/GLTFLoader.js';
import {DRACOLoader} from './vendor/loaders/DRACOLoader.js';
const host=document.querySelector('#portrait-scene'),canvas=document.querySelector('#portrait'),poster=document.querySelector('#portrait-fallback');
const params=new URLSearchParams(location.search),motion=matchMedia('(prefers-reduced-motion: reduce)');
const reduced=()=>motion.matches||params.has('reduced-motion');
let renderer,decoder;
try {
 if(params.has('static-portrait')) throw new Error('Static portrait requested');
 renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,preserveDrawingBuffer:params.has('export-portrait')});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(50,1,.1,100);camera.position.set(0,0,5);
 scene.add(new THREE.AmbientLight(0xffffff,1));
 [[0x8888ff,9,10,10,5],[0xddff88,3,-10,-10,-5],[0xddff44,12,0,5,-8]].forEach(([color,intensity,x,y,z])=>{const light=new THREE.DirectionalLight(color,intensity);light.position.set(x,y,z);scene.add(light)});
 decoder=new DRACOLoader().setDecoderPath('./vendor/draco/').setWorkerLimit(1);
 const loader=new GLTFLoader().setDRACOLoader(decoder),gltf=await loader.loadAsync(host.dataset.model||'./media/reference/simon-hathaway.glb');
 const model=gltf.scene;model.scale.setScalar(15);model.rotation.y=Math.PI*6/7;model.position.set(-.4,-12.9,-2);scene.add(model);
 // Pose the supplied animation once; pointer tracking owns only the upper-body bones.
 const mixer=new THREE.AnimationMixer(model);gltf.animations.forEach(c=>mixer.clipAction(c).play());mixer.update(0);
 const bones=[];model.traverse(n=>{if(n.isBone&&['spine3','neck','head'].includes(n.name))bones.push({node:n,multiplier:{spine3:.125,neck:.25,head:.4}[n.name]})});
 host.dataset.loaded='true';host.dataset.bones=String(bones.length);poster.hidden=true;
 let target={x:0,y:0},current={x:0,y:0},frame=0,visible=true,last=0;
 const aim=new THREE.Vector3(),world=new THREE.Vector3(),matrix=new THREE.Matrix4(),quat=new THREE.Quaternion(),up=new THREE.Vector3(0,1,0);
 function request(){if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(draw)}
 function draw(now){frame=0;const dt=Math.min(.05,(now-(last||now-16))/1000);last=now;let error=0;
  current.x+=(target.x-current.x)*.1;current.y+=(target.y-current.y)*.1;error=Math.max(Math.abs(target.x-current.x),Math.abs(target.y-current.y));
  mixer.update(dt);model.updateMatrixWorld(true);
  for(const {node,multiplier:m} of bones){const x=reduced()?0:current.x,y=reduced()?0:current.y;aim.set(-x*(.5+.5*m)-.3,y*m*1.2-.35,1).unproject(camera).sub(node.getWorldPosition(world));matrix.lookAt(node.position,aim,up);quat.setFromRotationMatrix(matrix);node.quaternion.slerp(quat,.1);}
  renderer.render(scene,camera);if(error>.0003)request();
 }
 function resize(){const r=host.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();model.position.y=innerWidth<=768?-13.4:-12.9;request()}
 new ResizeObserver(resize).observe(host);
 window.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=host.getBoundingClientRect();target={x:THREE.MathUtils.clamp(e.clientX/innerWidth*2-1,-1,1),y:THREE.MathUtils.clamp(-(e.clientY-r.top)/r.height*2+1,-1,1)};request()},{passive:true});
 host.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')host.setPointerCapture(e.pointerId)});
 host.addEventListener('pointermove',e=>{if(e.pointerType==='touch'&&host.hasPointerCapture(e.pointerId)){const r=host.getBoundingClientRect();target={x:(e.clientX-r.left)/r.width*2-1,y:0};request()}},{passive:true});
 host.addEventListener('portrait-reset',()=>{target={x:0,y:0};request()});
 document.documentElement.addEventListener('pointerleave',()=>{target={x:0,y:0};request()});
 new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(!visible&&frame){cancelAnimationFrame(frame);frame=0}request()}).observe(host);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&frame){cancelAnimationFrame(frame);frame=0}request()});motion.addEventListener('change',request);
 resize();decoder.dispose();
 if(params.has('export-portrait')){const button=document.createElement('button');button.textContent='Export transparent portrait';button.style.cssText='position:fixed;left:16px;top:50px;z-index:20000;padding:12px;background:#dfff00;color:#242424';document.body.append(button);button.addEventListener('click',()=>{renderer.render(scene,camera);let a=document.querySelector('#portrait-export-link');if(!a){a=document.createElement('a');a.id='portrait-export-link';a.style.cssText='position:fixed;left:16px;top:100px;z-index:20000;padding:12px;background:#dfff00;color:#242424';document.body.append(a)}a.href=canvas.toDataURL('image/png');a.download='simon-render-fallback.png';a.textContent='Save transparent PNG'})}

} catch(error){host.dataset.loaded='false';canvas.hidden=true;poster.hidden=false;renderer?.dispose();decoder?.dispose();console.warn('Portrait fallback:',error.message)}
