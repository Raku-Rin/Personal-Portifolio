import * as THREE from 'three';

// Curved panels follow the measured radius, pitch and camera of the reference.
export async function createSpiral(images,{progress=()=>{},reduced=false,preview=()=>{}}={}){
 const host=document.querySelector('#spiral-scene'),canvas=document.querySelector('#spiral-canvas'),poster=document.querySelector('#spiral-poster');
 let renderer;
 try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true})}catch{return {start(){},dispose(){}}}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0x242424,0);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(50,1,.1,80),tilt=new THREE.Group(),ribbon=new THREE.Group();
 scene.add(tilt);tilt.add(ribbon);scene.add(new THREE.AmbientLight(0xffffff,.3));
 const key=new THREE.SpotLight(0xffffff,26,60,.42,.35,1);key.position.set(3,5,8);scene.add(key,key.target);
 for(const [color,intensity,x,y,z] of [[0xff7a29,3.55,-1,-4,1],[0xc3f0cc,9.55,2,1,0]]){const l=new THREE.PointLight(color,intensity);l.position.set(x,y,z);scene.add(l)}
 const tl=new THREE.TextureLoader();let loaded=0;
 const textures=await Promise.all(images.map(async({src})=>{try{const t=await tl.loadAsync(src);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),4);return t}catch{return null}finally{progress(++loaded/images.length)}}));
 const meshes=[],segments=64;
 function curve(k){const a=k/20*Math.PI*2+Math.PI/2,y=-k/90*6.6-1.5,r=2.2*(1+(1.5*Math.sin(.8*(-y/6.6)*Math.PI*2)*.15+.15)*.5);return {a,y,r,x:Math.cos(a)*r,z:Math.sin(a)*r}}
 for(let i=0;i<90;i++){
  const verts=[],uv=[],indices=[],normals=[];
  for(let j=0;j<=segments;j++){
   const u=j/segments,p=curve(i+u),q=curve(i+u+.001),half=Math.hypot(p.x-q.x,p.z-q.z)*1000*.8;
   verts.push(p.x,p.y-half,p.z,p.x,p.y+half,p.z);uv.push(1-u,0,1-u,1);normals.push(Math.cos(p.a),0,Math.sin(p.a),Math.cos(p.a),0,Math.sin(p.a));
   if(j<segments){const n=j*2;indices.push(n,n+1,n+2,n+1,n+3,n+2)}
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));g.setIndex(indices);
  const material=new THREE.MeshStandardMaterial({map:textures[i%textures.length],side:THREE.DoubleSide,roughness:1,metalness:0,toneMapped:false,transparent:true});
  const mesh=new THREE.Mesh(g,material);mesh.userData={i,radial:curve(i+.5),hover:0};ribbon.add(mesh);meshes.push(mesh);
 }
 const label=document.createElement('div');label.className='project-spiral__hover-indicator left top';label.hidden=true;const labelText=document.createElement('div');labelText.className='project-spiral__hover-indicator-label';label.append(labelText);host.append(label);
 let frame=0,active=false,visible=true,start=0,last=0,elapsed=0,hover=null;
 const pointer=new THREE.Vector2(20,20),target={x:0,y:0},ray=new THREE.Raycaster();
 function size(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=50*(1-Math.max(0,1-w/1400)*.2);camera.position.z=w<=768?14:8;camera.updateProjectionMatrix();request()}
 function request(){if(!frame&&active&&visible&&!document.hidden)frame=requestAnimationFrame(draw)}
 function draw(now){frame=0;const dt=Math.min(50,now-(last||now));last=now;elapsed+=dt;
  const mobile=innerWidth<=768,p=scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight),seconds=reduced?4:(now-start)/1000,entry=Math.min(1,seconds/3),ease=1-Math.pow(1-entry,5);
  ribbon.rotation.y=.8+p*Math.PI*2+(reduced?0:elapsed*.00002)-(1-ease)*Math.PI*3;
  ribbon.position.y=p*7;tilt.rotation.z+=(target.x-tilt.rotation.z)*.06;tilt.rotation.x+=(target.y-tilt.rotation.x)*.06;
  const cameraY=mobile?-(1-innerWidth/innerHeight)*2:-1-scrollY/1902*3;camera.position.y=reduced?cameraY:THREE.MathUtils.lerp(camera.position.y,cameraY,.1);camera.lookAt(0,camera.position.y,0);
  key.position.y=5-p*8;key.target.position.set(0,key.position.y+p*5-8,0);key.target.updateMatrixWorld();
  for(const mesh of meshes){const d=mesh.userData;d.hover+=((mesh===hover?.25:0)-d.hover)*.1;
   if(seconds>=3){mesh.position.set(Math.cos(d.radial.a)*d.hover,0,Math.sin(d.radial.a)*d.hover);mesh.scale.setScalar(1);mesh.material.opacity=1}
   else if(seconds>2)mesh.position.set(0,0,0);
   else if(seconds>1.5)mesh.position.set(0,(1-(.5-.5*Math.cos((seconds-1.5)/.5*Math.PI)))*3,0);
   else{const q=Math.max(0,Math.min(.5,seconds-d.i*.03%1))/.5,spread=(1-(.5-.5*Math.cos(q*Math.PI)))*5;mesh.scale.setScalar(1.03);mesh.material.opacity=Math.pow(Math.max(0,(q-.5)/.5),.8);mesh.position.set(Math.cos(d.radial.a)*spread,3,Math.sin(d.radial.a)*spread)}
   if(seconds>1.9&&seconds<3){const stagger=d.i*.055%.9,q=(seconds-1.9-stagger)/.5,s=seconds<1.9+stagger?1.03:q<.4?1.04:1;mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x,s,.4))}
  }
  renderer.render(scene,camera);host.dataset.ready='true';
  if(!reduced||entry<1)request();
 }
 host.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=host.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);target.x=reduced?0:-pointer.x*Math.PI/40;target.y=reduced?0:pointer.y*Math.PI/40;ray.setFromCamera(pointer,camera);hover=ray.intersectObjects(meshes,false)[0]?.object||null;canvas.style.cursor=hover?'pointer':'default';label.hidden=!hover;labelText.textContent=hover?images[hover.userData.i%images.length].label:'';label.style.left=`${e.clientX}px`;label.style.top=`${e.clientY}px`;label.style.transform=`translate(${e.clientX>innerWidth/2?'calc(-100% - 2px)':'2px'},calc(-100% - 2px))`;request()},{passive:true});
 host.addEventListener('pointerleave',()=>{target.x=target.y=0;hover=null;label.hidden=true;request()});
 host.addEventListener('click',e=>{const r=host.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(meshes,false)[0];if(hit){const image=images[hit.object.userData.i%images.length];preview(image.src,image.label)}});
 new ResizeObserver(size).observe(host);window.addEventListener('scroll',request,{passive:true});
 new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(!visible&&frame){cancelAnimationFrame(frame);frame=0}request()}).observe(document.querySelector('.hero__container'));
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else{last=0;request()}});
 size();poster.hidden=true;
 return {start(){active=true;start=performance.now();request()},dispose(){active=false;cancelAnimationFrame(frame);textures.forEach(t=>t?.dispose());meshes.forEach(m=>{m.geometry.dispose();m.material.dispose()});renderer.dispose()}};
}
