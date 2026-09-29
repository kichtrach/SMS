(function(){
'use strict';
const header=document.getElementById('lmHeaderDate');
const range=document.getElementById('lmDateRange');
if(!header||!range) return;
let popup=null, current=null, mode='single', view=new Date(2024,7,1);
let single=new Date(2024,7,12), start=new Date(2024,7,1), end=new Date(2024,7,31), pickingEnd=false;
const same=(a,b)=>a&&b&&a.toDateString()===b.toDateString();
const fmt=d=>d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
function destroy(){if(popup){popup.remove();popup=null;} current=null; pickingEnd=false;}
function position(){if(!popup||!current)return;const r=current.getBoundingClientRect(),w=310,h=370;let x=Math.max(8,Math.min(r.left,innerWidth-w-8));let y=r.bottom+7;if(y+h>innerHeight-8)y=Math.max(8,r.top-h-7);popup.style.left=x+'px';popup.style.top=y+'px';}
function updateTrigger(){
 if(mode==='single'){const b=header.querySelector('b');if(b)b.textContent=single.toLocaleDateString('en-GB',{weekday:'short',day:'2-digit',month:'short',year:'numeric'});}
 else {const svg=range.querySelector('svg');const icon=svg?svg.outerHTML:'<span>📅</span>';range.innerHTML=icon+'<span>'+fmt(start)+' - '+fmt(end)+'</span>';}
}
function render(){
 const y=view.getFullYear(),m=view.getMonth(),first=new Date(y,m,1),last=new Date(y,m+1,0),lead=(first.getDay()+6)%7;
 let days='';
 for(let i=0;i<lead;i++)days+='<span class="cal-empty"></span>';
 for(let d=1;d<=last.getDate();d++){
   const dt=new Date(y,m,d), sel=mode==='single'?same(dt,single):(same(dt,start)||same(dt,end));
   const inRange=mode==='range'&&dt>=start&&dt<=end;
   days+='<button type="button" class="cal-day '+(sel?'selected ':'')+(inRange&&!sel?'in-range':'')+'" data-day="'+d+'">'+d+'</button>';
 }
 popup.innerHTML='<div class="cal-head"><button type="button" data-prev>‹</button><b>'+view.toLocaleDateString('en-US',{month:'long',year:'numeric'})+'</b><button type="button" data-next>›</button></div><div class="cal-week"><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span></div><div class="cal-days">'+days+'</div><div class="cal-foot"><button type="button" data-today>Today</button><button type="button" class="done" data-done>Done</button></div>';
 popup.querySelector('[data-prev]').onclick=()=>{view=new Date(view.getFullYear(),view.getMonth()-1,1);render();};
 popup.querySelector('[data-next]').onclick=()=>{view=new Date(view.getFullYear(),view.getMonth()+1,1);render();};
 popup.querySelector('[data-today]').onclick=()=>{const d=new Date();view=new Date(d.getFullYear(),d.getMonth(),1);if(mode==='single')single=d;else{start=d;end=new Date(d);pickingEnd=true;}updateTrigger();render();};
 popup.querySelector('[data-done]').onclick=destroy;
 popup.querySelectorAll('[data-day]').forEach(btn=>btn.onclick=()=>{
   const d=new Date(view.getFullYear(),view.getMonth(),+btn.dataset.day);
   if(mode==='single'){single=d;updateTrigger();destroy();return;}
   if(!pickingEnd){start=d;end=new Date(d);pickingEnd=true;}else{if(d<start){end=start;start=d;}else end=d;pickingEnd=false;}
   updateTrigger();render();
 });
 position();
}
function open(trigger,newMode,e){
 e&&e.preventDefault(); e&&e.stopPropagation();
 if(popup&&current===trigger){destroy();return;}
 destroy();current=trigger;mode=newMode;pickingEnd=false;
 const base=mode==='single'?single:start;view=new Date(base.getFullYear(),base.getMonth(),1);
 popup=document.createElement('div');popup.className='generic-calendar lm-calendar-v12';document.body.appendChild(popup);render();
}
header.onclick=e=>open(header,'single',e);
range.onclick=e=>open(range,'range',e);
document.addEventListener('click',function(e){if(popup&&!popup.contains(e.target)&&e.target!==header&&!header.contains(e.target)&&e.target!==range&&!range.contains(e.target))destroy();});
window.addEventListener('resize',position,{passive:true});window.addEventListener('scroll',position,{passive:true});
})();
