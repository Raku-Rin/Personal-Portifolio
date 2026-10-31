import {setupReferenceHover,setupCapabilityAccordion,setupImageFollow} from './reference-hover.js?v=20261029-free-pointer';
import {createSpiral} from './card-spiral.js?v=20261029-fixed-intro';
const $=(s,root=document)=>root.querySelector(s),$$=(s,root=document)=>[...root.querySelectorAll(s)];
const materials=await fetch('./material-slots.json',{cache:'no-store'}).then(r=>r.json());
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches||new URLSearchParams(location.search).has('reduced-motion');
document.body.classList.toggle('reduced-motion',reduced);
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const dialog=$('#image-preview');
$$('.static-media > img').forEach((img,i)=>img.src=i===0?materials.bodyStill:materials.studioStill);
const aboutPortrait=$('.home-body__main .static-media > img');if(aboutPortrait&&materials.bodyCrop){aboutPortrait.classList.add('about-portrait');aboutPortrait.style.setProperty('--portrait-scale',materials.bodyCrop.scale);aboutPortrait.style.objectPosition=materials.bodyCrop.position;aboutPortrait.style.transformOrigin=materials.bodyCrop.origin;}
if($('#spiral-poster'))$('#spiral-poster').src=materials.heroFallback;
if($('#inline-loader img'))$('#inline-loader img').src=materials.openingGraphic;
function preview(src,label='Project image'){if(!dialog)return;$('img',dialog).src=src;$('img',dialog).alt=label;dialog.showModal()}
$('button',dialog)?.addEventListener('click',()=>dialog.close());dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});

// A brief coarse-pixel wipe is shared by the menu and local page navigation.
const grid=$('#transition-grid');let wiping=false;
async function wipe(change){if(wiping)return;wiping=true;if(reduced){await change();wiping=false;return}
 const cols=24,rows=Math.ceil(innerHeight/innerWidth*cols),cells=Array.from({length:cols*rows},(_,i)=>i);
 for(let i=cells.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[cells[i],cells[j]]=[cells[j],cells[i]]}
 grid.width=cols;grid.height=rows;grid.style.display='block';const ctx=grid.getContext('2d');ctx.fillStyle='#242424';
 function phase(fill){return new Promise(resolve=>{let start;function tick(now){start??=now;const n=Math.ceil(Math.min(1,(now-start)/240)*cells.length);for(let k=0;k<n;k++){const i=cells[k];fill?ctx.fillRect(i%cols,Math.floor(i/cols),1,1):ctx.clearRect(i%cols,Math.floor(i/cols),1,1)}if(n<cells.length)requestAnimationFrame(tick);else resolve()}requestAnimationFrame(tick)})}
 await phase(true);await change();await phase(false);grid.style.display='none';wiping=false;
}
const menu=$('.navigation__menubutton'),overlay=$('.navigation__overlay'),logo=$('.navigation__logo'),nav=$('.navigation__menu:not(.navigation__background)'),bg=$('.navigation__background'),hero=$('.hero__container');let menuOpen=false;
function navPosition(){if(!menu)return;const h=menu.getBoundingClientRect().height,w=innerWidth,edge=hero?hero.getBoundingClientRect().bottom:0,rest=w<=768?0:w*(w<=1280?.289:.27),y=menuOpen?0:Math.max(0,Math.min(rest,edge-h));
 document.documentElement.style.setProperty('--nav-y',`${y}px`);document.documentElement.style.setProperty('--nav-h',`${h}px`);
 const light=!menuOpen&&edge<=y+h+.5;document.body.classList.toggle('nav-light',light);logo.classList.toggle('navigation__logo--fixed',light);logo.classList.toggle('navigation__logo--dark',menuOpen);nav?.classList.toggle('navigation__menu--fixed',light);nav?.classList.toggle('navigation__menu--on-top',menuOpen);
}
async function setMenu(open){if(open===menuOpen||wiping)return;await wipe(()=>{menuOpen=open;document.body.classList.toggle('menu-open',open);overlay.classList.toggle('navigation__overlay--open',open);overlay.setAttribute('aria-hidden',String(!open));overlay.inert=!open;menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'CLOSE':'MENU';navPosition();if(open)$('a',overlay).focus({preventScroll:true});else menu.focus({preventScroll:true})})}
if(overlay)overlay.inert=true;
menu?.addEventListener('click',()=>setMenu(!menuOpen));menu?.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();setMenu(!menuOpen)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuOpen)setMenu(false);if(e.key==='Tab'&&menuOpen){const items=[menu,...$$('a',overlay)],i=items.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();items.at(-1).focus()}else if(!e.shiftKey&&i===items.length-1){e.preventDefault();items[0].focus()}}});
window.addEventListener('scroll',navPosition,{passive:true});window.addEventListener('resize',navPosition);navPosition();

// Short wheel interpolation on desktop; native touch and keyboard scrolling stay intact.
if(!reduced&&matchMedia('(pointer:fine)').matches){let target=scrollY,raf=0,previous=0;
 const stop=()=>{cancelAnimationFrame(raf);raf=0;target=scrollY};
 function tick(now){const dt=Math.min(40,now-(previous||now-16));previous=now;const y=scrollY+(target-scrollY)*(1-Math.exp(-dt/105));window.scrollTo(0,y);if(Math.abs(target-scrollY)>1)raf=requestAnimationFrame(tick);else{window.scrollTo(0,target);raf=0}}
 window.addEventListener('wheel',e=>{if(e.ctrlKey||menuOpen||dialog?.open||document.body.classList.contains('loading')||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;e.preventDefault();if(!raf)target=scrollY;const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);target=Math.max(0,Math.min(document.documentElement.scrollHeight-innerHeight,target+delta));if(!raf){previous=0;raf=requestAnimationFrame(tick)}},{passive:false});
 window.addEventListener('keydown',stop);window.addEventListener('pointerdown',stop);window.addEventListener('resize',stop);
}

// Source title treatment: draw actual type, reduce bitmap resolution, restore crisp type.
function pixelTitle(el){if(el.dataset.revealed||!el.offsetWidth)return;el.dataset.revealed='true';if(reduced)return;
 const canvas=$('canvas',el),spans=$$('.pixelated-title__text',el);if(!canvas)return;const r=el.getBoundingClientRect(),s=getComputedStyle(el),scale=Math.min(devicePixelRatio,2),full=document.createElement('canvas');full.width=Math.ceil(r.width*scale);full.height=Math.ceil(r.height*scale);const c=full.getContext('2d');c.scale(scale,scale);c.font=`${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;c.fillStyle=s.color;c.textBaseline='alphabetic';c.letterSpacing=s.letterSpacing;
 const lines=spans.flatMap(n=>{const text=s.textTransform==='uppercase'?n.textContent.trim().toUpperCase():n.textContent.trim();const result=[];let line='';for(const word of text.split(/\s+/)){const next=line?line+' '+word:word;if(line&&c.measureText(next).width>r.width+1){result.push(line);line=word}else line=next}result.push(line);return result}),font=parseFloat(s.fontSize),lh=parseFloat(s.lineHeight);lines.forEach((t,i)=>{c.textAlign=s.textAlign==='center'?'center':'left';c.fillText(t,c.textAlign==='center'?r.width/2:0,i*lh+font*.76)});
 el.classList.add('is-pixelating');const ctx=canvas.getContext('2d');let start;function tick(now){start??=now;const p=Math.min(1,(now-start)/430),factor=[.025,.04,.065,.12,1][Math.min(4,Math.floor(p*5))];canvas.width=Math.max(1,Math.round(full.width*factor));canvas.height=Math.max(1,Math.round(full.height*factor));ctx.imageSmoothingEnabled=false;ctx.drawImage(full,0,0,canvas.width,canvas.height);if(p<1)requestAnimationFrame(tick);else{el.classList.remove('is-pixelating');canvas.style.display='none'}}requestAnimationFrame(tick);
}
function reveals(){const gs=window.gsap;if(gs&&window.ScrollTrigger)gs.registerPlugin(window.ScrollTrigger);
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;if(el.matches('.pixelated-title'))pixelTitle(el);else{el.classList.add('loaded');if(!reduced&&gs)gs.fromTo(el,{y:14,opacity:0},{y:0,opacity:1,duration:.65,ease:'power2.out',clearProps:'transform,opacity'})}observer.unobserve(el)}),{threshold:.08});
 $$('.pixelated-title,.text-reveal,.element-reveal').forEach(el=>{if(document.body.classList.contains('project-detail-page')&&el.matches('.pixelated-title,.text-reveal'))return;observer.observe(el)});
 $$('.pixelated-image-reveal__content').forEach(el=>{el.classList.add('local-image-reveal');if(!reduced&&gs){gs.from(el,{clipPath:'inset(16% 0 16% 0)',rotateY:-6,rotateZ:-1.2,scale:.96,duration:1,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%',once:true},clearProps:'clipPath,transform'});const img=$('img',el);if(img){el.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=el.getBoundingClientRect();gs.to(el,{rotateY:((e.clientX-r.left)/r.width-.5)*4,rotateX:-((e.clientY-r.top)/r.height-.5)*3,duration:.6})});el.addEventListener('pointerleave',()=>gs.to(el,{rotateY:0,rotateX:0,duration:.7}))}}});
}
const cross=$('#pointer-cross');document.addEventListener('pointermove',e=>{cross?.style.setProperty('--px',`${e.clientX}px`);cross?.style.setProperty('--py',`${e.clientY}px`);const x=$('.navigation__mousecoords-x'),y=$('.navigation__mousecoords-y');if(x)x.textContent=`X : ${String(Math.round(e.clientX)).padStart(5,' ')}`;if(y)y.textContent=`Y : ${String(Math.round(e.clientY)).padStart(5,' ')}`},{passive:true});
const capability=$('.glitch-transition');
if(capability){
 const img=document.createElement('img');
 img.src=materials.capabilityDefault;img.alt=materials.capabilityAltTexts?.[0]||'Selected project preview';capability.append(img);
 materials.capabilityStills.forEach(src=>{const preload=new Image();preload.src=src});
 $$('.home-body__capability-item').forEach((row,i)=>{
  const label=$('.label',row).textContent;
  row.tabIndex=0;if(row.tagName!=='A'){row.setAttribute('role','button');row.setAttribute('aria-label',`Preview ${label}`);}
  const show=()=>{
   img.src=materials.capabilityStills[i];img.alt=materials.capabilityAltTexts?.[i]||label;
   if(!reduced)img.animate([{transform:'translateX(-2px)',opacity:.6},{transform:'translateX(2px)',opacity:1},{transform:'translateX(0)',opacity:1}],{duration:100});
  };
  row.addEventListener('pointerenter',show);row.addEventListener('focus',show);
  row.addEventListener('click',()=>{show();if(row.tagName!=='A')preview(materials.capabilityStills[i],label)});
  row.addEventListener('keydown',e=>{if(row.tagName!=='A'&&(e.key==='Enter'||e.key===' ')){e.preventDefault();show();preview(materials.capabilityStills[i],label)}});
 });
}
const banner=$('#cookie-banner');let dismissed=false;try{dismissed=!!localStorage.getItem('dialect-local-cookie-choice')}catch{}if(banner){banner.hidden=dismissed;$$('button',banner).forEach(b=>b.addEventListener('click',()=>{try{localStorage.setItem('dialect-local-cookie-choice',b.textContent.trim())}catch{}banner.hidden=true}))}

$$('a[href]').forEach(a=>a.addEventListener('click',async e=>{const href=a.getAttribute('href');if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
 if(href.startsWith('#')){const target=$(href);if(!target)return;e.preventDefault();if(menuOpen)await setMenu(false);history.pushState(null,'',href);window.scrollTo({top:target.getBoundingClientRect().top+scrollY-36,behavior:reduced?'instant':'smooth'});return}
 if(href==='./'||href.startsWith('./#')||href.startsWith('projects/')||href==='easter-egg/'||href==='gallery.html'||href==='credits.html'){e.preventDefault();const destination=new URL(href,document.baseURI).href;await wipe(()=>{location.href=destination})}
}));
const portrait=$('#portrait-scene');if(portrait){portrait.dataset.model=materials.portraitModel;$('#portrait-fallback').src=materials.portraitPoster;const io=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){import('./portrait.js?v=20261025-final');io.disconnect()}},{rootMargin:'700px'});io.observe(portrait);$('#portrait-reset')?.addEventListener('click',()=>portrait.dispatchEvent(new Event('portrait-reset')))}

async function boot(){if(document.body.classList.contains('project-detail-page')){await document.fonts.ready;const {setupDetailTextMotion}=await import('./detail-text-motion.js?v=20261028-2');setupDetailTextMotion({reduced});document.body.classList.add('loaded');reveals();navPosition();document.documentElement.dataset.ready='true';return;}if(document.body.classList.contains('projects-page')){const {initProjects}=await import('./projects.js?v=details-20261027');await initProjects({reduced,preview,navigate:destination=>wipe(()=>{location.href=destination})});await document.fonts.ready;document.body.classList.add('loaded');reveals();navPosition();document.documentElement.dataset.ready='true';return;}const loader=$('#inline-loader');document.body.classList.toggle('loading',!!loader);const started=performance.now();const config=await fetch('./reference-content.json',{cache:'no-store'}).then(r=>r.json());
 if(document.body.classList.contains('gallery-page')){const grid=$('.gallery-grid'),seen=new Set();config.spiralImages.forEach(image=>{if(seen.has(image.label))return;seen.add(image.label);const button=document.createElement('button');button.className='gallery-card';const img=document.createElement('img');img.src=image.src;img.alt=image.label;img.loading='lazy';const text=document.createElement('span');text.textContent=image.label;button.append(img,text);button.addEventListener('click',()=>preview(image.src,image.label));grid.append(button)});return}
 const report=p=>{if($('#inline-loader-pct'))$('#inline-loader-pct').textContent=Math.round(p*100);if($('#inline-loader-progress'))$('#inline-loader-progress').style.width=`${p*100}%`};
 let spiral;try{spiral=await createSpiral(materials.heroImages||config.spiralImages,{progress:report,reduced,preview});await document.fonts.ready}catch(e){console.warn('Spiral fallback:',e.message)}
 report(1);await wait(Math.max(0,(reduced?0:1300)-(performance.now()-started)));loader?.classList.add('done');document.body.classList.remove('loading');document.body.classList.add('loaded');spiral?.start();reveals();navPosition();await wait(300);if(loader)loader.hidden=true;
 if(location.hash){const target=$(location.hash);if(target)window.scrollTo({top:target.getBoundingClientRect().top+scrollY-36,behavior:'instant'})}
 document.documentElement.dataset.ready='true';
}
setupReferenceHover(reduced);setupCapabilityAccordion(reduced);setupImageFollow(reduced);
boot().catch(e=>{console.error(e);$('#inline-loader')?.remove();document.body.classList.remove('loading');reveals()});
