// Connected image ribbon with the approved accelerating scroll progression.
export async function createSpiral(images,{progress=()=>{},reduced=false,preview=()=>{}}={}){
 const host=document.querySelector('#spiral-scene'),hero=document.querySelector('.hero'),container=document.querySelector('.hero__container'),title=document.querySelector('.hero__title'),intro=document.querySelector('.hero__subtitle');
 host.replaceChildren();host.classList.add('card-spiral');
 const stage=document.createElement('div'),world=document.createElement('div');stage.className='card-spiral__stage';world.className='card-spiral__world';stage.append(world);host.append(stage);
 let loaded=0,active=false,frame=0;
 const sources=await Promise.all(images.map(item=>new Promise(resolve=>{const img=new Image();img.onload=()=>{progress(++loaded/images.length);resolve({...item,w:img.naturalWidth,h:img.naturalHeight})};img.onerror=()=>{progress(++loaded/images.length);resolve(null)};img.src=item.src})));
 const valid=sources.filter(Boolean),panels=[],slices=18,step=.85;
 for(let i=0;i<valid.length*3;i++){
  const item=valid[i%valid.length],button=document.createElement('button');button.className='ribbon-panel';button.type='button';button.setAttribute('aria-label','Preview '+item.label);button.addEventListener('click',()=>preview(item.src,item.label));world.append(button);
  const strips=Array.from({length:slices},()=>{const strip=document.createElement('span');strip.className='ribbon-strip';strip.style.backgroundImage='url("'+item.src+'")';button.append(strip);return strip});panels.push({button,strips,item});
 }
 function draw(){frame=0;if(!active)return;
  const H=innerHeight,W=innerWidth,edge=container.getBoundingClientRect().bottom;
  hero.style.visibility=edge<=0?'hidden':'visible';if(edge<=0)return;
  const y=reduced?0:Math.max(0,scrollY),q=Math.min(1,y/(H*.72)),travel=H*.72*(q**3-.5*q**4)+Math.max(0,y-H*.72),turn=(y*1.8+travel*.2)/H;
  const radius=W<600?W*.33:Math.min(W*.255,H*.43),width=radius*step,height=width/1.5,pitch=height*1.45/(2*Math.PI),depth=radius*.72;
  const textBottom=Math.max(title.offsetTop+title.offsetHeight,intro?intro.offsetTop+intro.offsetHeight:0);
  stage.style.top=Math.max(H*.42,textBottom+Math.max(44,H*.05))+'px';
  world.style.transform='translateY('+(height*.7-y*.42-travel*.4)+'px)';
  panels.forEach(({strips,item},i)=>{
   const imageRatio=item.w/item.h,coverWidth=Math.max(width,height*imageRatio),coverHeight=coverWidth/imageRatio;
   strips.forEach((strip,j)=>{
    const k=i+j/slices,a=-.45+k*step-turn,b=a+step/slices,x=Math.sin(a)*radius,z=Math.cos(a)*depth,sw=width/slices;
    const dx=(Math.sin(b)*radius-x)/sw,dz=(Math.cos(b)*depth-z)/sw,dy=pitch*step/slices/sw,n=(Math.cos(a)+1)/2;
    strip.style.width=(sw+1.5)+'px';strip.style.height=height+'px';strip.style.top=(-height/2)+'px';
    strip.style.backgroundSize=coverWidth+'px '+coverHeight+'px';strip.style.backgroundPosition=((width-coverWidth)/2-j*sw)+'px '+((height-coverHeight)/2)+'px';
    strip.style.transform='matrix3d('+dx+','+dy+','+dz+',0,0,1,0,0,0,0,1,0,'+x+','+(k*step*pitch)+','+z+',1)';
    strip.style.filter='blur('+(Math.max(0,.65-n)*1.2)+'px) brightness('+(.65+n*.35)+')';
   });
  });
  title.style.transform='translateY('+(-Math.min(y*.15,65))+'px)';title.style.opacity=1-Math.min(1,y/(H*.85));
  if(intro)intro.style.transform='translate(-50%,'+(-y*.6)+'px)';
 }
 function request(){if(active&&!frame&&!document.hidden)frame=requestAnimationFrame(draw)}
 window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',request);document.addEventListener('visibilitychange',request);
 host.dataset.ready='true';
 return {start(){active=true;request()},dispose(){active=false;cancelAnimationFrame(frame);window.removeEventListener('scroll',request);window.removeEventListener('resize',request);document.removeEventListener('visibilitychange',request);}};
}


