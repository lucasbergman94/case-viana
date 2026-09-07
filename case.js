/* ============================================================
   MBV · case · runtime
   Os paineis sao embutidos no index.html por build.js.
   O fetch abaixo e apenas um fallback: se o HTML ja veio pronto,
   nada e buscado na rede.
   ============================================================ */

async function loadDeck(){
  const deck=document.getElementById('deck');
  if(!deck.querySelector('.panel[data-slide]')){
    const files=['sections-a.html','sections-b.html','sections-c.html','sections-d.html'];
    const res=await Promise.allSettled(
      files.map(f=>fetch(f).then(r=>{if(!r.ok)throw new Error(f);return r.text()}))
    );
    const ok=res.filter(r=>r.status==='fulfilled').map(r=>r.value);
    if(ok.length)deck.innerHTML=ok.join('\n');
  }
  initPresentation();
  initAssetModal();
  if(location.hash){
    const t=document.querySelector(location.hash);
    if(t)setTimeout(()=>t.scrollIntoView({block:'start'}),80);
  }
}

function initPresentation(){
  const panels=[...document.querySelectorAll('.panel')];
  if(!panels.length)return;
  const links=[...document.querySelectorAll('.nav a[href^="#s"]')];
  const current=document.getElementById('current');
  const progress=document.getElementById('progress');

  const updateProgress=()=>{
    const h=document.documentElement;
    const max=h.scrollHeight-h.clientHeight;
    progress.style.width=(max>0?scrollY/max*100:0)+'%';
  };
  addEventListener('scroll',updateProgress,{passive:true});
  addEventListener('resize',updateProgress);
  addEventListener('load',updateProgress);
  updateProgress();

  /* Escolhe o painel mais proximo do centro da viewport.
     Independe da altura do painel: no mobile eles crescem e um
     threshold fixo nunca dispararia. */
  const io=new IntersectionObserver(entries=>{
    const mid=innerHeight/2;
    let best=null,bestDist=Infinity;
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      const r=e.target.getBoundingClientRect();
      const d=Math.abs((r.top+r.bottom)/2-mid);
      if(d<bestDist){bestDist=d;best=e.target}
    });
    if(!best)return;
    current.textContent=best.dataset.slide;
    document.body.classList.toggle('on-paper',best.classList.contains('paper'));
    links.forEach(a=>{
      const on=a.getAttribute('href')==='#'+best.id;
      a.classList.toggle('active',on);
      if(on)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');
    });
  },{rootMargin:'-45% 0px -45% 0px',threshold:0});
  panels.forEach(p=>io.observe(p));
}

/* ============================================================
   Exemplos por ativo (painel 02 · Diagnostico)
   Cada modal carrega uma peca de texto real, pronta para publicar,
   e nao a descricao de uma peca.
   ============================================================ */
const assetExamples={
  instagram:{
    eyebrow:'Instagram · Aquisição + autoridade',
    title:'Como o MBV entra no feed',
    body:`
      <div class="modal-grid">
        <div class="modal-mock"><img src="img/mbv/peca-carrossel.webp" alt="Carrossel do pilar de diagnóstico do MBV"></div>
        <div class="modal-copy">
          <h4>Legenda pronta · carrossel de diagnóstico</h4>
          <div class="copy-piece">
            <p><b>5 sinais de que o seu treino de glúteo está no piloto automático.</b></p>
            <p>1. Você treina glúteo há mais de um ano e não sabe dizer quanto levantava em março.<br>
               2. Troca de exercício quando enjoa dele, e não quando ele para de entregar.<br>
               3. Termina a série olhando o relógio, não a repetição que ainda dava.<br>
               4. Escolhe o exercício da semana pelo que apareceu no feed.<br>
               5. Mede se o treino foi bom pela queimação e pela dor do dia seguinte.</p>
            <p>A Kati Santana atende alunas da Consultoria há três anos e diz que o item 1 é o que mais aparece. Não porque a aluna treina pouco. É porque ninguém ensinou que treino sem registro não tem como ser comparado, e sem comparação o treino muda todo mês enquanto a carga fica parada.</p>
            <p>O teste é rápido. Pega o seu treino de glúteo de hoje e responde três coisas: quanto você levantou, há quantas semanas esse exercício está aí, e o que precisa acontecer para você trocar.</p>
            <p>Travou em duas? Você não está sozinha, e dá para arrumar em três semanas.</p>
            <p>Comenta <b>MBV</b> que a gente te manda no direct o diagnóstico de 5 perguntas. No fim ele diz qual dos três perfis é o seu e o que a Kati ajustaria primeiro.</p>
          </div>
        </div>
      </div>`,
    note:'O feed não vira catálogo. Ele leva a leitora do "não percebi o problema" até "quero saber se isso serve para mim", e o CTA único do aquecimento é sempre o mesmo: comentar MBV.'
  },
  blog:{
    eyebrow:'Blog · Busca + profundidade',
    title:'Um hub editorial para treino de glúteo',
    body:`
      <div class="modal-grid">
        <div class="modal-mock"><img src="img/mbv/kati-execucao.webp" alt="Kati Santana executando hip thrust na academia"></div>
        <div class="modal-copy">
          <h4>Artigo pilar</h4>
          <p><b>Treino de glúteo: o guia completo para quem já treina e parou de ver resultado</b></p>
          <p>O recorte "para quem já treina" abre mão de volume de busca e ganha qualificação. O blog existe para alimentar o diagnóstico, não para alimentar pageview.</p>
          <div class="modal-list">
            <div>Quantas vezes por semana treinar glúteo? A resposta depende de 3 coisas</div>
            <div>Progressão de carga no glúteo: quando subir, quanto subir e quando esperar</div>
            <div>Hip thrust ou agachamento: o critério que a Kati usa antes de escolher</div>
            <div>Sinto mais a coxa do que o glúteo: por que acontece e o que ajustar</div>
            <div>Quanto tempo demora para ver diferença no glúteo?</div>
          </div>
        </div>
      </div>`,
    note:'Categoria Treino no blog do Viana. Todo artigo termina no diagnóstico, e o Search Console devolve as perguntas que viram a próxima pauta e, mais adiante, o próximo produto.'
  },
  newsletter:{
    eyebrow:'Newsletter · Recorrência editorial',
    title:'A oferta entra na hora certa',
    body:`
      <div class="email-preview">
        <div class="subject">Você trocou de treino quantas vezes esse ano?</div>
        <p class="preheader">A Kati diz que a troca quase nunca é o problema certo.</p>
        <p>Trocar de exercício é a coisa mais fácil de fazer na academia. É também a primeira coisa que a gente faz quando o resultado trava.</p>
        <p>A Kati Santana atende alunas da Consultoria há três anos e começa toda avaliação pelo mesmo lugar. Antes de olhar qual exercício você faz, ela pergunta quanto você levantava nele quatro semanas atrás. Quase ninguém sabe responder. E quando ninguém sabe responder, não dá para dizer se o exercício falhou ou se ele nunca chegou a ser testado.</p>
        <p>Nas próximas três terças ela mostra o que olha antes de mexer em qualquer coisa: o registro, a progressão de carga e o critério que faz um exercício valer a vaga no seu treino.</p>
        <p>Hoje o pedido é pequeno. No próximo treino de glúteo, anote a carga e as repetições de dois exercícios. Só isso.</p>
        <span class="cta">Fazer o diagnóstico de 5 perguntas</span>
        <p class="fineprint">Leva 2 minutos, acontece no direct do Instagram e termina dizendo qual dos três perfis é o seu.</p>
      </div>`,
    note:'A newsletter mantém a estrutura fixa de terça e o CTA da Consultoria no rodapé. O MBV ocupa o bloco principal em cinco edições e sai depois, sem transformar o canal em campanha permanente.'
  },
  crm:{
    eyebrow:'CRM / ManyChat · Memória + intenção',
    title:'Do comentário a um lead com contexto',
    body:`
      <div class="modal-grid">
        <div class="chat-preview">
          <div class="bubble">Oi! Aqui é do Instagram da Consultoria. São 5 perguntas rápidas sobre o seu treino de glúteo e no fim eu digo qual é o seu perfil e o que a Kati ajustaria primeiro. Menos de 2 minutos. Bora?</div>
          <div class="bubble user">Bora.</div>
          <div class="bubble">1 de 5. Há quanto tempo você treina glúteo com constância?</div>
          <div class="bubble user">Mais de 2 anos.</div>
          <div class="bubble">3 de 5. Você anota carga e repetições?</div>
          <div class="bubble user">Às vezes.</div>
          <div class="bubble">4 de 5. O que mais te trava hoje?</div>
          <div class="bubble user">Não sei se estou progredindo.</div>
          <div class="bubble">Pronto. Você é <b>perfil B</b>, o mais comum aqui: treina há mais de um ano, não falta, e mesmo assim não consegue provar que ficou mais forte. O que a Kati faria primeiro: escolher 2 exercícios, anotar carga e repetições por 3 semanas e não trocar nada nesse período.<br><br>Quer o resultado completo, com os 3 ajustes por escrito e o tracker de 4 semanas? Me manda o seu melhor e-mail.</div>
        </div>
        <div class="modal-copy">
          <h4>O que fica gravado</h4>
          <div class="crm-fields">
            <code>origem = instagram</code><code>campanha = mbv_lancamento</code>
            <code>tempo_treino = 2a+</code><code>registro = as_vezes</code>
            <code>trava = progressao</code><code>perfil = b</code>
            <code>etapa = diagnostico</code><code>comprou = nao</code>
          </div>
          <p>O perfil é entregue de graça antes de pedir o e-mail. O e-mail vira troca por um upgrade real, não pedágio, e quem abandona no meio recebe uma única mensagem de retomada em 20 horas, dentro da janela da Meta.</p>
        </div>
      </div>`,
    note:'Automação aqui não é disparar mais mensagem. É guardar contexto e usar comportamento para decidir qual mensagem faz sentido depois. Os mesmos nomes de campo do Anexo 3, em português e sem acento.'
  },
  cozinha:{
    eyebrow:'Cozinha do Viana · Cross-sell contextual',
    title:'O fit existe e tem data',
    body:`
      <div class="modal-copy">
        <h4>Nas duas direções</h4>
        <div class="modal-list">
          <div><b>Cozinha → MBV:</b> assinante entra na pré-venda com prioridade em 04/11, antes da abertura pública.</div>
          <div><b>MBV → Cozinha:</b> quem comprou recebe a oferta no dia 14 pós-compra, quando já aplicou o método e já saiu da janela de reembolso.</div>
        </div>
        <p>O dia 14 não é arbitrário. É quando quem está treinando glúteo com carga subindo bate na parede da alimentação, que é exatamente o que a Cozinha resolve.</p>
        <p><b>Texto do e-mail:</b> "Você subiu carga em dois exercícios nas últimas três semanas. A próxima trava normalmente não é o treino. A Cozinha do Viana tem 13 mil receitas e o filtro de proteína por refeição."</p>
      </div>`,
    note:'Cross-sell com timing e argumento, não com "quando houver fit". A Cozinha amplia a relação; o MBV organiza o treino. Um produto reforça o outro sem criar promessa artificial.'
  },
  consultoria:{
    eyebrow:'Consultoria · Maior personalização',
    title:'O degrau que falta entre R$97 e R$1.099',
    body:`
      <div class="modal-copy">
        <h4>Um salto de 11x ninguém sobe</h4>
        <p>Quem compra um ebook está comprando autonomia. Quem contrata a Consultoria está comprando delegação. São trabalhos opostos, e por isso a migração direta roda entre 1% e 3%, não os 5% que se costuma projetar.</p>
        <div class="modal-list">
          <div><b>Gratuito</b> · conteúdo, diagnóstico, newsletter</div>
          <div><b>MBV · R$97</b> · o método por escrito, para aplicar sozinha</div>
          <div><b>Turma MBV · R$397</b> · 8 semanas, 4 encontros em grupo com a Kati, correção de execução por vídeo</div>
          <div><b>Consultoria · R$1.099</b> · acompanhamento individual</div>
        </div>
        <p>A Turma é onde a conversão acontece de verdade: quem pagou R$397 por acompanhamento em grupo já comprou delegação uma vez, e a migração de grupo para individual roda entre 15% e 20%.</p>
      </div>`,
    note:'Proposta para o horizonte 2, não para este lançamento. Mas é ela que transforma a tese de produto-ponte de afirmação em conta, e por isso entra no plano desde já como hipótese a validar com os primeiros compradores.'
  }
};

function initAssetModal(){
  const modal=document.getElementById('assetModal');
  if(!modal)return;
  const title=modal.querySelector('#assetModalTitle');
  const eyebrow=modal.querySelector('#assetModalEyebrow');
  const body=modal.querySelector('#assetModalBody');
  const note=modal.querySelector('#assetModalNote');
  const FOCUSABLE='a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';
  let lastFocus=null;

  const close=()=>{
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
    if(lastFocus&&lastFocus.focus)lastFocus.focus();
  };
  const open=(key,trigger)=>{
    const item=assetExamples[key];
    if(!item)return;
    lastFocus=trigger||null;
    eyebrow.textContent=item.eyebrow;
    title.textContent=item.title;
    body.innerHTML=item.body;
    note.textContent=item.note;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
    const c=modal.querySelector('.asset-modal-close');
    if(c)c.focus();
  };

  document.querySelectorAll('[data-asset]').forEach(el=>
    el.addEventListener('click',()=>open(el.dataset.asset,el)));
  const closeBtn=modal.querySelector('.asset-modal-close');
  if(closeBtn)closeBtn.addEventListener('click',close);
  const backdrop=modal.querySelector('.asset-modal-backdrop');
  if(backdrop)backdrop.addEventListener('click',close);

  document.addEventListener('keydown',e=>{
    if(!modal.classList.contains('open'))return;
    if(e.key==='Escape'){close();return}
    if(e.key!=='Tab')return;
    const f=[...modal.querySelectorAll(FOCUSABLE)].filter(n=>n.offsetParent!==null);
    if(!f.length)return;
    const first=f[0],last=f[f.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  });
}

loadDeck().catch(()=>{
  const deck=document.getElementById('deck');
  if(!deck||deck.querySelector('.panel[data-slide]'))return;
  deck.innerHTML='<section class="panel"><div class="wrap"><div class="intro">'+
    '<p class="eyebrow">MBV · Case</p>'+
    '<h2>Recarregue a página para ver a apresentação.</h2>'+
    '<p class="sub">Enquanto isso, os documentos de trabalho do plano estão em '+
    '<a href="anexos/" style="color:var(--pink);text-decoration:underline">/anexos</a>.</p>'+
    '</div></div></section>';
});
