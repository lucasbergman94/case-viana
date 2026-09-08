(() => {
  /* Comportamento de interface. Todo o conteudo e todo o estilo moram no HTML e no CSS. */

  const selectors = [
    '.asset-wall','.thesis-points','.product-grid','.gtm-grid','.creative-wall','.hera',
    '.lifecycle','.topic-grid','.metric-grid','.report-grid','.legacy-grid','.owners','.steps',
    '.email-seq','.lane'
  ];

  /* Trilhos horizontais: no mobile viram carrossel arrastavel com o mouse. */
  function makeDraggable(el){
    if(el.dataset.dragReady) return;
    el.dataset.dragReady='1';
    el.classList.add('drag-carousel');
    let down=false,startX=0,startScroll=0;

    el.addEventListener('pointerdown',e=>{
      if(window.innerWidth>860 || e.pointerType!=='mouse') return;
      if(e.target.closest('button,a,input,textarea,select')) return;
      down=true;
      startX=e.clientX;
      startScroll=el.scrollLeft;
      el.classList.add('is-dragging');
      if(el.setPointerCapture) el.setPointerCapture(e.pointerId);
    });
    el.addEventListener('pointermove',e=>{
      if(!down || window.innerWidth>860 || e.pointerType!=='mouse') return;
      el.scrollLeft=startScroll-(e.clientX-startX);
    });
    const stop=()=>{down=false;el.classList.remove('is-dragging')};
    el.addEventListener('pointerup',stop);
    el.addEventListener('pointercancel',stop);
    el.addEventListener('pointerleave',()=>{if(down) stop()});
  }

  /* Painel 03: a peca do ativo abre dentro do proprio painel, nao em modal. */
  function renderInlineAsset(key){
    const preview=document.getElementById('assetInlinePreview');
    if(!preview || typeof assetExamples==='undefined' || !assetExamples[key]) return;
    const ex=assetExamples[key];
    preview.innerHTML=`<div class="asset-inline-head"><div><p class="eyebrow">${ex.eyebrow}</p><h3>${ex.title}</h3></div></div><div class="asset-inline-body">${ex.body}</div><div class="asset-inline-note">${ex.note||''}</div>`;
    document.querySelectorAll('#s02 .asset-trigger').forEach(btn=>btn.classList.toggle('is-active',btn.dataset.asset===key));
    preview.scrollTop=0;
  }

  function initInlineAssets(){
    const diagnosis=document.querySelector('#s02');
    if(!diagnosis || diagnosis.dataset.inlineAssetsReady) return;
    diagnosis.dataset.inlineAssetsReady='1';
    diagnosis.addEventListener('click',e=>{
      const btn=e.target.closest('.asset-trigger');
      if(!btn) return;
      renderInlineAsset(btn.dataset.asset);
    });
  }


  /* Camadas: uma linha de escolhas troca o bloco visivel, sem rolar o painel. */
  function initCamadas(){
    document.querySelectorAll('.camadas').forEach(grupo=>{
      if(grupo.dataset.camadasReady) return;
      grupo.dataset.camadasReady='1';
      const tabs=[...grupo.querySelectorAll('.camada-tab')];
      const camadas=[...grupo.querySelectorAll('.camada')];
      const mostrar=alvo=>{
        tabs.forEach(t=>{
          const on=t.dataset.alvo===alvo;
          t.classList.toggle('is-active',on);
          t.setAttribute('aria-selected',on?'true':'false');
        });
        camadas.forEach(c=>c.classList.toggle('is-active',c.dataset.camada===alvo));
      };
      grupo.addEventListener('click',e=>{
        const t=e.target.closest('.camada-tab');
        if(t) mostrar(t.dataset.alvo);
      });
      grupo.addEventListener('keydown',e=>{
        if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft') return;
        const i=tabs.findIndex(t=>t.classList.contains('is-active'));
        if(i<0) return;
        const p=(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
        mostrar(tabs[p].dataset.alvo); tabs[p].focus(); e.preventDefault();
      });
    });
  }

  selectors.forEach(sel=>document.querySelectorAll(sel).forEach(makeDraggable));
  initInlineAssets();
  initCamadas();
})();
