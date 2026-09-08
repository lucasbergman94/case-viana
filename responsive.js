(() => {
  const selectors = [
    '.asset-wall','.thesis-points','.product-grid','.gtm-grid','.creative-wall','.hera',
    '.lifecycle','.topic-grid','.metric-grid','.report-grid','.legacy-grid','.owners','.steps',
    '.email-seq','.lane'
  ];

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

  function init(){selectors.forEach(sel=>document.querySelectorAll(sel).forEach(makeDraggable));}

  function setPeachFavicon(){
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="#070807"/><path d="M50 29C42 18 25 19 18 34 10 53 20 78 37 83c7 2 12-2 13-10 1 8 6 12 13 10 17-5 27-30 19-49-7-15-24-16-32-5Z" fill="#CA195D"/><path d="M50 29c1-9 7-15 17-17" fill="none" stroke="#E4356F" stroke-width="5" stroke-linecap="round"/></svg>`;
    const href='data:image/svg+xml,'+encodeURIComponent(svg);
    let icon=document.querySelector('link[rel="icon"]');
    if(!icon){
      icon=document.createElement('link');
      icon.rel='icon';
      document.head.appendChild(icon);
    }
    icon.href=href;
  }

  function injectCoverStyles(){
    if(document.getElementById('cover-polish-styles')) return;
    const style=document.createElement('style');
    style.id='cover-polish-styles';
    style.textContent=`
      #s01.hero-full .hero-full-bg img{
        inset:0!important;
        width:100%!important;
        height:100%!important;
        max-width:none!important;
        object-fit:cover!important;
        object-position:center 48%!important;
        filter:saturate(1.03) contrast(1.04)!important;
      }
      #s01.hero-full .hero-full-bg::after{
        background:
          linear-gradient(90deg,rgba(7,8,7,.97) 0%,rgba(7,8,7,.94) 27%,rgba(7,8,7,.77) 44%,rgba(7,8,7,.40) 61%,rgba(7,8,7,.14) 78%,rgba(7,8,7,.24) 100%),
          linear-gradient(0deg,rgba(7,8,7,.76) 0%,rgba(7,8,7,.14) 40%,rgba(7,8,7,.28) 100%)!important;
      }
      #s01 .hero-full-copy{
        max-width:min(880px,57vw)!important;
        gap:14px!important;
      }
      #s01 .hero-lockup-full{margin-bottom:4px}
      #s01 .hero-provocation{
        display:grid!important;
        gap:8px!important;
        max-width:none!important;
        margin:0!important;
        font-family:var(--fB)!important;
        text-transform:none!important;
        letter-spacing:0!important;
      }
      #s01 .hero-softline{
        display:block;
        white-space:nowrap;
        font-size:clamp(19px,1.35vw,23px);
        line-height:1.2;
        font-weight:500;
        color:rgba(244,239,232,.78);
      }
      #s01 .hero-question{
        display:block;
        max-width:27ch;
        font-family:var(--fD);
        font-size:clamp(34px,3.15vw,52px);
        line-height:.98;
        letter-spacing:-.018em;
        text-transform:none;
        text-wrap:balance;
        color:var(--ink);
      }
      #s01 .hero-question .pink-word{color:var(--pink)}
      #s01 .sub{
        max-width:66ch!important;
        font-size:clamp(17px,1.18vw,20px)!important;
        line-height:1.48!important;
        color:rgba(244,239,232,.78)!important;
        text-wrap:pretty;
      }
      #s01 .hero-leadin{margin-top:4px!important}
      @media(max-width:1100px){
        #s01 .hero-full-copy{max-width:68vw!important}
        #s01 .hero-question{max-width:25ch;font-size:clamp(32px,4vw,46px)}
      }
      @media(max-width:860px){
        #s01.hero-full .hero-full-bg img{object-position:58% center!important}
        #s01 .hero-full-copy{max-width:100%!important;padding-top:34vh!important}
        #s01 .hero-softline{white-space:normal}
        #s01 .hero-question{max-width:22ch;font-size:clamp(30px,8vw,43px)}
        #s01 .sub{max-width:54ch!important}
      }
    `;
    document.head.appendChild(style);
  }

  async function loadApprovedHero(){
    const hero=document.querySelector('#s01 .hero-full-bg img');
    if(!hero) return;
    const files=[1,2,3,4,5].map(n=>`img/mbv/hero-duo-0${n}.txt`);
    try{
      const parts=await Promise.all(files.map(f=>fetch(f,{cache:'force-cache'}).then(r=>{
        if(!r.ok) throw new Error(f);
        return r.text();
      })));
      hero.src='data:image/webp;base64,'+parts.join('');
      hero.width=900;
      hero.height=506;
    }catch(err){
      console.warn('Hero duo não carregou; mantendo fallback atual.',err);
    }
  }

  function polishCoverCopy(){
    const hero=document.querySelector('#s01');
    if(!hero) return;
    const prov=hero.querySelector('.hero-provocation');
    if(prov){
      prov.innerHTML='<span class="hero-softline">Tá... Posso ter exagerado né?</span><strong class="hero-question">Mas e se o treino de glúteos fosse o primeiro ebook de uma série de <span class="pink-word">Métodos Viana?</span></strong>';
    }
    const sub=hero.querySelector('.sub');
    if(sub){
      sub.textContent='Esse é o plano de lançamento assinado pela especialista Kati Santana focado em treinos de glúteo, mas que abre espaço para uma discussão muito maior sobre como posicionar o guarda-chuva de produtos da Consultoria.';
    }
    const tags=[...hero.querySelectorAll('.tag')];
    const old=tags.find(t=>t.textContent.trim()==='A conta que fecha, ou não');
    if(old) old.textContent='O legado que vamos criar';
  }

  function initCoverPolish(){
    setPeachFavicon();
    injectCoverStyles();
    polishCoverCopy();
    loadApprovedHero();
  }

  init();
  initCoverPolish();
  const deck=document.getElementById('deck');
  if(deck){
    new MutationObserver(()=>{init();polishCoverCopy();}).observe(deck,{childList:true,subtree:true});
  }
})();