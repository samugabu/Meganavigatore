const miss=(n,x)=>{const f=[];if(n=="film"||n=="serie_tv"){if(!x.genere)f.push("genere");if(!x.piattaforma)f.push("piattaforma");if(n=="film"&&!x.durata)f.push("durata");if(n=="serie_tv"&&!x.lunghezza_stagioni)f.push("lunghezza_stagioni");if(!x.da_guardare&&x.valutazione==null)f.push("valutazione")}return f};
const allGenres=()=>[...new Set([...D.film,...D.serie_tv].flatMap(x=>(x.genere||"").split(",").map(s=>s.trim()).filter(Boolean)))].sort();
let TYS=[];
const serieGaps=x=>{const g=[];if(!epMatch(x))g.push("s");if(!epExact(x))g.push("e");if(!(+x.durata_episodio>0))g.push("d");return g};
function scan(){const dup=[],ty=[],mi=[];
names.forEach(n=>{const m={};D[n].forEach(x=>{const t=x[T[n].t];if(!t)return;(m[nk(t)]=m[nk(t)]||[]).push(x);const f=fixT(t);if(f!=String(t))ty.push({n,x,f})});Object.values(m).filter(a=>a.length>1).forEach(a=>dup.push({n,a}))});
["film","serie_tv"].forEach(n=>D[n].forEach(x=>{if(miss(n,x).length)mi.push([n,x])}));
mi.sort((a,b)=>(b[1].da_guardare?1:0)-(a[1].da_guardare?1:0));
return{dup,ty,mi}}
function controlla(){const s=scan(),cnt={};s.mi.forEach(([n,x])=>miss(n,x).forEach(f=>cnt[f]=(cnt[f]||0)+1));TYS=s.ty;
const lab={genere:"senza genere",piattaforma:"senza piattaforma",durata:"senza durata",valutazione:"senza voto",lunghezza_stagioni:"senza lunghezza"};
const row=(n,x,ex)=>`<div class="br" style="grid-template-columns:1fr auto auto"><span>${T[n].i} ${e(x[T[n].t])} <small>${e(ex)}</small></span><button data-ed="${x.id}" data-t="${n}">✏️</button><button data-del="${x.id}" data-t="${n}" class="dg">🗑️</button></div>`;
const sg=D.serie_tv.map(x=>[x,serieGaps(x)]).filter(a=>a[1].length),gc={s:0,e:0,d:0};sg.forEach(a=>a[1].forEach(k=>gc[k]++));const fk=st.sfk||"all",rws=sg.filter(a=>fk=="all"||a[1].includes(fk)).sort((a,b)=>b[1].length-a[1].length||String(a[0].titolo).localeCompare(b[0].titolo,"it")),lim=st.sfm?rws.length:40;
const bad=s.dup.length+s.ty.length+s.mi.length+sg.length;
return `<div class="bar"><h2 style="margin:0">🧹 Controlla i dati</h2><small>${bad?s.dup.length+" duplicati · "+s.ty.length+" refusi · "+s.mi.length+" titoli incompleti · "+sg.length+" serie senza episodi o durata":"✅ Tutto a posto"}</small></div>`+
acc("🔁 Duplicati ("+s.dup.length+")",s.dup.length?s.dup.map(g=>`<div class="pn" style="margin-bottom:12px"><h4>${e(g.a[0][T[g.n].t])} <small>×${g.a.length}</small></h4>${g.a.map(x=>row(g.n,x,[x.valutazione!=null?"★ "+x.valutazione:"",x.piattaforma||"",x.da_guardare?"da guardare":""].filter(Boolean).join(" · "))).join("")}</div>`).join(""):"<p>Nessun duplicato 👍</p>")+
acc("✍️ Refusi nei titoli ("+s.ty.length+")",s.ty.length?`<div class="pn">${s.ty.map((t,i)=>`<label style="display:flex;gap:8px;align-items:center;margin:6px 0"><input type="checkbox" data-ty="${i}" checked> ${T[t.n].i} <s>${e(t.x[T[t.n].t])}</s> → <b>${e(t.f)}</b></label>`).join("")}<button class="pri" data-ck="typo" style="margin-top:10px">✅ Correggi selezionati</button></div>`:"<p>Nessun refuso trovato 👍</p>")+
acc("🧩 Dati mancanti ("+s.mi.length+" titoli)",s.mi.length?`<div class="pn"><div class="row" style="margin-bottom:12px">${Object.entries(cnt).map(([f,c])=>`<span class="ch">${c} ${lab[f]}</span>`).join("")}</div><button class="pri" data-ck="queue">▶ Completa i dati</button></div>`:"<p>Nessun dato mancante 👍</p>")+
acc("📺 Serie senza stagioni, episodi o durata ("+sg.length+")",sg.length?`<div class="pn"><div class="row" style="margin-bottom:12px">${[["all","Tutte",sg.length],["s","Senza stagioni",gc.s],["e","Episodi per stagione mancanti",gc.e],["d","Senza durata episodio",gc.d]].map(([k,l,n])=>`<button data-ck="sf" data-i="${k}"${fk==k?' class="pri"':""}>${l} · ${n}</button>`).join("")}</div>${rws.slice(0,lim).map(([x,g])=>`<div class="br" style="grid-template-columns:1fr auto"><span>📺 ${e(x.titolo)} <small>${g.map(k=>({s:"stagioni",e:"episodi",d:"durata"})[k]).join(" · ")}</small></span><button data-ed="${x.id}" data-t="serie_tv">✏️</button></div>`).join("")}${rws.length>lim?`<button data-ck="sm" style="margin-top:10px">Mostra tutte (${rws.length})</button>`:""}</div>`:"<p>Tutte le serie hanno stagioni, episodi e durata 👍</p>")+bulkSection()}
async function kact(b){const d=b.dataset;
if(d.ck=="sf"){st.sfk=d.i;st.sfm=0;render()}else if(d.ck=="sm"){st.sfm=1;render()}else if(d.ck=="typo"){const ids=[...document.querySelectorAll("[data-ty]:checked")].map(i=>+i.dataset.ty);let c=0;for(const i of ids){const t=TYS[i];t.x[T[t.n].t]=t.f;await dbPut(t.n,t.x);c++}render();toast(c+" titoli corretti ✓")}
else if(d.ck=="queue"){const q=scan().mi.map(([n,x])=>[n,x.id]);if(q.length)queue(q,0);else toast("Nessun dato mancante")}}
const QL={genere:["Genere","text","gnl"],piattaforma:["Piattaforma","text","pls"],durata:["Durata (minuti)","number"],valutazione:["Valutazione (0–10)","number"],lunghezza_stagioni:["Lunghezza (es. 3 stagioni)","text"]};
function queue(q,i){while(i<q.length){const x=D[q[i][0]].find(y=>y.id==q[i][1]);if(x&&miss(q[i][0],x).length)break;i++}
if(i>=q.length){$("#dlg").close();render();toast("Dati completati ✓");return}
const n=q[i][0],x=D[n].find(y=>y.id==q[i][1]),f=miss(n,x);
$("#gnl").innerHTML=allGenres().map(g=>`<option value="${e(g)}">`).join("");
$("#dlg").innerHTML=`<h2>🧩 Completa i dati</h2><small>${i+1} di ${q.length}${x.da_guardare?" · da guardare":""}</small><h3>${T[n].i} ${e(x[T[n].t])}</h3>${f.map(k=>`<label>${QL[k][0]}<input name="${k}" type="${QL[k][1]}"${QL[k][2]?` list="${QL[k][2]}"`:""}${k=="valutazione"?' step="0.1" min="0" max="10"':""}></label>`).join("")}<div class="act" style="margin-top:14px"><button id="qs" class="pri">💾 Salva e avanti</button><button id="qk">⏭️ Salta</button><button id="cx">Chiudi</button></div>`;
$("#cx").onclick=()=>{$("#dlg").close();render()};$("#qk").onclick=()=>queue(q,i+1);
$("#qs").onclick=async()=>{f.forEach(k=>{const v=$("#dlg [name="+k+"]").value.trim();if(v!=="")x[k]=QL[k][1]=="number"?+v:v});await dbPut(n,x);queue(q,i+1)};
if(!$("#dlg").open)$("#dlg").showModal()}
