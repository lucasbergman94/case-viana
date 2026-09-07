(() => {
  const selectors = [
    '.asset-wall','.thesis-points','.product-grid','.gtm-grid','.creative-wall','.hera',
    '.lifecycle','.topic-grid','.metric-grid','.report-grid','.legacy-grid','.owners','.steps'
  ];

  function makeDraggable(el){
    if(el.dataset.dragReady) return;
    el.dataset.dragReady='1';
    el.classList.add('drag-carousel');
    let down=false,startX=0,startScroll=0;

    el.addEventListener('pointerdown',e=>{
      if(window.innerWidth>860) return;
      down=true;
      startX=e.clientX;
      startScroll=el.scrollLeft;
      el.classList.add('is-dragging');
      if(el.setPointerCapture) el.setPointerCapture(e.pointerId);
    });
    el.addEventListener('pointermove',e=>{
      if(!down || window.innerWidth>860) return;
      el.scrollLeft=startScroll-(e.clientX-startX);
    });
    const stop=()=>{down=false;el.classList.remove('is-dragging')};
    el.addEventListener('pointerup',stop);
    el.addEventListener('pointercancel',stop);
    el.addEventListener('pointerleave',()=>{if(down) stop()});
  }

  function init(){selectors.forEach(sel=>document.querySelectorAll(sel).forEach(makeDraggable));}
  init();
  const deck=document.getElementById('deck');
  if(deck){new MutationObserver(init).observe(deck,{childList:true,subtree:true});}
})();