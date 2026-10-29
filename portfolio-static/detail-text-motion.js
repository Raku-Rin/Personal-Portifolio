// Detail-page text treatment, calibrated against the captured reference components.
// Reference: TextReveal (.1s base/line delay, .5s clip, .75s pulse), PixelatedTitle (350ms, four steps).
export function setupDetailTextMotion({reduced=false}={}) {
  const body=document.body;
  const blocks=[...document.querySelectorAll('.text-reveal')];
  const titles=[...document.querySelectorAll('.pixelated-title')];
  if(reduced) {
    [...blocks,...titles].forEach(el=>{el.classList.add('loaded');el.dataset.revealed='true'});
    titles.forEach(el=>el.querySelector('canvas')?.setAttribute('hidden',''));
    return;
  }

  const original=new Map();
  const measure=document.createElement('canvas').getContext('2d');
  if(!measure)return;
  const displayText=(text,style)=>style.textTransform==='uppercase'?text.toUpperCase():style.textTransform==='lowercase'?text.toLowerCase():text;
  function linesFor(node,text) {
    const style=getComputedStyle(node);
    measure.font=`${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const tracking=parseFloat(style.letterSpacing)||0;
    const width=node.clientWidth-(parseFloat(style.paddingLeft)||0)-(parseFloat(style.paddingRight)||0);
    const fits=value=>measure.measureText(displayText(value,style)).width+Math.max(0,value.length-1)*tracking<=width-1;
    const lines=[];let line='';
    for(const word of text.split(/\s+/)) {
      const next=line?`${line} ${word}`:word;
      if(line&&!fits(next)){lines.push(line);line=word}else line=next;
    }
    if(line)lines.push(line);
    return lines;
  }
  function split(block,settled=false) {
    const nodes=block.matches('p,h1,h2,h3,h4,h5,h6')?[block]:[...block.querySelectorAll('p,h1,h2,h3,h4,h5,h6')];
    let index=0;
    for(const node of nodes) {
      if(!original.has(node)) {
        if(node.children.length)continue;
        original.set(node,node.textContent.trim());
      }
      const parts=linesFor(node,original.get(node));
      const fragment=document.createDocumentFragment();
      parts.forEach((text,i)=>{
        const line=document.createElement('span');line.className='line';line.textContent=text;
        const delay=.1+index++*.1;
        line.style.animationDelay=`${delay}s`;line.style.transitionDelay=`${delay}s`;
        if(settled)Object.assign(line.style,{animation:'none',transition:'none',opacity:'1',transform:'none',clipPath:'none'});
        fragment.append(line);
        if(i<parts.length-1)fragment.append(document.createTextNode(' '));
      });
      node.replaceChildren(fragment);
    }
    block.classList.add('detail-text-reveal');
  }
  blocks.forEach(block=>split(block));
  body.classList.add('detail-motion-ready');

  function pixelate(el) {
    if(el.dataset.revealed)return;
    const canvas=el.querySelector('canvas');
    if(!canvas){el.dataset.revealed='true';return}
    const style=getComputedStyle(el),rect=el.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const dpr=Math.min(devicePixelRatio||1,2);
    const full=document.createElement('canvas');
    full.width=Math.ceil(rect.width*dpr);full.height=Math.ceil(rect.height*dpr);
    const ctx=full.getContext('2d'),out=canvas.getContext('2d');
    if(!ctx||!out){el.dataset.revealed='true';return}
    const size=parseFloat(style.fontSize),leading=parseFloat(style.lineHeight)||size*1.2;
    ctx.font=`${style.fontWeight} ${size*dpr}px ${style.fontFamily}`;
    ctx.fillStyle=style.color;ctx.letterSpacing=`${(parseFloat(style.letterSpacing)||0)*dpr}px`;
    const textLines=[];
    for(const span of el.querySelectorAll('.pixelated-title__text'))textLines.push(...linesFor(el,span.textContent.trim()));
    textLines.forEach((text,i)=>{
      ctx.textAlign=style.textAlign==='center'?'center':style.textAlign==='right'?'right':'left';
      const x=ctx.textAlign==='center'?full.width/2:ctx.textAlign==='right'?full.width-5*dpr:5*dpr;
      ctx.fillText(displayText(text,style),x,full.height-(textLines.length-1-i)*leading*dpr);
    });
    canvas.width=full.width;canvas.height=full.height;canvas.style.display='block';
    const small=document.createElement('canvas'),low=small.getContext('2d');
    if(!low){el.dataset.revealed='true';canvas.style.display='none';return}
    el.dataset.revealed='true';el.classList.add('is-pixelating');
    const start=performance.now();
    function draw(now) {
      // A frame's timestamp can precede performance.now() by a few milliseconds.
      const progress=Math.max(0,Math.min(1,(now-start)/350));
      const block=Math.max(1,[.2,.15,.1,.05][Math.min(3,Math.floor(progress*4))]*full.height);
      small.width=Math.max(1,Math.floor(full.width/block));small.height=Math.max(1,Math.floor(full.height/block));
      low.imageSmoothingEnabled=false;low.drawImage(full,0,0,small.width,small.height);
      out.clearRect(0,0,canvas.width,canvas.height);out.imageSmoothingEnabled=false;
      out.drawImage(small,0,0,canvas.width,canvas.height);
      if(progress<1)requestAnimationFrame(draw);
      else{el.classList.remove('is-pixelating');canvas.style.display='none'}
    }
    requestAnimationFrame(draw);
  }
  const metadata=[...document.querySelectorAll('.project-hero .project-client,.project-hero .project-tag')];
  metadata.forEach((el,index)=>{
    el.classList.add('detail-meta-reveal');
    el.style.setProperty('--detail-delay',`${.1+index*.1}s`);
  });
  const pending=new Set([...blocks,...titles,...metadata]);
  function reveal(target) {
    if(target.matches('.pixelated-title'))pixelate(target);else target.classList.add('loaded');
    pending.delete(target);observer.unobserve(target);
  }
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(({target,isIntersecting})=>{
      if(!isIntersecting)return;
      reveal(target);
    });
  },{threshold:.1,rootMargin:'0px 0px -10% 0px'});
  pending.forEach(el=>observer.observe(el));
  let scrollFrame=0;
  const check=()=>{
    scrollFrame=0;
    for(const el of pending) {
      const rect=el.getBoundingClientRect();
      if(!rect.width||rect.top>=innerHeight*.9)continue;
      // The source also reveals text skipped by a fast wheel/keyboard jump.
      if(el.matches('.pixelated-title')&&rect.bottom<=0)continue;
      reveal(el);
    }
  };
  const schedule=()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(check)};
  window.addEventListener('scroll',schedule,{passive:true});schedule();

  let lastWidth=innerWidth,resizeTimer;
  window.addEventListener('resize',()=>{
    if(innerWidth===lastWidth)return;
    lastWidth=innerWidth;clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>blocks.forEach(el=>split(el,el.classList.contains('loaded'))),100);
  });
  window.addEventListener('pagehide',()=>{
    observer.disconnect();clearTimeout(resizeTimer);cancelAnimationFrame(scrollFrame);
    window.removeEventListener('scroll',schedule);
  },{once:true});
}
