(()=>{
  let pop=null, view=new Date(2024,7,1), selected=new Date(2024,7,12), rangeStart=new Date(2024,7,1), rangeEnd=new Date(2024,7,31), owner=null, mode='single';
  const fmt=d=>d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
  const close=()=>{ if(pop){pop.remove();pop=null;} owner=null; };
  const same=(a,b)=>a&&b&&a.toDateString()===b.toDateString();
  function markup(){
    const y=view.getFullYear(),m=view.getMonth(),first=new Date(y,m,1),last=new Date(y,m+1,0),lead=(first.getDay()+6)%7;
    let cells='';
    for(let i=0;i<lead;i++) cells+='<span></span>';
    for(let d=1;d<=last.getDate();d++){
      const dt=new Date(y,m,d), sel=mode==='single'&&same(dt,selected), inRange=mode==='range'&&dt>=rangeStart&&dt<=rangeEnd;
      cells+=`<button type="button" class="${sel?'selected':''} ${inRange?'in-range':''}" data-v7-day="${d}">${d}</button>`;
    }
    return `<div class="cal-head"><button type="button" data-v7-prev>‹</button><b>${view.toLocaleDateString('en-US',{month:'long',year:'numeric'})}</b><button type="button" data-v7-next>›</button></div><div class="cal-week"><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span></div><div class="cal-days">${cells}</div><div class="cal-foot"><button type="button" data-v7-today>Today</button><button type="button" class="done" data-v7-done>Done</button></div>`;
  }
  function position(){ if(!pop||!owner)return; const r=owner.getBoundingClientRect(),w=310,h=360; pop.style.left=Math.max(8,Math.min(r.left,innerWidth-w-8))+'px'; pop.style.top=Math.max(8,Math.min(r.bottom+6,innerHeight-h-8))+'px'; }
  function paint(){ if(!pop)return; pop.innerHTML=markup(); position(); }
  function open(trigger,newMode){
    if(pop&&owner===trigger){close();return;}
    close(); owner=trigger; mode=newMode; view=new Date(2024,7,1);
    pop=document.createElement('div'); pop.className='generic-calendar v7-calendar'; pop.style.zIndex='5000'; document.body.appendChild(pop); paint();
  }
  document.addEventListener('click',e=>{
    const trigger=e.target.closest?.('.date-chip,.lm-filters .range');
    if(trigger){
      e.preventDefault(); e.stopImmediatePropagation();
      open(trigger,trigger.classList.contains('range')?'range':'single'); return;
    }
    if(!pop) return;
    if(pop.contains(e.target)){
      e.preventDefault(); e.stopImmediatePropagation();
      if(e.target.closest('[data-v7-prev]')){view.setMonth(view.getMonth()-1);paint();return;}
      if(e.target.closest('[data-v7-next]')){view.setMonth(view.getMonth()+1);paint();return;}
      if(e.target.closest('[data-v7-today]')){const d=new Date();view=new Date(d.getFullYear(),d.getMonth(),1);if(mode==='single')selected=d;else{rangeStart=d;rangeEnd=new Date(d);rangeEnd.setDate(d.getDate()+6);}paint();return;}
      if(e.target.closest('[data-v7-done]')){close();return;}
      const day=e.target.closest('[data-v7-day]');
      if(day){const d=new Date(view.getFullYear(),view.getMonth(),+day.dataset.v7Day);if(mode==='single'){selected=d;const b=owner.querySelector('b');if(b)b.textContent=d.toLocaleDateString('en-GB',{weekday:'short',day:'2-digit',month:'short',year:'numeric'});}else{rangeStart=d;rangeEnd=new Date(d);rangeEnd.setDate(d.getDate()+6);owner.innerHTML=`<i data-lucide="calendar-days"></i>${fmt(rangeStart)} - ${fmt(rangeEnd)}`;window.lucide?.createIcons();}paint();return;}
      return;
    }
    close(); // IMPORTANT: do not prevent/stop the outside click; the clicked control continues normally.
  },true);
  addEventListener('resize',position,{passive:true});
  addEventListener('scroll',()=>{if(pop)position()},{passive:true,capture:true});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
})();
