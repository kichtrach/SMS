(()=>{
  const removeCalendars=()=>{
    document.querySelectorAll('.generic-calendar,.enh-calendar').forEach(el=>el.remove());
    document.body.classList.remove('calendar-open');
  };
  // Close a floating calendar BEFORE the newly clicked control handles its click.
  // Do not preventDefault/stopPropagation: the destination control must still work.
  document.addEventListener('pointerdown',e=>{
    const cal=e.target.closest('.generic-calendar,.enh-calendar');
    const opener=e.target.closest('.range,.date-chip,.generic-date-field,.themed-date');
    if(!cal && !opener && document.querySelector('.generic-calendar,.enh-calendar')) removeCalendars();
  },true);
  document.addEventListener('keydown',e=>{if(e.key==='Escape') removeCalendars()});
  // Safety cleanup for stale modal/backdrop state.
  const normalize=()=>{
    document.querySelectorAll('.leave-overlay,.action-overlay').forEach(el=>{
      if(!el.classList.contains('show')){
        el.style.pointerEvents='none';
        el.setAttribute('aria-hidden','true');
      }else{
        el.style.pointerEvents='auto';
        el.removeAttribute('aria-hidden');
      }
    });
  };
  new MutationObserver(normalize).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
  normalize();
})();
