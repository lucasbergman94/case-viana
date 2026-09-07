async function loadDeck(){
  const deck=document.getElementById('deck');
  const files=['sections-a.html','sections-b.html','sections-c.html','sections-d.html'];
  const html=await Promise.all(files.map(f=>fetch(f,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`Falha ao carregar ${f}`);return r.text()})));
  deck.innerHTML=html.join('\n');
  initPresentation();
  initAssetModal();
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

const assetExamples={
  instagram:{
    eyebrow:'Instagram · Aquisição + autoridade',
    title:'Como o MBV entra no feed',
    body:`
      <div class="modal-grid">
        <div class="modal-mock"><img src="img/mbv/peca-carrossel.webp" alt="Exemplo de carrossel MBV"></div>
        <div class="modal-copy">
          <h4>Da crença à intenção</h4>
          <p>O Instagram prepara a compra em sequência: primeiro ajuda a pessoa a perceber um problema, depois explica o método e só então apresenta o produto.</p>
          <div class="modal-list">
            <div><b>Hook:</b> “Seu treino de glúteo evoluiu ou só mudou?”</div>
            <div><b>Educação:</b> “5 sinais de que seu treino está no piloto automático.”</div>
            <div><b>Autoridade:</b> “Como a Kati avalia um treino de glúteo.”</div>
            <div><b>CTA:</b> “Comente MBV para fazer o diagnóstico.”</div>
          </div>
        </div>
      </div>`,
    note:'O objetivo não é transformar o feed em catálogo de produto. É fazer a oferta aparecer depois que a audiência já entendeu o problema, o método e a autoridade técnica.'
  },
  blog:{
    eyebrow:'Blog · Busca + profundidade',
    title:'Um hub editorial para treino de glúteo',
    body:`
      <div class="modal-grid">
        <div class="modal-mock"><img src="img/mbv/kati-execucao.webp" alt="Kati executando exercício em academia"></div>
        <div class="modal-copy">
          <h4>Artigo pilar</h4>
          <p><b>Treino de glúteo: guia completo para hipertrofia</b></p>
          <p>Esse conteúdo organiza o cluster e direciona para temas que respondem dúvidas reais da audiência.</p>
          <div class="modal-list">
            <div>Quantas vezes por semana treinar glúteo?</div>
            <div>Como fazer progressão de carga?</div>
            <div>O que realmente define um bom exercício?</div>
            <div>Por que você sente outros músculos mais do que o glúteo?</div>
          </div>
        </div>
      </div>`,
    note:'O blog transforma a campanha em ativo evergreen: busca → conteúdo → diagnóstico → CRM → MBV. O objetivo é continuar captando demanda depois que a janela promocional termina.'
  },
  newsletter:{
    eyebrow:'Newsletter · Recorrência editorial',
    title:'A oferta entra na hora certa',
    body:`
      <div class="email-preview">
        <div class="subject">Seu treino muda ou progride?</div>
        <p>Trocar um exercício é fácil. Saber se ele está produzindo evolução exige acompanhar o que muda na execução e no desempenho ao longo do tempo.</p>
        <p>Nas próximas edições, a Kati mostra quais variáveis observa quando avalia um treino de glúteo — e como isso se conecta ao método que está sendo construído.</p>
        <span class="cta">Fazer o diagnóstico MBV</span>
      </div>`,
    note:'A newsletter acompanha a evolução mental da audiência. Primeiro consciência, depois educação e autoridade; a oferta só entra quando já existe contexto.'
  },
  crm:{
    eyebrow:'CRM / ManyChat · Memória + intenção',
    title:'Do comentário a um lead com contexto',
    body:`
      <div class="modal-grid">
        <div class="chat-preview">
          <div class="bubble">O time do Viana preparou um diagnóstico rápido para entender como está estruturado seu treino de glúteo. Vamos começar?</div>
          <div class="bubble user">Vamos.</div>
          <div class="bubble">Você registra carga e repetições?</div>
          <div class="bubble user">Às vezes.</div>
          <div class="bubble">Qual é sua maior dificuldade hoje?</div>
          <div class="bubble user">Não sei se estou realmente progredindo.</div>
        </div>
        <div class="modal-copy">
          <h4>Contexto salvo no CRM</h4>
          <div class="crm-fields">
            <code>source = instagram</code><code>interest = glúteos</code>
            <code>tracking = às vezes</code><code>pain = progressão</code>
            <code>stage = diagnostic</code><code>purchase = false</code>
          </div>
          <p>O lead deixa de ser só nome + e-mail e passa a carregar sinais que orientam nurture, oferta e próximos produtos.</p>
        </div>
      </div>`,
    note:'Automação aqui não significa disparar mais mensagens. Significa preservar contexto e usar comportamento para decidir qual mensagem faz sentido depois.'
  },
  cozinha:{
    eyebrow:'Cozinha do Viana · Cross-sell contextual',
    title:'Lifestyle pode apoiar a jornada sem competir com o MBV',
    body:`
      <div class="modal-copy">
        <h4>Exemplo de conexão editorial</h4>
        <p>Depois de conteúdos de treino, a Cozinha pode entrar com receitas práticas ligadas à rotina de quem treina — sem prometer efeito específico sobre glúteos.</p>
        <div class="recipe-grid">
          <div class="recipe"><b>Pós-treino prático</b><span>Receita rápida + organização da rotina.</span></div>
          <div class="recipe"><b>Café da manhã proteico</b><span>Conteúdo de lifestyle conectado ao objetivo.</span></div>
          <div class="recipe"><b>Refeição para levar</b><span>Conveniência para quem mantém rotina de treino.</span></div>
        </div>
        <p><b>CTA possível:</b> “Quer organizar também a parte do treino? Conheça o MBV.”</p>
      </div>`,
    note:'O cross-sell só entra quando existe contexto. A Cozinha amplia a relação com a marca; o MBV organiza a parte de treino. Um produto reforça o ecossistema do outro sem criar promessa artificial.'
  },
  consultoria:{
    eyebrow:'Consultoria · Maior personalização',
    title:'O MBV também pode qualificar quem precisa de acompanhamento',
    body:`
      <div class="modal-copy">
        <h4>Uma progressão possível</h4>
        <div class="modal-list">
          <div><b>1.</b> A pessoa compra o MBV e começa a aplicar o método.</div>
          <div><b>2.</b> Durante uso ou diagnóstico, demonstra necessidade de adaptação individual.</div>
          <div><b>3.</b> CRM identifica esse contexto e abre espaço para comunicação específica.</div>
          <div><b>4.</b> A Consultoria aparece como próximo passo apenas quando houver fit.</div>
        </div>
        <p>Isso evita empurrar high-ticket cedo demais e transforma o MBV em mecanismo de qualificação.</p>
      </div>`,
    note:'O objetivo não é fazer todo comprador do MBV migrar para a Consultoria. É criar uma jornada em que a necessidade de personalização se torna visível e pode ser trabalhada no momento certo.'
  }
};

function initAssetModal(){
  const modal=document.getElementById('assetModal');
  if(!modal)return;
  const title=modal.querySelector('#assetModalTitle');
  const eyebrow=modal.querySelector('#assetModalEyebrow');
  const body=modal.querySelector('#assetModalBody');
  const note=modal.querySelector('#assetModalNote');
  const close=()=>{
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
  };
  const open=(key)=>{
    const item=assetExamples[key];
    if(!item)return;
    eyebrow.textContent=item.eyebrow;
    title.textContent=item.title;
    body.innerHTML=item.body;
    note.textContent=item.note;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
    modal.querySelector('.asset-modal-close')?.focus();
  };
  document.querySelectorAll('[data-asset]').forEach(el=>el.addEventListener('click',()=>open(el.dataset.asset)));
  modal.querySelector('.asset-modal-close')?.addEventListener('click',close);
  modal.querySelector('.asset-modal-backdrop')?.addEventListener('click',close);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))close()});
}

loadDeck().catch(err=>{
  document.getElementById('deck').innerHTML=`<section class="panel"><div class="wrap"><div class="intro"><p class="eyebrow">Erro de carregamento</p><h2>Não foi possível carregar a apresentação.</h2><p class="sub">${err.message}</p></div></div></section>`;
});