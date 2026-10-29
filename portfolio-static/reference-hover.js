// Reference interactions: compact targets get corner brackets; labelled targets get a floating CTA.
export function setupReferenceHover(reduced){
 if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
 document.querySelector('#pointer-cross')?.remove();
 const cursor=document.createElement('div');cursor.className='custom_cursor__cursor';cursor.setAttribute('aria-hidden','true');
 cursor.innerHTML='<div class="custom_cursor__inner"><div class="custom_cursor__center"></div></div><div class="custom_cursor__crosshair custom_cursor__crosshair--top"></div><div class="custom_cursor__crosshair custom_cursor__crosshair--right"></div><div class="custom_cursor__crosshair custom_cursor__crosshair--bottom"></div><div class="custom_cursor__crosshair custom_cursor__crosshair--left"></div><div class="custom_cursor__link UI_1"><span class="arrow-link"><span class="arrow-link__label"><span class="arrow-link__label-text"></span></span><span class="arrow-link__arrow"></span></span><div class="top-left"></div><div class="top-right"></div><div class="bottom-left"></div><div class="bottom-right"></div></div>';
 document.body.append(cursor);
 const card=cursor.querySelector('.custom_cursor__link'),text=card.querySelector('.arrow-link__label-text'),lines=[...cursor.querySelectorAll('.custom_cursor__crosshair')];
 let target=null,cover=null,x=0,y=0,tx=0,ty=0,frame=0,last=0,visible=false,freePointer=false;
 function classify(node){
  target?.classList.remove('custom_cursor__current-link');
  freePointer=!!node?.closest('#spiral-scene');
  target=freePointer?null:node?.closest('a,button,.interactive')||null;cover=null;
  const disabled=node?.closest('.custom_cursor__disable-hover');
  const labelled=target&&!disabled?node.closest('[data-cursor-label]'):null;
  cursor.classList.toggle('custom_cursor__hovering',!!target&&!disabled);
  card.classList.toggle('custom_cursor__link--visible',!!labelled);
  text.textContent=labelled?.dataset.cursorLabel||'';
  if(target&&!labelled&&!disabled){const r=target.getBoundingClientRect();if(r.width*r.height<10000){cover=target;target.classList.add('custom_cursor__current-link')}}
  cursor.classList.toggle('custom_cursor__covering',!!cover);request();
 }
 function request(){if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(draw)}
 function draw(now){frame=0;const dt=Math.min(50,now-(last||now-16));last=now;const r=cover?.getBoundingClientRect(),px=r?r.left+r.width/2:tx,py=r?r.top+r.height/2:ty,a=r||reduced||freePointer?1:Math.min(1,dt*.01);x+=(px-x)*a;y+=(py-y)*a;
  cursor.style.left=`${x}px`;cursor.style.top=`${y}px`;
  const [top,right,bottom,left]=lines;
  Object.assign(top.style,{left:`${x}px`,height:`${Math.max(0,y-(r?.height||0)/2)}px`});
  Object.assign(bottom.style,{left:`${x}px`,top:`${y+(r?.height||0)/2}px`,height:`${Math.max(0,innerHeight-y-(r?.height||0)/2)}px`});
  Object.assign(left.style,{top:`${y}px`,width:`${Math.max(0,x-(r?.width||0)/2)}px`});
  Object.assign(right.style,{top:`${y}px`,left:`${x+(r?.width||0)/2}px`,width:`${Math.max(0,innerWidth-x-(r?.width||0)/2)}px`});
  if(r){cursor.style.setProperty('--cover-width',`${r.width}px`);cursor.style.setProperty('--cover-height',`${r.height}px`)}
  if(Math.abs(x-px)+Math.abs(y-py)>.1)request();
 }
 document.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;tx=e.clientX;ty=e.clientY;visible=true;cursor.classList.add('custom_cursor__visible');request()},{passive:true});
 document.addEventListener('pointerover',e=>{if(e.pointerType!=='touch')classify(e.target)});
 document.documentElement.addEventListener('pointerleave',()=>{visible=false,freePointer=false;cursor.classList.remove('custom_cursor__visible');classify(null)});
 window.addEventListener('scroll',()=>{classify(document.elementFromPoint(tx,ty));request()},{passive:true});
 window.addEventListener('resize',request);
}

export function setupImageFollow(reduced){
 if(reduced||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
 const groups=[...document.querySelectorAll('.follow-pointer')];let frame=0,point=null;
 function paint(){frame=0;if(!point)return;for(const group of groups){const r=group.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)continue;
  const rx=Math.max(-10,Math.min(10,-(point.y-r.top-r.height/2)/innerHeight*20));
  const ry=Math.max(-10,Math.min(10,(point.x-r.left-r.width/2)/innerWidth*20));
  group.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`;
 }}
 function schedule(){if(!frame)frame=requestAnimationFrame(paint)}
 window.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;point={x:e.clientX,y:e.clientY};schedule()},{passive:true});
 window.addEventListener('scroll',schedule,{passive:true});
 document.documentElement.addEventListener('pointerleave',()=>{point=null;groups.forEach(group=>group.style.transform='none')});
}

export function setupCapabilityAccordion(reduced){
 const rows=[...document.querySelectorAll('.home-body__capability-item')],base=1.6667,expanded=3;
 const values=rows.map(()=>({padding:base}));let tween;
 function activate(index){
  tween?.kill();const initial=values.map(v=>v.padding),state={p:0};
  const paint=()=>{const raw=initial.map((v,i)=>v+((i===index?expanded:base)-v)*state.p),factor=rows.length*base/raw.reduce((a,b)=>a+b,0);
   rows.forEach((row,i)=>{values[i].padding=raw[i];row.querySelectorAll('.label,.number').forEach(el=>{el.style.padding=`${raw[i]*factor}vw 0vw`})});};
  if(reduced||!window.gsap){state.p=1;paint()}else tween=window.gsap.to(state,{p:1,duration:.4,ease:'power2.out',onUpdate:paint});
 }
 rows.forEach((row,i)=>{row.addEventListener('pointerenter',()=>activate(i));row.addEventListener('pointerleave',()=>activate(-1));row.addEventListener('focus',()=>activate(i));row.addEventListener('blur',()=>activate(-1))});
 const list=document.querySelector('.home-body__capabilities-list'),image=document.querySelector('.home-body__image-2');let frame;
 function position(){frame=0;if(!list||!image)return;const r=list.getBoundingClientRect(),p=Math.max(0,Math.min(1,(innerHeight*.2-r.top)/(innerHeight*.5)));image.style.transform=`translateY(${p*(r.height-image.offsetHeight)}px)`}
 function schedule(){if(!frame)frame=requestAnimationFrame(position)}
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);position();
}
