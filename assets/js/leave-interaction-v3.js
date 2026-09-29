(()=>{
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const closeFloating=(except)=>{
    $$('.generic-calendar,.enh-calendar').forEach(el=>{ if(!except || !el.contains(except)) el.remove(); });
    document.body.classList.remove('calendar-open');
    $$('.lm-action-menu.show').forEach(el=>{ if(!except || !el.contains(except)) el.classList.remove('show'); });
  };

  // Hidden overlays must never capture page clicks.
  const normalizeOverlays=()=>{
    $$('.leave-overlay,.action-overlay').forEach(el=>{
      const visible=el.classList.contains('show');
      if(!visible){
        el.style.setProperty('display','none','important');
        el.style.setProperty('pointer-events','none','important');
        el.style.setProperty('visibility','hidden','important');
        el.setAttribute('aria-hidden','true');
      } else {
        el.style.removeProperty('display');
        el.style.setProperty('pointer-events','auto','important');
        el.style.setProperty('visibility','visible','important');
        el.removeAttribute('aria-hidden');
      }
    });
  };
  normalizeOverlays();
  new MutationObserver(normalizeOverlays).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});

  // Close floating UI on outside pointer-down without cancelling the destination click.
  document.addEventListener('pointerdown',e=>{
    const inCalendar=e.target.closest('.generic-calendar,.enh-calendar');
    const calendarTrigger=e.target.closest('.range,.date-chip,.generic-date-field,.themed-date');
    const action=e.target.closest('.lm-action,.lm-action-menu');
    if(!inCalendar && !calendarTrigger && !action) closeFloating(e.target);
  },true);

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      closeFloating();
      const action=$('.action-overlay.show'); if(action) action.remove();
      const leave=$('#leaveModal.show'); if(leave) leave.classList.remove('show');
    }
  });

  // Search button was visual-only in the previous build. Make it execute the current filters.
  const searchBtn=$('#lmDoSearch');
  if(searchBtn) searchBtn.addEventListener('click',()=>{
    const input=$('#lmSearch');
    input?.dispatchEvent(new Event('input',{bubbles:true}));
    input?.blur();
  });
  $('#lmSearch')?.addEventListener('keydown',e=>{ if(e.key==='Enter') searchBtn?.click(); });

  // Make the main table header checkbox select/deselect visible rows.
  const headCheck=$('.requests-card thead input[type="checkbox"]');
  if(headCheck) headCheck.addEventListener('change',()=>{
    $$('.requests-card tbody input[type="checkbox"]').forEach(c=>c.checked=headCheck.checked);
  });

  // Date-chip chevrons: click left/right to move one day; center opens calendar as before.
  const chip=$('.date-chip');
  if(chip){
    const icons=$$('svg',chip), label=$('b',chip);
    const parseLabel=()=>{
      const d=new Date((label?.textContent||'12 Aug 2024').replace(/^[A-Za-z]{3},\s*/,''));
      return isNaN(d)?new Date(2024,7,12):d;
    };
    icons.slice(-2).forEach((svg,i)=>{
      svg.style.pointerEvents='auto'; svg.style.cursor='pointer';
      svg.addEventListener('click',e=>{
        e.stopPropagation();
        const d=parseLabel(); d.setDate(d.getDate()+(i===0?-1:1));
        if(label) label.textContent=d.toLocaleDateString('en-GB',{weekday:'short',day:'2-digit',month:'short',year:'numeric'});
      });
    });
  }

  // Side-card links are now real interactions rather than dead anchors.
  $$('.side-card h3 a').forEach(a=>{
    a.setAttribute('role','button'); a.setAttribute('tabindex','0');
    const run=()=>{
      const card=a.closest('.side-card');
      if(card?.querySelector('.upcoming')){
        $('#lmStatus').value='Approved'; $('#lmStatus').dispatchEvent(new Event('change',{bubbles:true}));
        $('.requests-card')?.scrollIntoView({behavior:'smooth',block:'start'});
      } else if(card?.classList.contains('holidays')) {
        card.classList.toggle('expanded');
      }
    };
    a.addEventListener('click',e=>{e.preventDefault();run()});
    a.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();run()}});
  });

  // Clicking modal backdrop closes only that modal; clicking modal content never leaks through.
  document.addEventListener('click',e=>{
    if(e.target.classList.contains('action-overlay')) e.target.remove();
    if(e.target.classList.contains('leave-overlay')) e.target.classList.remove('show');
  });

  // Keep page controls explicitly interactive. This counters stale CSS from previous iterations.
  $$('.lm-page button,.lm-page input,.lm-page select,.lm-page a,#sidebar-component a,#sidebar-component button,#topbar-component a,#topbar-component button').forEach(el=>{
    el.style.pointerEvents='auto';
  });
})();
