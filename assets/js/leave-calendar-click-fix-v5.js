(()=>{
  const allCalendars=()=>[...document.querySelectorAll('.generic-calendar,.enh-calendar')];
  const isCalendarTrigger=(el)=>el?.closest?.('.date-chip,.range,.generic-date-field,.wizard-date,.themed-date');

  // Close a calendar at pointer-down time, before the subsequent click is dispatched.
  // Do not preventDefault/stopPropagation: the control the user clicked must still receive its click.
  document.addEventListener('pointerdown',(e)=>{
    const calendars=allCalendars();
    if(!calendars.length) return;
    if(calendars.some(c=>c.contains(e.target))) return;
    if(isCalendarTrigger(e.target)) return;
    calendars.forEach(c=>c.remove());
    document.body.classList.remove('calendar-open');
  },true);

  document.addEventListener('keydown',(e)=>{
    if(e.key!=='Escape') return;
    allCalendars().forEach(c=>c.remove());
    document.body.classList.remove('calendar-open');
  });

  // Hidden backdrops must never intercept the page.
  const releaseHiddenBackdrops=()=>{
    document.querySelectorAll('.leave-overlay,.action-overlay').forEach(el=>{
      const open=el.classList.contains('show');
      if(!open){
        el.style.pointerEvents='none';
        el.style.visibility='hidden';
      } else {
        el.style.pointerEvents='auto';
        el.style.visibility='visible';
      }
    });
  };
  releaseHiddenBackdrops();
})();
