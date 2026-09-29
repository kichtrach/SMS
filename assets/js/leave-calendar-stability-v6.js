(()=>{
  function closeLooseCalendars(target){
    document.querySelectorAll('.generic-calendar,.enh-calendar').forEach(cal=>{
      if(cal.contains(target)) return;
      const trigger=target.closest?.('.date-chip,.range,.wizard-date,.themed-date,.generic-date-field');
      if(trigger) return;
      cal.remove();
    });
  }
  // Bubble phase: the clicked control runs first, then any open calendar is removed.
  // No preventDefault, no stopPropagation, no document-covering overlay.
  document.addEventListener('click',e=>closeLooseCalendars(e.target),false);
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape') document.querySelectorAll('.generic-calendar,.enh-calendar').forEach(x=>x.remove());
  });
})();
