function initApp(){
  // Render shared components synchronously so the project works from file:// and a web server.
  renderSidebar();
  renderTopbar();
  initSidebar();
  initTopbar();
  if(window.lucide) lucide.createIcons();
}
document.addEventListener('DOMContentLoaded',initApp);
