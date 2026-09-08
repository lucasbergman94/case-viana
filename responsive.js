(() => {
  const selectors = [
    '.asset-wall','.thesis-points','.product-grid','.gtm-grid','.creative-wall','.hera',
    '.lifecycle','.topic-grid','.metric-grid','.report-grid','.legacy-grid','.owners','.steps',
    '.email-seq','.lane'
  ];

  if(!document.querySelector('link[href="case-polish.css"]')){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='case-polish.css';
    document.head.appendChild(link);
  }

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

  function setPeachFavicon(){
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="#070807"/><path d="M50 29C42 18 25 19 18 34 10 53 20 78 37 83c7 2 12-2 13-10 1 8 6 12 13 10 17-5 27-30 19-49-7-15-24-16-32-5Z" fill="#CA195D"/><path d="M50 29c1-9 7-15 17-17" fill="none" stroke="#E4356F" stroke-width="5" stroke-linecap="round"/><path d="M50 39v35" fill="none" stroke="#070807" stroke-opacity=".35" stroke-width="4" stroke-linecap="round"/></svg>`;
    const href='data:image/svg+xml,'+encodeURIComponent(svg);
    let icon=document.querySelector('link[rel="icon"]');
    if(!icon){icon=document.createElement('link');icon.rel='icon';document.head.appendChild(icon);}
    icon.href=href;
  }

  function injectCoverStyles(){
    if(document.getElementById('cover-polish-styles')) return;
    const style=document.createElement('style');
    style.id='cover-polish-styles';
    style.textContent=`
      #s01.hero-full .hero-full-bg img{
        inset:0!important;width:100%!important;height:100%!important;max-width:none!important;
        object-fit:cover!important;object-position:center 48%!important;
        filter:saturate(1.03) contrast(1.04)!important;
      }
      #s01.hero-full .hero-full-bg::after{
        background:linear-gradient(90deg,rgba(7,8,7,.97) 0%,rgba(7,8,7,.94) 27%,rgba(7,8,7,.77) 44%,rgba(7,8,7,.40) 61%,rgba(7,8,7,.14) 78%,rgba(7,8,7,.24) 100%),linear-gradient(0deg,rgba(7,8,7,.76) 0%,rgba(7,8,7,.14) 40%,rgba(7,8,7,.28) 100%)!important;
      }
      #s01 .hero-full-copy{max-width:min(980px,62vw)!important;gap:14px!important}
      #s01 .hero-lockup-full{margin-bottom:4px}
      #s01 .hero-provocation{display:grid!important;gap:9px!important;max-width:none!important;margin:0!important;font-family:var(--fB)!important;text-transform:none!important;letter-spacing:0!important}
      #s01 .hero-softline{display:block;white-space:nowrap;font-size:clamp(20px,1.45vw,25px);line-height:1.18;font-weight:500;color:rgba(244,239,232,.80)}
      #s01 .hero-question{display:block;max-width:25ch;font-family:var(--fD);font-size:clamp(34px,3.05vw,50px);line-height:.98;letter-spacing:-.018em;text-transform:none;text-wrap:balance;color:var(--ink)}
      #s01 .hero-question .pink-word{color:var(--pink)}
      #s01 .sub{max-width:74ch!important;font-size:clamp(17px,1.18vw,20px)!important;line-height:1.48!important;color:rgba(244,239,232,.80)!important;text-wrap:pretty}
      #s01 .hero-leadin{margin-top:4px!important}
      @media(max-width:1100px){#s01 .hero-full-copy{max-width:70vw!important}#s01 .hero-question{max-width:25ch;font-size:clamp(32px,4vw,46px)}}
      @media(max-width:860px){#s01.hero-full .hero-full-bg img{object-position:58% center!important}#s01 .hero-full-copy{max-width:100%!important;padding-top:34vh!important}#s01 .hero-softline{white-space:normal}#s01 .hero-question{max-width:22ch;font-size:clamp(30px,8vw,43px)}#s01 .sub{max-width:54ch!important}}
    `;
    document.head.appendChild(style);
  }

  async function loadApprovedHero(){
    const hero=document.querySelector('#s01 .hero-full-bg img');
    if(!hero) return;
    const files=[1,2,3,4,5].map(n=>`img/mbv/hero-duo-0${n}.txt`);
    try{
      const parts=await Promise.all(files.map(f=>fetch(f,{cache:'force-cache'}).then(r=>{if(!r.ok) throw new Error(f);return r.text();})));
      hero.src='data:image/webp;base64,'+parts.join('');
      hero.width=1800;
      hero.height=1012;
    }catch(err){console.warn('Hero duo não carregou; mantendo fallback atual.',err);}
  }

  function polishCoverCopy(){
    const hero=document.querySelector('#s01');
    if(!hero) return;
    const prov=hero.querySelector('.hero-provocation');
    if(prov){
      prov.classList.add('hero-provocation-v2');
      prov.innerHTML='<span class="hero-softline">Tá... Posso ter exagerado né?</span><strong class="hero-question">Mas e se o treino de glúteos fosse o primeiro ebook de uma série de <span class="pink-word">Métodos Viana?</span></strong>';
    }
    const sub=hero.querySelector('.sub');
    if(sub){sub.classList.add('hero-sub-v2');sub.textContent='Esse é o plano de lançamento assinado pela especialista Kati Santana focado em treinos de glúteo, mas que abre espaço para uma discussão muito maior sobre como posicionar o guarda-chuva de produtos da Consultoria.';}
    const tags=[...hero.querySelectorAll('.tag')];
    const old=tags.find(t=>t.textContent.trim()==='A conta que fecha, ou não');
    if(old) old.textContent='O legado que vamos criar';
  }

  function patchContextAndDiagnosis(){
    const context=document.querySelector('#s02');
    if(context){
      const cards=context.querySelectorAll('.step');
      if(cards[0]){
        const p=cards[0].querySelector('p');
        if(p)p.textContent='Uma oferta específica reduz a distância entre acompanhar conteúdo de graça e contratar acompanhamento individual ou produtos high-ticket.';
      }
      const opp=context.querySelector('.opportunity p');
      if(opp)opp.innerHTML='O legado vira uma esteira de vendas que não depende de campanha. Usamos dados para mapear dores e novas estratégias, criando um guarda-chuva de <b>Métodos Viana</b> que serve como porta de entrada para todo o ecossistema da empresa.';
    }

    const diagnosis=document.querySelector('#s03');
    if(!diagnosis) return;
    const h2=diagnosis.querySelector('.intro h2');
    if(h2)h2.innerHTML='<span class="diag-line-1">A Consultoria já tem ativos.</span><span class="pink diag-line-2">Faltam a estruturação e a transição entre eles pra quem chega ao ecossistema.</span>';
    const sub=diagnosis.querySelector('.intro .sub');
    if(sub)sub.innerHTML='Instagram, blog, newsletter, CRM/ManyChat, Cozinha do Viana e Consultoria já cumprem funções relevantes.<span class="diag-sub-line">O que não existe hoje é o caminho declarado entre <b>descoberta</b>, <b>compra</b>, <b>relacionamento</b> e <b>próxima oferta</b>.</span>';
    const head=diagnosis.querySelector('.asset-section-head .eyebrow');
    if(head)head.textContent='Como podemos fazer uso dos ativos atuais para o MBV';
    const caption=diagnosis.querySelector('.asset-section-head .caption');
    if(caption)caption.textContent='Clique em um ativo para ver, neste painel, a peça pronta e o papel que ele assume no lançamento.';
    diagnosis.querySelector('.asset-hint')?.remove();
    const logic=diagnosis.querySelector('.diagnostic-conclusion');
    if(logic){
      const preview=document.createElement('aside');
      preview.className='asset-inline-preview';preview.id='assetInlinePreview';preview.setAttribute('aria-live','polite');
      preview.innerHTML='<div class="asset-inline-empty"><span class="eyebrow">Peça pronta</span><h3>Escolha um ativo ao lado</h3><p>O exemplo aparece aqui, mantendo o diagnóstico e a aplicação do canal dentro do mesmo raciocínio.</p></div>';
      logic.replaceWith(preview);
    }
    diagnosis.querySelector('.asset-logic-v2')?.classList.add('asset-logic-inline');
    diagnosis.querySelector('.asset-wall')?.parentElement?.classList.add('asset-browser');
  }

  function patchThesisAndProduct(){
    const thesis=document.querySelector('#s04');
    if(thesis){
      const h2=thesis.querySelector('.intro h2');
      if(h2)h2.innerHTML='<span class="thesis-title-line">Nem todo seguidor precisa estar pronto para o high-ticket da Consultoria.</span><span class="pink thesis-title-line">O que não significa que ele não esteja pronto pra comprar.</span>';
      const leap=[...thesis.querySelectorAll('.thesis-points .card')].find(card=>card.querySelector('.mini')?.textContent.trim()==='O salto que ninguém sobe');
      if(leap){
        const p=leap.querySelector('p');
        if(p)p.textContent='São duas decisões de compra muito diferentes: o ebook vende autonomia; a Consultoria vende acompanhamento individual. Em vez de esperar que alguém salte direto do conteúdo gratuito para R$1.099, o MBV cria um primeiro compromisso pago de R$97. Só depois dos dados desse comportamento avaliamos se existe espaço para um degrau intermediário no horizonte 2.';
      }
    }

    const product=document.querySelector('#s05');
    if(product){
      const h2=product.querySelector('.intro h2');
      if(h2)h2.innerHTML='<span class="product-title-white">Quem compra garante</span><span class="pink product-title-pink">8 semanas de um treino de glúteos independente, mas transformador</span>';
      const sub=product.querySelector('.intro .sub');
      if(sub)sub.innerHTML='O MBV é uma metodologia que organiza conhecimento técnico de forma aplicada e deixa claro qual o resultado esperado:<span class="product-sub-line"><b>entender</b> o que está sendo feito, <b>executar melhor</b> os exercícios e <b>conseguir provar</b> que o treino evoluiu.</span>';
      const priceLabels=[...product.querySelectorAll('.price-block .mini')];
      const price=priceLabels.find(el=>el.textContent.trim()==='Preço');
      if(price)price.textContent='Sugestão de preço';
      const founders=priceLabels.find(el=>el.textContent.trim()==='Lote de fundadoras');
      if(founders)founders.textContent='Lote de embaixadoras';
    }
  }

  function renderInlineAsset(key){
    const preview=document.getElementById('assetInlinePreview');
    if(!preview || typeof assetExamples==='undefined' || !assetExamples[key]) return;
    const ex=assetExamples[key];
    preview.innerHTML=`<div class="asset-inline-head"><div><p class="eyebrow">${ex.eyebrow}</p><h3>${ex.title}</h3></div></div><div class="asset-inline-body">${ex.body}</div><div class="asset-inline-note">${ex.note||''}</div>`;
    document.querySelectorAll('#s03 .asset-trigger').forEach(btn=>btn.classList.toggle('is-active',btn.dataset.asset===key));
    preview.scrollTop=0;
  }

  function initInlineAssets(){
    const diagnosis=document.querySelector('#s03');
    if(!diagnosis || diagnosis.dataset.inlineAssetsReady) return;
    diagnosis.dataset.inlineAssetsReady='1';
    diagnosis.addEventListener('click',e=>{
      const btn=e.target.closest('.asset-trigger');
      if(!btn) return;
      e.preventDefault();e.stopImmediatePropagation();renderInlineAsset(btn.dataset.asset);
    },true);
  }

  function init(){
    polishCoverCopy();
    patchContextAndDiagnosis();
    patchThesisAndProduct();
    selectors.forEach(sel=>document.querySelectorAll(sel).forEach(makeDraggable));
    initInlineAssets();
  }

  setPeachFavicon();
  injectCoverStyles();
  init();
  loadApprovedHero();
  const deck=document.getElementById('deck');
  if(deck){new MutationObserver(()=>init()).observe(deck,{childList:true,subtree:true});}
})();