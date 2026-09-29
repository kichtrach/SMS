(()=>{
  'use strict';
  let popup=null, owner=null, mode=null;
  let single=new Date(2024,7,12), start=new Date(2024,7,1), end=new Date(2024,7,31), view=new Date(2024,7,1), rangePhase=0;
  const isTrigger=t=>t.closest && t.closest('.date-chip,.lm-filters .range');
  const same=(a,b)=>a&&b&&a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();
  const fmt=d=>d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
  function close(){ if(popup) popup.remove(); popup=null; owner=null; mode=null; rangePhase=0; }
  function place(){ if(!popup||!owner)return; const r=owner.getBoundingClientRect(), w=310, h=365; let left=Math.min(Math.max(8,r.left),window.innerWidth-w-8); let top=r.bottom+6; if(top+h>window.innerHeight-8) top=Math.max(8,r.top-h-6); Object.assign(popup.style,{left:left+'px',top:top+'px'}); }
  function sync(){
    if(!owner)return;
    if(mode==='single'){
      const b=owner.querySelector('b'); if(b)b.textContent=single.toLocaleDateString('en-GB',{weekday:'short',day:'2-digit',month:'short',year:'numeric'});
    }else{
      const icon=owner.querySelector('svg')?.outerHTML||''; owner.innerHTML=icon+fmt(start)+' - '+fmt(end);
    }
  }
  function paint(){
    if(!popup)return; const y=view.getFullYear(),m=view.getMonth(),first=new Date(y,m,1),last=new Date(y,m+1,0),lead=(first.getDay()+6)%7;
    let cells='';
    for(let i=0;i<lead;i++) cells+='<span class="cal-empty"></span>';
    for(let d=1;d<=last.getDate();d++){
      const dt=new Date(y,m,d), selected=mode==='single'?same(dt,single):(same(dt,start)||same(dt,end));
      const inside=mode==='range' && dt>=start && dt<=end;
      cells+=`<button type="button" data-v11-day="${d}" class="${selected?'selected':''} ${inside&&!selected?'in-range':''}">${d}</button>`;
    }
    popup.innerHTML=`<div class="cal-head"><button type="button" data-v11-prev>‹</button><b>${view.toLocaleDateString('en-US',{month:'long',year:'numeric'})}</b><button type="button" data-v11-next>›</button></div><div class="cal-week"><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span></div><div class="cal-days">${cells}</div><div class="cal-foot"><button type="button" data-v11-today>Today</button><button type="button" class="done" data-v11-done>Done</button></div>`;
    place();
  }
  function open(trigger){
    const newMode=trigger.classList.contains('date-chip')?'single':'range';
    if(popup && owner===trigger){close();return;}
    close(); owner=trigger; mode=newMode; rangePhase=0;
    const base=mode==='single'?single:start; view=new Date(base.getFullYear(),base.getMonth(),1);
    popup=document.createElement('div'); popup.className='generic-calendar lm-calendar-v11'; popup.setAttribute('role','dialog'); popup.setAttribute('aria-label',mode==='single'?'Choose date':'Choose date range');
    document.body.appendChild(popup); paint();
  }
  // Capture-phase ownership prevents legacy bubble handlers from opening/closing a second calendar.
  document.addEventListener('click',e=>{
    const trigger=isTrigger(e.target);
    if(trigger){ e.preventDefault(); e.stopImmediatePropagation(); open(trigger); return; }
    if(!popup) return;
    if(!popup.contains(e.target)){ close(); return; }
    e.preventDefault(); e.stopImmediatePropagation();
    if(e.target.closest('[data-v11-prev]')){view.setMonth(view.getMonth()-1);paint();return;}
    if(e.target.closest('[data-v11-next]')){view.setMonth(view.getMonth()+1);paint();return;}
    if(e.target.closest('[data-v11-today]')){
      const d=new Date(); view=new Date(d.getFullYear(),d.getMonth(),1);
      if(mode==='single') single=d; else {start=d;end=new Date(d);rangePhase=1;}
      sync();paint();return;
    }
    if(e.target.closest('[data-v11-done]')){close();return;}
    const day=e.target.closest('[data-v11-day]'); if(!day)return;
    const d=new Date(view.getFullYear(),view.getMonth(),Number(day.dataset.v11Day));
    if(mode==='single'){single=d;sync();close();return;}
    if(rangePhase===0){start=d;end=new Date(d);rangePhase=1;} else {if(d<start){end=start;start=d;}else end=d;rangePhase=0;}
    sync();paint();
  },true);
  window.addEventListener('resize',place,{passive:true}); window.addEventListener('scroll',place,{passive:true});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
})();
