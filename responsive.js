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

  /* Painel 02: a peca escolhida ocupa a largura toda. As pecas foram
     desenhadas para um modal alto e estreito; aqui o palco e largo e baixo.
     Em vez de rolar, a peca e quebrada em passos ate cada um caber na altura
     disponivel, e a navegacao e por setas. Se nem quebrando couber, o passo e
     reduzido proporcionalmente, com piso para nao ficar ilegivel. */
  function blocosDe(html){
    const molde=document.createElement('div');
    molde.innerHTML=html;
    let partes=[...molde.children];
    if(partes.length===1 && partes[0].children.length>1) partes=[...partes[0].children];
    return partes.map(p=>p.outerHTML);
  }

  function ajustarNav(palco){
    const passos=[...palco.querySelectorAll(".palco-passo")];
    const nav=palco.querySelector(".palco-nav");
    if(nav && passos.length<2) nav.remove();
    return;
  }
  function quebrarAltosDesativado(palco){
    const corpo=palco.querySelector('.palco-corpo');
    if(!corpo) return;
    const limite=corpo.clientHeight;
    if(limite<80) return;
    for(let volta=0; volta<3; volta++){
      if(corpo.querySelectorAll('.palco-passo').length>=4) break;
      const passos=[...corpo.querySelectorAll('.palco-passo')];
      let quebrou=false;
      for(const p of passos){
        const antes=p.style.display; p.style.display='block';
        const pede=p.scrollHeight;
        p.style.display=antes;
        if(pede<=limite*1.45) continue;
        const dentro=p.firstElementChild;
        const filhos=dentro?[...dentro.children]:[];
        if(filhos.length<2) continue;
        const corte=Math.ceil(filhos.length/2);
        const classe=dentro.className;
        const a=document.createElement('div'); a.className='palco-passo';
        const b=document.createElement('div'); b.className='palco-passo';
        const wa=document.createElement('div'); wa.className=classe;
        const wb=document.createElement('div'); wb.className=classe;
        filhos.slice(0,corte).forEach(f=>wa.appendChild(f.cloneNode(true)));
        filhos.slice(corte).forEach(f=>wb.appendChild(f.cloneNode(true)));
        a.appendChild(wa); b.appendChild(wb);
        p.replaceWith(a,b);
        quebrou=true;
      }
      if(!quebrou) break;
    }
    const passos=[...corpo.querySelectorAll('.palco-passo')];
    passos.forEach((p,i)=>p.classList.toggle('is-active',i===0));
    const nav=palco.querySelector('.palco-nav');
    if(nav){
      if(passos.length<2){nav.remove()}
      else{
        const pos=nav.querySelector('.palco-pos');
        if(pos) pos.innerHTML='<b>1</b> / '+passos.length;
      }
    }
    ajustarEscala(palco);
  }

  /* rede de seguranca: o que nem quebrando couber, encolhe proporcionalmente */
  function ajustarEscala(palco){
    const corpo=palco.querySelector('.palco-corpo');
    const ativo=palco.querySelector('.palco-passo.is-active');
    if(!corpo||!ativo) return;
    ativo.style.transform='';ativo.style.width='';ativo.style.marginLeft='';
    const limite=corpo.clientHeight, pede=ativo.scrollHeight;
    if(limite>60 && pede>limite+4){
      const k=Math.max(.62, limite/pede);
      ativo.style.transformOrigin='top center';
      ativo.style.transform='scale('+k.toFixed(3)+')';
      ativo.style.width=(100/k).toFixed(2)+'%';
      ativo.style.marginLeft=(-(100/k-100)/2).toFixed(2)+'%';
    }
  }

  function renderInlineAsset(key){
    const palco=document.getElementById('assetInlinePreview');
    if(!palco || typeof assetExamples==='undefined' || !assetExamples[key]) return;
    const ex=assetExamples[key];
    const passos=blocosDe(ex.body);
    palco.innerHTML=
      '<div class="palco-head"><div><p class="eyebrow">'+ex.eyebrow+'</p><h3>'+ex.title+'</h3></div>'+
      '<div class="palco-nav">'+
        '<button class="palco-seta" type="button" data-dir="-1" aria-label="Anterior">&#8592;</button>'+
        '<span class="palco-pos"><b>1</b> / '+passos.length+'</span>'+
        '<button class="palco-seta" type="button" data-dir="1" aria-label="Próximo">&#8594;</button>'+
      '</div>'+
      '</div>'+
      '<div class="palco-corpo">'+passos.map((h,i)=>
        '<div class="palco-passo'+(i===0?' is-active':'')+'">'+h+'</div>').join('')+'</div>'+
      (ex.note?'<div class="palco-nota">'+ex.note+'</div>':'');
    document.querySelectorAll('#s02 .asset-trigger').forEach(b=>b.classList.toggle('is-active',b.dataset.asset===key));
    requestAnimationFrame(()=>{ajustarNav(palco);ajustarEscala(palco)});
  }

  function moverPasso(palco,dir){
    const passos=[...palco.querySelectorAll('.palco-passo')];
    if(passos.length<2) return;
    let i=passos.findIndex(p=>p.classList.contains('is-active'));
    i=(i+dir+passos.length)%passos.length;
    passos.forEach((p,k)=>p.classList.toggle('is-active',k===i));
    const pos=palco.querySelector('.palco-pos b');
    if(pos) pos.textContent=String(i+1);
    ajustarEscala(palco);
  }

  function initInlineAssets(){
    const diagnosis=document.querySelector('#s02');
    if(!diagnosis || diagnosis.dataset.inlineAssetsReady) return;
    diagnosis.dataset.inlineAssetsReady='1';
    diagnosis.addEventListener('click',e=>{
      const seta=e.target.closest('.palco-seta');
      if(seta){moverPasso(document.getElementById('assetInlinePreview'),+seta.dataset.dir);return}
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
  if(document.querySelector('#s02 .asset-trigger')) renderInlineAsset('instagram');
  let tRedim;
  window.addEventListener('resize',()=>{
    clearTimeout(tRedim);
    tRedim=setTimeout(()=>{
      const ativo=document.querySelector('#s02 .asset-trigger.is-active');
      if(ativo) renderInlineAsset(ativo.dataset.asset);
    },200);
  });
  initCamadas();
})();
