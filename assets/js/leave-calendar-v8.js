(()=>{
  const qs=(s,r=document)=>r.querySelector(s);
  let popup=null, trigger=null, mode='single', view=new Date(2024,7,1);
  let single=new Date(2024,7,12), start=new Date(2024,7,1), end=new Date(2024,7,31), pickingEnd=false;
  const fmt=d=>d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
  const same=(a,b)=>a&&b&&a.toDateString()===b.toDateString();
  function close(){ popup?.remove(); popup=null; trigger=null; pickingEnd=false; }
  function position(){if(!popup||!trigger)return;const r=trigger.getBoundingClientRect(),w=310,h=360;popup.style.left=Math.max(8,Math.min(r.left,innerWidth-w-8))+'px';popup.style.top=Math.max(8,Math.min(r.bottom+6,innerHeight-h-8))+'px';}
  function render(){
    if(!popup)return; const y=view.getFullYear(),m=view.getMonth(),first=new Date(y,m,1),last=new Date(y,m+1,0),lead=(first.getDay()+6)%7;
    let cells=''; for(let i=0;i<lead;i++)cells+='<span></span>';
    for(let d=1;d<=last.getDate();d++){const dt=new Date(y,m,d),sel=mode==='single'?same(dt,single):(same(dt,start)||same(dt,end)),inside=mode==='range'&&dt>=start&&dt<=end;cells+=`<button type="button" class="${sel?'selected':''} ${inside?'in-range':''}" data-day="${d}">${d}</button>`;}
    popup.innerHTML=`<div class="cal-head"><button type="button" data-prev>‹</button><b>${view.toLocaleDateString('en-US',{month:'long',year:'numeric'})}</b><button type="button" data-next>›</button></div><div class="cal-week"><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span></div><div class="cal-days">${cells}</div><div class="cal-foot"><button type="button" data-today>Today</button><button type="button" class="done" data-done>Done</button></div>`;
    position();
  }
  function open(el,m){ if(popup&&trigger===el){close();return;} close(); trigger=el;mode=m;view=new Date((m==='single'?single:start).getFullYear(),(m==='single'?single:start).getMonth(),1);popup=document.createElement('div');popup.className='generic-calendar lm-calendar-v8';document.body.appendChild(popup);render();}
  function updateTrigger(){if(!trigger)return;if(mode==='single'){const b=qs('b',trigger);if(b)b.textContent=single.toLocaleDateString('en-GB',{weekday:'short',day:'2-digit',month:'short',year:'numeric'});}else{trigger.innerHTML=`<i data-lucide="calendar-days"></i>${fmt(start)} - ${fmt(end)}`;window.lucide?.createIcons();}}
  function bind(el,m){if(!el)return;el.onclick=null;el.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();open(el,m);});}
  bind(qs('.date-chip'),'single'); bind(qs('.lm-filters .range'),'range');
  document.addEventListener('click',e=>{
    if(!popup)return;
    if(!popup.contains(e.target)){close();return;}
    e.stopPropagation();
    if(e.target.closest('[data-prev]')){view.setMonth(view.getMonth()-1);render();return;}
    if(e.target.closest('[data-next]')){view.setMonth(view.getMonth()+1);render();return;}
    if(e.target.closest('[data-today]')){const d=new Date();view=new Date(d.getFullYear(),d.getMonth(),1);if(mode==='single')single=d;else{start=d;end=new Date(d);pickingEnd=true;}updateTrigger();render();return;}
    if(e.target.closest('[data-done]')){close();return;}
    const day=e.target.closest('[data-day]'); if(!day)return; const d=new Date(view.getFullYear(),view.getMonth(),Number(day.dataset.day));
    if(mode==='single'){single=d;updateTrigger();close();}
    else if(!pickingEnd){start=d;end=d;pickingEnd=true;updateTrigger();render();}
    else{if(d<start){end=start;start=d;}else end=d;pickingEnd=false;updateTrigger();render();}
  });
  addEventListener('resize',position,{passive:true});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
})();
