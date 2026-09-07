async function loadDeck(){
  const deck=document.getElementById('deck');
  const files=['sections-a.html','sections-b.html','sections-c.html','sections-d.html'];
  const html=await Promise.all(files.map(f=>fetch(f,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`Falha ao carregar ${f}`);return r.text()})));
  deck.innerHTML=html.join('\n');
  initPresentation();
  if(location.hash){setTimeout(()=>document.querySelector(location.hash)?.scrollIntoView({block:'start'}),80)}
}

function initPresentation(){
  const panels=[...document.querySelectorAll('.panel')];
  const links=[...document.querySelectorAll('.nav a')];
  const current=document.getElementById('current');
  const progress=document.getElementById('progress');
  const updateProgress=()=>{const h=document.documentElement;const max=h.scrollHeight-h.clientHeight;progress.style.width=(max?scrollY/max*100:0)+'%'};
  addEventListener('scroll',updateProgress,{passive:true});
  updateProgress();
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    current.textContent=entry.target.dataset.slide;
    links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));
  }),{threshold:.55});
  panels.forEach(panel=>io.observe(panel));
}

loadDeck().catch(err=>{
  document.getElementById('deck').innerHTML=`<section class="panel"><div class="wrap"><div class="intro"><p class="eyebrow">Erro de carregamento</p><h2>Não foi possível carregar a apresentação.</h2><p class="sub">${err.message}</p></div></div></section>`;
});