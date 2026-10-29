export async function initProjects({reduced,preview,navigate}) {
 const data=await fetch('./projects-content.json').then(r=>r.json());
 const tags=document.querySelector('.projects__tags'),list=document.querySelector('.projects__list');
 let observer;
 const key=s=>data.categoryKeys?.[s]||s.toLowerCase();
 function render(category,update=false){
  observer?.disconnect();
  const selected=data.filters.find(f=>key(f)===key(category)||f.toLowerCase()===category.toLowerCase())||'All';
  if(update){const url=new URL(location.href);url.searchParams.set('category',key(selected));url.hash='all';history.pushState(null,'',url);}
  tags.replaceChildren();
  data.filters.forEach(filter=>{
   const count=data.projects.filter(p=>filter==='All'||p.categories.includes(filter)).length;
   const b=document.createElement('button');b.type='button';b.className='projects__tag'+(filter===selected?' projects__tag--active':'');
   b.textContent=filter==='All'?`[ ALL (${count}) ]`:`${filter} (${count})`;
   b.setAttribute('aria-pressed',String(filter===selected));b.addEventListener('click',()=>{render(filter,true);[...tags.children].find(x=>x.getAttribute('aria-pressed')==='true')?.focus({preventScroll:true})});tags.append(b);
  });
  list.replaceChildren();
  const projects=data.projects.filter(p=>selected==='All'||p.categories.includes(selected));
  observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;observer.unobserve(e.target);if(!reduced)e.target.animate([{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'cubic-bezier(.2,.7,.2,1)'});}),{threshold:.06});
  projects.forEach((p,i)=>{
   const row=document.createElement('article');row.className='project-item';row.dataset.slug=p.slug;
   const a=document.createElement('a');a.href=`projects/${p.slug}/`;a.className='interactive';a.dataset.cursorLabel='VIEW PROJECT';a.setAttribute('aria-label',`View ${p.name}`);
   const divider=document.createElement('div');divider.className='project-item__divider project-item__divider--top';
   const content=document.createElement('div');content.className='project-item__content';
   const text=document.createElement('div');text.className='project-item__text';
   const title=document.createElement('div');title.className='project-item__title';
   const name=document.createElement('h2');name.className='project-item__name';name.textContent=p.name;
   const client=document.createElement('p');client.className='project-item__client';client.textContent=p.client;
   const desc=document.createElement('p');desc.className='project-item__description';desc.textContent=p.description;
   const cta=document.createElement('span');cta.className='project-item__link';cta.textContent='VIEW PROJECT\n⟶';
   title.append(name,client);text.append(title,desc,cta);content.append(text);
   const gallery=document.createElement('div');gallery.className='project-item__gallery';gallery.setAttribute('aria-label',`${p.name} images`);
   p.images.forEach((image,j)=>{const frame=document.createElement('div');frame.className='project-item__image';if(image.ratio){frame.classList.add('project-image-curated');frame.style.setProperty('--image-ratio',image.ratio);frame.style.setProperty('--image-fit',image.fit||'cover');frame.style.setProperty('--image-position',image.position||'50% 50%');}const img=document.createElement('img');img.src=image.src;img.alt=image.alt;img.loading=i<2?'eager':'lazy';img.decoding='async';frame.append(img);gallery.append(frame);});
   a.append(content,gallery);a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;e.preventDefault();navigate(a.href)});row.append(divider,a);list.append(row);observer.observe(row);
   if(!reduced&&matchMedia('(pointer:fine)').matches){row.addEventListener('pointermove',e=>{const r=row.getBoundingClientRect();gallery.style.setProperty('--tilt',`${((e.clientX-r.left)/r.width-.5)*2}deg`)});row.addEventListener('pointerleave',()=>gallery.style.setProperty('--tilt','0deg'));}
  });
  list.setAttribute('aria-busy','false');list.setAttribute('aria-label',`${selected}: ${projects.length} projects`);
 }
 render(new URLSearchParams(location.search).get('category')||'all');
 addEventListener('popstate',()=>render(new URLSearchParams(location.search).get('category')||'all'));
}
