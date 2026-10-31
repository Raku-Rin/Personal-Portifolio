import{createGame,turn,step}from'./engine.mjs';
const $=s=>document.querySelector(s),canvas=$('#arena'),ctx=canvas.getContext('2d');
let game=createGame(),timer=null,touch=null;
const cell=30,ink='#242424',paper='#d2d2d2',acid='#dfff00';
function draw(){
 ctx.fillStyle=ink;ctx.fillRect(0,0,960,660);
 ctx.fillStyle='#d2d2d223';for(let y=0;y<22;y++)for(let x=0;x<32;x++)ctx.fillRect(x*cell+14,y*cell+14,1,1);
 ctx.strokeStyle='#d2d2d266';ctx.lineWidth=1;ctx.strokeRect(.5,.5,959,659);
 ctx.font='24px Mono,monospace';ctx.textAlign='center';ctx.textBaseline='middle';
 for(const f of game.food){ctx.fillStyle=acid;ctx.fillText('+',f.x*cell+15,f.y*cell+16)}
 for(const [s,color]of[[game.ai,paper],[game.human,acid]])s.body.forEach((p,i)=>{
  const x=p.x*cell,y=p.y*cell;
  if(!i){ctx.fillStyle=color;ctx.fillRect(x+2,y+2,26,26);ctx.fillStyle=ink;ctx.fillText(s===game.human?'@':'×',x+15,y+16)}
  else{ctx.fillStyle=color;ctx.globalAlpha=.85;ctx.fillText(s===game.human?'#':'░',x+15,y+16);ctx.globalAlpha=1}
 });
 $('#human-score').textContent=String(game.human.score).padStart(2,'0');$('#ai-score').textContent=String(game.ai.score).padStart(2,'0');
 $('#clock').innerHTML=`${Math.max(0,Math.ceil((game.maxTicks-game.tick)*.12))}<span>S</span>`;
 $('#status').textContent={ready:'READY',playing:'LIVE',paused:'PAUSED',over:'FINAL'}[game.phase];
}
function overlay(kicker,title,copy,action){$('#overlay-kicker').textContent=kicker;$('#overlay-title').textContent=title;$('#overlay-copy').textContent=copy;$('#start').textContent=action;$('#curtain').hidden=false;$('#announcement').textContent=`${title} ${copy}`;$('#start').focus({preventScroll:true})}
function stop(){clearInterval(timer);timer=null}
function run(){stop();game.phase='playing';$('#announcement').textContent='Round in progress. Use arrow keys or W A S D to steer.';$('#curtain').hidden=true;$('#pause').disabled=false;$('#restart').disabled=false;$('#pause').textContent='[ PAUSE II ]';canvas.focus({preventScroll:true});draw();timer=setInterval(()=>{step(game);draw();if(game.phase==='over'){stop();$('#pause').disabled=true;const title={human:'YOU WIN.',ai:'MACHINE WINS.',draw:'DEAD HEAT.'}[game.result];overlay('ROUND COMPLETE',title,`YOU ${game.human.score} — ${game.ai.score} CPU. One more round?`,'[ PLAY AGAIN ↻ ]')}},120)}
function pause(){if(game.phase==='playing'){stop();game.phase='paused';draw();$('#pause').textContent='[ RESUME → ]';overlay('TAKE YOUR TIME','PAUSED.','Your next move can wait.','[ RESUME → ]')}else if(game.phase==='paused')run()}
$('#start').addEventListener('click',()=>{if(game.phase!=='paused')game=createGame();run()});
$('#pause').addEventListener('click',pause);$('#restart').addEventListener('click',()=>{game=createGame();run()});
const keys={ArrowUp:'up',ArrowRight:'right',ArrowDown:'down',ArrowLeft:'left',w:'up',d:'right',s:'down',a:'left'};
window.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const dir=keys[e.key]||keys[e.key.toLowerCase()];if(dir&&game.phase==='playing'){e.preventDefault();turn(game,dir)}else if((e.key.toLowerCase()==='p'||e.key==='Escape')&&['playing','paused'].includes(game.phase)){e.preventDefault();if(!e.repeat)pause()}});
document.querySelectorAll('[data-dir]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();turn(game,b.dataset.dir)});b.addEventListener('click',()=>turn(game,b.dataset.dir))});
canvas.addEventListener('pointerdown',e=>{touch={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!touch)return;const x=e.clientX-touch.x,y=e.clientY-touch.y;if(Math.max(Math.abs(x),Math.abs(y))<18)return;turn(game,Math.abs(x)>Math.abs(y)?x>0?'right':'left':y>0?'down':'up');touch={x:e.clientX,y:e.clientY}});
canvas.addEventListener('pointerup',()=>touch=null);canvas.addEventListener('pointercancel',()=>touch=null);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&game.phase==='playing')pause()});window.addEventListener('pagehide',stop);window.addEventListener('blur',()=>{if(game.phase==='playing')pause()});
draw();document.fonts.ready.then(draw);
