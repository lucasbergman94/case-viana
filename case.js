const panels=[...document.querySelectorAll('.panel')], links=[...document.querySelectorAll('.nav a')], current=document.getElementById('current'), progress=document.getElementById('progress');
const updateProgress=()=>{const h=document.documentElement;const max=h.scrollHeight-h.clientHeight;progress.style.width=(max?scrollY/max*100:0)+'%'};
addEventListener('scroll',updateProgress,{passive:true});
updateProgress();
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){current.textContent=e.target.dataset.slide;links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}}),{threshold:.55});
panels.forEach(p=>io.observe(p));