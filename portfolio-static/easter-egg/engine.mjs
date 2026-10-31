export const DIRS={up:{x:0,y:-1},right:{x:1,y:0},down:{x:0,y:1},left:{x:-1,y:0}};
const key=p=>`${p.x},${p.y}`;
const same=(a,b)=>a.x===b.x&&a.y===b.y;
export function createGame(random=Math.random){
 const g={width:32,height:22,tick:0,maxTicks:500,phase:'ready',result:null,random,food:[],
  human:{body:[{x:7,y:10},{x:6,y:10},{x:5,y:10}],dir:'right',next:'right',score:0},
  ai:{body:[{x:24,y:11},{x:25,y:11},{x:26,y:11}],dir:'left',next:'left',score:0}};
 replenish(g);return g;
}
function replenish(g){
 const used=new Set([...g.human.body,...g.ai.body,...g.food].map(key));
 const free=[];for(let y=0;y<g.height;y++)for(let x=0;x<g.width;x++)if(!used.has(`${x},${y}`))free.push({x,y});
 while(g.food.length<3&&free.length){const i=Math.floor(g.random()*free.length);g.food.push(free.splice(i,1)[0])}
}
export function turn(g,dir){
 if(!DIRS[dir]||g.phase!=='playing')return false;
 const a=DIRS[g.human.dir],b=DIRS[dir];
 if(a.x+b.x===0&&a.y+b.y===0)return false;
 g.human.next=dir;return true;
}
function inside(g,p){return p.x>=0&&p.x<g.width&&p.y>=0&&p.y<g.height}
function nextHead(s,dir){const d=DIRS[dir];return{x:s.body[0].x+d.x,y:s.body[0].y+d.y}}
export function chooseAI(g){
 // Read the current board only; the AI does not see the player's queued input.
 const blocked=new Set([...g.human.body,...g.ai.body.slice(0,-1)].map(key));
 const candidates=Object.keys(DIRS).filter(d=>{const a=DIRS[g.ai.dir],b=DIRS[d];return a.x+b.x!==0||a.y+b.y!==0});
 const ranked=candidates.map(dir=>{
  const p=nextHead(g.ai,dir);if(!inside(g,p)||blocked.has(key(p)))return{dir,value:-1e6};
  const queue=[{...p,d:0}],seen=new Set([key(p)]);let foodDistance=1000;
  for(let i=0;i<queue.length;i++){
   const q=queue[i];if(g.food.some(f=>same(f,q)))foodDistance=Math.min(foodDistance,q.d);
   for(const d of Object.values(DIRS)){const n={x:q.x+d.x,y:q.y+d.y,d:q.d+1},k=key(n);if(inside(g,n)&&!blocked.has(k)&&!seen.has(k)){seen.add(k);queue.push(n)}}
  }
  const nearPlayer=Math.abs(p.x-g.human.body[0].x)+Math.abs(p.y-g.human.body[0].y)<=1;
  const enough=seen.size>=g.ai.body.length+8;
  return{dir,value:(enough?1000:0)+Math.min(seen.size,80)*2-foodDistance*4-(nearPlayer?120:0)+(dir===g.ai.dir?0.5:0)};
 });
 ranked.sort((a,b)=>b.value-a.value);return ranked[0].dir;
}
export function step(g,aiDirection){
 if(g.phase!=='playing')return;
 const dirs=[g.human.next,aiDirection||chooseAI(g)],snakes=[g.human,g.ai];
 const heads=snakes.map((s,i)=>nextHead(s,dirs[i]));
 const eating=heads.map(p=>g.food.some(f=>same(f,p)));
 const occupied=new Set(snakes.flatMap((s,i)=>eating[i]?s.body:s.body.slice(0,-1)).map(key));
 const headOn=same(heads[0],heads[1]);
 const dead=heads.map(p=>!inside(g,p)||occupied.has(key(p))||headOn);
 g.tick++;
 if(dead.some(Boolean)){g.phase='over';g.result=dead.every(Boolean)?'draw':dead[0]?'ai':'human';return}
 snakes.forEach((s,i)=>{s.dir=dirs[i];s.next=dirs[i];s.body.unshift(heads[i]);if(eating[i])s.score++;else s.body.pop()});
 g.food=g.food.filter(f=>!heads.some(p=>same(f,p)));replenish(g);
 if(g.tick>=g.maxTicks){g.phase='over';g.result=g.human.score===g.ai.score?'draw':g.human.score>g.ai.score?'human':'ai'}
}
