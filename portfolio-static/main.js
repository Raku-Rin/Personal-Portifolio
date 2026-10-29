import {decorateLinks,revealHeading} from './interactions.js';
const data=await fetch('./content.json').then(r=>r.json());
gsap.registerPlugin(ScrollTrigger);const media=matchMedia('(prefers-reduced-motion: reduce)'),forceReduced=new URLSearchParams(location.search).has('reduced-motion'),reduced={get matches(){return media.matches||forceReduced},addEventListener:(...args)=>media.addEventListener(...args)};document.documentElement.classList.toggle('reduced-motion',reduced.matches);
const world=document.querySelector('#world'),stage=document.querySelector('#stage');
data.hero.forEach(file=>{const f=document.createElement('figure');f.className='hero-card';f.innerHTML=`<img src="media/${file}" alt="" draggable="false">`;world.append(f);gsap.set(f,{xPercent:-50,yPercent:-50});});
document.querySelector('#portrait-fallback').src=data.portrait.poster;document.querySelector('#portrait-scene').dataset.model=data.portrait.model;
const header=document.querySelector('header'),main=document.querySelector('main');
const clamp01=v=>Math.max(0,Math.min(1,v));
function fitHeroTitle(){
 const title=document.querySelector('.hero h1'),width=title.clientWidth;
 title.querySelectorAll('.hero-title-line').forEach(line=>{line.style.fontSize='100px';const measured=line.getBoundingClientRect().width;line.style.fontSize=(100*width/measured)+'px';});
}
const cards=[...world.children];function render(){
 const initialY=innerHeight*.54,bodyTop=main.getBoundingClientRect().top;
 // Hold the hero navigation in place until the incoming page reaches it.
 // Then let the page edge carry the bar to the top without a dark backing strip.
 const navY=Math.max(0,Math.min(initialY,bodyTop));
 header.style.setProperty('--nav-y',navY+'px');
 header.classList.toggle('is-docked',navY===0);
 header.classList.toggle('is-light',bodyTop<=initialY);
 const H=innerHeight,W=innerWidth,y=reduced.matches?0:scrollY,q=Math.min(1,y/(H*.72)),travel=H*.72*(q**3-.5*q**4)+Math.max(0,y-H*.72),turn=(y*1.8+travel*.2)/H;stage.style.top=Math.max(H*(W<600?.37:.42),document.querySelector('.hero-heading').offsetTop+document.querySelector('.hero h1').offsetHeight+32)+'px';cards.forEach((f,i)=>{const t=-.45+i*1.04-turn,n=(Math.cos(t)+1)/2,r=i<2?Math.min(1,turn/(i===0?1.9:2.4)):Math.max(0,Math.min(1,(-t-.55)/1.7)),d=W<600?145:260;gsap.set(f,{x:Math.sin(t)*W*.255,y:H*.70*(-.21+i*.2)-y*.42-travel*.4,z:Math.cos(t)*d-r*d*1.23,rotationY:-Math.sin(t)*28,rotationX:3,rotationZ:Math.sin(t)*6,opacity:.5+n*.5,scale:(.64+n*.44)*(1-r*.35)});f.firstChild.style.filter=`blur(${Math.max(1-n,r*.8)*2.8}px)`;});gsap.set('.hero-heading',{y:-Math.min(y*.15,65),opacity:1-Math.min(1,y/(H*.85))});stage.style.visibility=document.querySelector('main').getBoundingClientRect().top<80?'hidden':'visible';}
ScrollTrigger.create({start:0,end:'max',onUpdate:render,onRefresh:render});window.addEventListener('resize',()=>{fitHeroTitle();render();});reduced.addEventListener('change',render);render();
document.querySelector('#categories').innerHTML=data.categories.map(c=>`<section class="category ${c.id}" id="${c.id}"><div class="copy"><h2>${c.title}</h2><p>${c.text}</p></div><figure><a class="media-link" href="works.html?project=${c.key}" aria-label="View ${c.project} preview"><div class="${c.id==='consumer'?'app-pair':c.id==='web'?'devices':'system-image'}">${c.images.map(f=>`<img loading="lazy" width="${data.imageSizes[f][0]}" height="${data.imageSizes[f][1]}" src="media/${f}" alt="${c.project} design preview">`).join('')}</div></a><figcaption><span>Selected example — ${c.project}</span><a href="works.html?project=${c.key}">View preview ↗</a></figcaption></figure></section>`).join('');
decorateLinks();
if(!reduced.matches){
 document.querySelectorAll('.opening h2,.category h2').forEach(el=>ScrollTrigger.create({trigger:el,start:'top 87%',once:true,onEnter:()=>revealHeading(el)}));
 document.querySelectorAll('.category').forEach(el=>{
 gsap.from(el.querySelector('.copy p'),{y:18,opacity:0,duration:.85,scrollTrigger:{trigger:el,start:'top 75%',once:true}});
 gsap.from(el.querySelector('figure'),{clipPath:'inset(14% 0 86% 0)',rotationX:4,y:25,duration:1.25,ease:'power3.out',scrollTrigger:{trigger:el.querySelector('figure'),start:'top 85%',once:true}});
 });
}
const menu=document.querySelector('#menu'),nav=document.querySelector('#navigation');function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='Menu';}menu.onclick=()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'Close':'Menu';if(open)nav.querySelector('a').focus();};nav.addEventListener('click',closeMenu);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
new IntersectionObserver((entries,obs)=>{if(entries[0].isIntersecting){import('./portrait.js').catch((error)=>{console.warn('Portrait module failed',error);document.querySelector('#portrait-fallback').hidden=false;});obs.disconnect();}},{rootMargin:'400px'}).observe(document.querySelector('#contact'));

fitHeroTitle();document.fonts.ready.then(()=>{fitHeroTitle();ScrollTrigger.refresh();});window.addEventListener("load",()=>ScrollTrigger.refresh());

if(location.hash){document.fonts.ready.then(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());}

if(!reduced.matches&&matchMedia('(pointer:fine)').matches){
 document.querySelectorAll('.media-link').forEach(link=>{
 const surface=link.firstElementChild;
 link.addEventListener('pointermove',e=>{const r=link.getBoundingClientRect();gsap.to(surface,{rotationY:((e.clientX-r.left)/r.width-.5)*3,rotationX:-((e.clientY-r.top)/r.height-.5)*2,scale:1.018,duration:.45,ease:'power2.out',overwrite:true});});
 const reset=()=>gsap.to(surface,{rotationX:0,rotationY:0,scale:1,duration:.55,ease:'power3.out',overwrite:true});link.addEventListener('pointerleave',reset);link.addEventListener('blur',reset);
 });
}

