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
    title:'O feed durante as seis semanas',
    body:`
      <div class="ig-layout">
        <div class="ig-mock">
          <div class="ig-head">
            <div class="ig-av">V</div>
            <div class="ig-id">
              <b>consultoriadoviana</b>
              <div class="ig-stats"><span><b>1.284</b> posts</span><span><b>88,1 mil</b> seguidores</span><span><b>312</b> seguindo</span></div>
              <p>Consultoria de treino e dieta · Marcos Viana<br>Método, execução e progressão.</p>
            </div>
          </div>
          <div class="ig-tabs"><span class="on">Publicações</span><span>Reels</span><span>Marcadas</span></div>
          <div class="ig-grid">
            <figure class="ig-post"><img src="img/mbv/kati-execucao.webp" alt=""><span class="ig-kind">Reel</span><figcaption>Seu treino evoluiu ou só mudou?</figcaption></figure>
            <figure class="ig-post ig-post--txt ig-post--marcos"><span class="ig-kind">Colab</span><div class="ig-txt">Não teve reunião para escolher quem assinaria</div><figcaption>Chancela do Marcos · 21/10</figcaption></figure>
            <figure class="ig-post"><img src="img/mbv/peca-carrossel.webp" alt=""><span class="ig-kind">Carrossel</span><figcaption>5 sinais de piloto automático</figcaption></figure>
            <figure class="ig-post ig-post--txt"><span class="ig-kind">Reel</span><div class="ig-txt">Queimou = funcionou?</div><figcaption>Desmistificação · Reel 03</figcaption></figure>
            <figure class="ig-post"><img src="img/mbv/kati-retrato.webp" alt=""><span class="ig-kind">Reel</span><figcaption>A Kati olha 3 coisas antes de trocar</figcaption></figure>
            <figure class="ig-post ig-post--txt"><span class="ig-kind">Enquete</span><div class="ig-txt">Você anota carga e repetições?</div><figcaption>Story · research e engajamento</figcaption></figure>
            <figure class="ig-post ig-post--txt ig-post--proof"><span class="ig-kind">Carrossel</span><div class="ig-txt">De 50 para 60 kg no hip thrust em 5 semanas</div><figcaption>Prova · beta com 15 alunas</figcaption></figure>
            <figure class="ig-post"><img src="img/mbv/capa-digital.webp" alt=""><span class="ig-kind">Feed</span><figcaption>O MBV abriu · 10/11</figcaption></figure>
            <figure class="ig-post ig-post--txt ig-post--excl"><span class="ig-kind">Carrossel</span><div class="ig-txt">Treina há menos de 6 meses? Ainda não é para você</div><figcaption>Objeção · vende recusando</figcaption></figure>
          </div>
        </div>
        <div class="ig-side">
          <div class="ig-legend">
            <h4>Mix por pilar nas 6 semanas</h4>
            <div class="bar"><i style="--w:30%"></i><span>Diagnóstico <b>30%</b></span></div>
            <div class="bar"><i style="--w:20%"></i><span>Desmistificação <b>20%</b></span></div>
            <div class="bar"><i style="--w:20%"></i><span>Método <b>20%</b></span></div>
            <div class="bar"><i style="--w:15%"></i><span>Prova <b>15%</b></span></div>
            <div class="bar"><i style="--w:15%"></i><span>Produto <b>15%</b></span></div>
            <p class="caption">Um feed por dia útil no aquecimento, dois na semana de lançamento. Produto nunca em dois dias seguidos.</p>
          </div>
          <h4>Legenda pronta · post 3 do feed</h4>
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
    title:'O cluster que continua vendendo em janeiro',
    body:`
      <div class="cluster-mock">
        <article class="cl-pillar">
          <span class="cl-tag">Artigo pilar · categoria Treino</span>
          <b>Treino de glúteo: o guia completo para quem já treina e parou de ver resultado</b>
          <p>O recorte "para quem já treina" abre mão de volume e ganha qualificação. O blog alimenta o diagnóstico, não o pageview. Publica 22/10, antes do aquecimento.</p>
          <div class="cl-flow"><span>Google</span><i></i><span>Artigo</span><i></i><span>Diagnóstico</span><i></i><span>CRM</span><i></i><span>MBV</span></div>
        </article>
        <div class="cl-sats">
          <article class="cl-sat"><b>Quantas vezes por semana treinar glúteo?</b><span class="cl-meta">Treino · busca de dúvida · alto volume</span><span class="cl-obj">Captura topo e manda para o diagnóstico</span></article>
          <article class="cl-sat"><b>Progressão de carga no glúteo: quando subir e quanto</b><span class="cl-meta">Treino · alta aderência à tese</span><span class="cl-obj">É o artigo que mais qualifica: quem busca isso é o ICP</span></article>
          <article class="cl-sat"><b>Sinto mais a coxa do que o glúteo: o que ajustar</b><span class="cl-meta">Treino · dor específica</span><span class="cl-obj">Dor nomeada, conversão de lead mais alta do cluster</span></article>
          <article class="cl-sat"><b>Treino de glúteo em casa dá resultado?</b><span class="cl-meta">Treino · objeção nº 1 do direct</span><span class="cl-obj">Responde a dúvida que mais apareceu, antes de virar reembolso</span></article>
          <article class="cl-sat"><b>Hip thrust ou agachamento: o critério da Kati</b><span class="cl-meta">Treino · comparativo, muito buscado</span><span class="cl-obj">Comparativo puxa link e posiciona a especialista</span></article>
          <article class="cl-sat"><b>Quanto tempo demora para ver diferença no glúteo?</b><span class="cl-meta">Treino · a pergunta mais buscada do nicho</span><span class="cl-obj">Traz volume frio e ensina a expectativa certa</span></article>
          <article class="cl-sat cl-sat--alt"><b>O que 15 alunas mudaram no treino em 8 semanas</b><span class="cl-meta">Cases de Sucesso · publica 19/11</span><span class="cl-obj">Usa a categoria que estava sobrando e vira prova social</span></article>
          <article class="cl-sat cl-sat--alt"><b>Método Bumbum Viana: o que é, para quem é e o que tem dentro</b><span class="cl-meta">Treino · fundo de funil</span><span class="cl-obj">Captura quem busca a marca depois de ver um Reel</span></article>
        </div>
      </div>`,
    note:'Oito pautas, duas categorias. O Search Console devolve as queries que viram a pauta seguinte e, se o modelo provar valor, o próximo Método. Instagram gera o pico; isto aqui continua encontrando gente em fevereiro.'
  },
  newsletter:{
    eyebrow:'Newsletter · Recorrência editorial',
    title:'A oferta entra na hora certa',
    body:`
      <div class="news-mock">
        <div class="email-preview">
          <div class="mail-chrome"><span class="dot"></span><span class="dot"></span><span class="dot"></span><em>Terça, 20/10 · 08h00</em></div>
          <div class="subject">Você trocou de treino quantas vezes esse ano?</div>
          <p class="preheader">A Kati diz que a troca quase nunca é o problema certo.</p>
          <p>Trocar de exercício é a coisa mais fácil de fazer na academia. É também a primeira coisa que a gente faz quando o resultado trava.</p>
          <p>A Kati Santana atende alunas da Consultoria há três anos e começa toda avaliação pelo mesmo lugar. Antes de olhar qual exercício você faz, ela pergunta quanto você levantava nele quatro semanas atrás. Quase ninguém sabe responder. E quando ninguém sabe responder, não dá para dizer se o exercício falhou ou se ele nunca chegou a ser testado.</p>
          <p>Nas próximas três terças ela mostra o que olha antes de mexer em qualquer coisa: o registro, a progressão de carga e o critério que faz um exercício valer a vaga no seu treino.</p>
          <p>Hoje o pedido é pequeno. No próximo treino de glúteo, anote a carga e as repetições de dois exercícios. Só isso.</p>
          <span class="cta">Fazer o diagnóstico de 5 perguntas</span>
          <p class="fineprint">Leva 2 minutos, acontece no direct do Instagram e termina dizendo qual dos três perfis é o seu.</p>
          <div class="mail-footer">Consultoria do Viana · <b>o CTA da Consultoria continua aqui no rodapé</b>, nas cinco edições</div>
        </div>
        <div class="news-side">
          <h4>As cinco terças, e o que muda em cada uma</h4>
          <div class="news-rail">
            <article class="nw"><span class="nw-date">20/10</span><b>Você trocou de treino quantas vezes esse ano?</b><span class="nw-goal">Problema · o produto não aparece</span></article>
            <article class="nw"><span class="nw-date">27/10</span><b>3 erros, 500 diagnósticos, o mesmo padrão</b><span class="nw-goal">Captura · dado proprietário puxa o diagnóstico</span></article>
            <article class="nw"><span class="nw-date">03/11</span><b>O que a Kati olha antes de trocar um exercício</b><span class="nw-goal">Confiança · teaser da pré-venda de amanhã</span></article>
            <article class="nw nw--hi"><span class="nw-date">10/11</span><b>O MBV abriu: 8 semanas de glúteo, assinadas pela Kati</b><span class="nw-goal">Venda · a única edição que abre com oferta</span></article>
            <article class="nw"><span class="nw-date">17/11</span><b>2.000 mulheres responderam. 61% travam no mesmo ponto.</b><span class="nw-goal">Reengajar · o dado do lançamento vira conteúdo</span></article>
          </div>
          <h4>O que não muda</h4>
          <div class="modal-list">
            <div>A estrutura fixa de terça continua: mesma abertura, mesmo bloco de leitura, mesmo rodapé.</div>
            <div>O CTA da Consultoria não sai. O MBV ocupa o bloco principal e a Consultoria segue no rodapé.</div>
            <div>Quem já comprou o MBV para de receber a régua e passa a receber a trilha de onboarding.</div>
            <div>Os números de 17/11 só entram depois de existirem. Nenhum percentual é estimado antes.</div>
          </div>
        </div>
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
        <div class="ladder">
          <div class="rung"><span class="rung-price">Grátis</span><b>Conteúdo</b><span class="rung-desc">Feed, diagnóstico e newsletter</span></div>
          <div class="rung rung--now"><span class="rung-price">R$97</span><b>MBV</b><span class="rung-desc">O método por escrito, para aplicar sozinha</span><span class="rung-flag">este lançamento</span></div>
          <div class="rung rung--gap"><span class="rung-price">R$397</span><b>Turma MBV</b><span class="rung-desc">8 semanas, 4 encontros em grupo, correção por vídeo</span><span class="rung-flag">o degrau que falta</span></div>
          <div class="rung"><span class="rung-price">R$1.099</span><b>Consultoria</b><span class="rung-desc">Acompanhamento individual</span></div>
        </div>
        <p>Sem o degrau do meio, 260 compradoras rendem 6 alunas. Com ele, 31 sobem para a Turma, dessas 18% migram para a Consultoria, e o resultado é <b>10 alunas mais R$7.400 de margem no caminho</b>. É isso que transforma a tese de produto-ponte de afirmação em conta.</p>
      </div>`,
    note:'Proposta para o horizonte 2, não para este lançamento. Mas é ela que transforma a tese de produto-ponte de afirmação em conta, e por isso entra no plano desde já como hipótese a validar com os primeiros compradores.'
  }
};


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
