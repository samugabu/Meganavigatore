const ratedAll=()=>[...D.film.map(x=>["film",x]),...D.animazione.map(x=>["animazione",x]),...D.serie_tv.map(x=>["serie_tv",x])].filter(([n,x])=>!x.da_guardare&&x.valutazione!=null);
const rbars=r=>r.length?r.map(([l,v,c])=>`<div class="br"><span>${l} <small>(${c})</small></span><i style="--w:${Math.min(100,v*10)}%"></i><b>${v.toFixed(1)}</b></div>`).join(""):"<p>Dati insufficienti</p>";
function avgBy(fn,min){const m={};ratedAll().forEach(([n,x])=>fn(x).forEach(k=>{(m[k]=m[k]||{s:0,n:0});m[k].s+=+x.valutazione;m[k].n++}));return Object.entries(m).filter(([k,v])=>v.n>=min).map(([k,v])=>[k,v.s/v.n,v.n]).sort((a,b)=>b[1]-a[1]||b[2]-a[2])}
const doneDate=(n,x)=>isFilm(n)?x.data_visione:n=="serie_tv"?(x.data_fine||x.data_inizio):n=="libri"?x.data_fine:null;
function statistiche(){
const g=avgBy(x=>(x.genere||"").split(",").map(s=>s.trim()).filter(Boolean),3).map(([k,v,c])=>[gi(k)+" "+e(k),v,c]),
p=avgBy(x=>x.piattaforma?[x.piattaforma]:[],3).map(([k,v,c])=>[(PLT[k]||["📡"])[0]+" "+e(k),v,c]),
lung=D.serie_tv.map(x=>[x,skm(x)]).filter(a=>a[1]>0).sort((a,b)=>b[1]-a[1]).slice(0,10),
ev=[];names.forEach(n=>{if(n=="lego")return;D[n].forEach(x=>{const d=doneDate(n,x);if(d&&/^\d{4}-\d{2}/.test(d)&&!x.da_guardare&&!(n=="libri"&&x.stato_da_leggere))ev.push({n,y:d.slice(0,4),m:d.slice(0,7),v:x.valutazione})})});
const cn=(a,n)=>a.filter(x=>x.n==n).length,av=a=>{const v=a.map(x=>x.v).filter(x=>x!=null);return v.length?" · ★ "+(v.reduce((s,x)=>s+ +x,0)/v.length).toFixed(1):""};
const yrs=[...new Set(ev.map(x=>x.y))].sort(),my=Math.max(1,...yrs.map(y=>ev.filter(x=>x.y==y).length));
const rowsY=yrs.map(y=>{const a=ev.filter(x=>x.y==y);return `<div class="br" style="grid-template-columns:50px 1fr 210px"><b style="text-align:left">${y}</b><i style="--w:${a.length/my*100}%"></i><small>🎬 ${cn(a,"film")} · 🎞️ ${cn(a,"animazione")} · 📺 ${cn(a,"serie_tv")} · 📚 ${cn(a,"libri")}${av(a)}</small></div>`}).join("");
const mo=[];for(let i=11;i>=0;i--){const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-i);mo.push([d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0"),d.toLocaleDateString("it-IT",{month:"short",year:"2-digit"})])}
const mm=Math.max(1,...mo.map(([k])=>ev.filter(x=>x.m==k).length));
const rowsM=mo.map(([k,l])=>{const a=ev.filter(x=>x.m==k);return `<div class="br" style="grid-template-columns:60px 1fr 210px"><b style="text-align:left">${e(l)}</b><i style="--w:${a.length/mm*100}%"></i><small>${a.length?"🎬 "+cn(a,"film")+" · 🎞️ "+cn(a,"animazione")+" · 📺 "+cn(a,"serie_tv")+" · 📚 "+cn(a,"libri"):"nessuno"}</small></div>`}).join("");
const nf=D.film.filter(x=>x.data_visione).length;
return `<div class="bar"><h2 style="margin:0">Statistiche</h2><small>${ratedAll().length} titoli con voto</small></div>`+
acc("Voto medio per genere",`<div class="pn">${rbars(g)}<small>Film e serie, solo generi con almeno 3 titoli votati.</small></div>`)+
acc("Voto medio per piattaforma",`<div class="pn">${rbars(p)}<small>Film e serie, solo piattaforme con almeno 3 titoli votati.</small></div>`)+
acc("Serie più lunghe",`<div class="pn">${lung.length?lung.map(([x,m],i)=>`<div class="br" style="grid-template-columns:24px 1fr auto"><b>${i+1}</b><span>📺 ${e(x.titolo)}</span><small>${epExact(x)?"":"≈ "}${epTot(x)} episodi · ${fhm(m)}</small></div>`).join(""):"<p>Dati insufficienti</p>"}</div>`)+
acc("Andamento nel tempo",`<div class="pn"><h4>Titoli completati per anno</h4>${rowsY||"<p>Nessuna data disponibile</p>"}<h4 style="margin-top:18px">Ultimi 12 mesi</h4>${rowsM}<small>Serie: data di fine (o di inizio); libri: data di fine; film: data di visione, che puoi indicare nel modulo (${nf} film con data).</small></div>`)}
