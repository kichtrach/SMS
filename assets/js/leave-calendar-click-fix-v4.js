(()=>{
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  // One floating calendar at a time. Closing it must never swallow the next control click.
  document.addEventListener('click',e=>{
    const cal=$('.generic-calendar,.enh-calendar');
    if(!cal) return;
    if(cal.contains(e.target)) return;
    if(e.target.closest('.range,.date-chip,.generic-date-field,.wizard-date,.themed-date')) return;
    cal.remove();
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape') $$('.generic-calendar,.enh-calendar').forEach(x=>x.remove());
  });
  // Never leave an invisible modal layer over the page.
  const modal=$('#leaveModal');
  const syncModal=()=>{
    if(!modal) return;
    const open=modal.classList.contains('show');
    modal.style.pointerEvents=open?'auto':'none';
    modal.style.visibility=open?'visible':'hidden';
  };
  syncModal();
  if(modal){
    const mo=new MutationObserver(syncModal);
    mo.observe(modal,{attributes:true,attributeFilter:['class']});
  }
})();