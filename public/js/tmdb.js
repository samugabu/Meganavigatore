const TM="https://api.themoviedb.org/3";
const tmKey=()=>{try{return localStorage.getItem("mn_tmdb")||""}catch(x){return ""}};
const tmErr=x=>({nokey:"Imposta la chiave TMDB dal menu Dati → 🔑 Chiave TMDB.",net:"Impossibile contattare TMDB: controlla la connessione a internet. Se usi la pagina dentro claude.ai le chiamate esterne sono bloccate: apri il file dal computer.",auth:"Chiave TMDB non valida o scaduta.",notfound:"Non trovato su TMDB.",rate:"Troppe richieste a TMDB: riprova tra "+((x&&x.wait)||"qualche")+" secondi.",http:"TMDB ha risposto con un errore ("+(x&&x.status)+")."}[x&&x.code]||"Errore imprevisto durante la chiamata a TMDB.");
async function tmGet(path,params,retry=1){const k=tmKey();if(!k)throw{code:"nokey"};
const h={Accept:"application/json"},q={language:"it-IT",...(params||{})},u=new URL(TM+path);
if(k.startsWith("eyJ"))h.Authorization="Bearer "+k;else q.api_key=k;
Object.entries(q).forEach(([a,b])=>u.searchParams.set(a,b));
let r;try{r=await fetch(u.toString(),{headers:h})}catch(x){throw{code:"net"}}
if(r.status==429){const w=Math.min(+r.headers.get("Retry-After")||2,10);if(retry){await new Promise(o=>setTimeout(o,w*1000));return tmGet(path,params,0)}throw{code:"rate",wait:w}}
if(r.status==401)throw{code:"auth"};if(r.status==404)throw{code:"notfound"};if(!r.ok)throw{code:"http",status:r.status};
return r.json()}
const curTable=()=>fm.id?fm.n:($("#ft")?$("#ft").value:fm.n);
const tmKind=n=>isFilm(n)?"movie":"tv";
const prov=d=>{const r=d["watch/providers"]&&d["watch/providers"].results&&d["watch/providers"].results.IT;if(!r)return null;const a=[...(r.flatrate||[]),...(r.free||[]),...(r.ads||[])].map(p=>p.provider_name);return a.length?[...new Set(a)].join(", "):null};
const poster=d=>d.poster_path?"https://image.tmdb.org/t/p/w154"+d.poster_path:null;
function tmFields(n,d){const g=(d.genres||[]).map(s=>s.name.toLowerCase()).join(", "),y=+(d.first_air_date||d.release_date||"").slice(0,4)||null;
if(isFilm(n))return{durata:d.runtime||null,genere:g||null,anno:y,tmdb_id:d.id,copertina:poster(d),dove:prov(d)};
const ss=(d.seasons||[]).filter(s=>s.season_number>0).sort((a,b)=>a.season_number-b.season_number),ns=d.number_of_seasons||ss.length;
return{episodi_stagioni:ss.map(s=>s.episode_count||0),lunghezza_stagioni:ns?ns+(ns==1?" stagione":" stagioni"):null,durata_episodio:(Array.isArray(d.episode_run_time)&&d.episode_run_time.find(v=>v>0))||(d.last_episode_to_air&&d.last_episode_to_air.runtime)||60,genere:g||null,piattaforma:(d.networks&&d.networks[0]&&d.networks[0].name)||null,anno:y,in_corso:typeof d.in_production=="boolean"?d.in_production:null,tmdb_id:d.id,copertina:poster(d),dove:prov(d),prossima_data:d.next_episode_to_air?d.next_episode_to_air.air_date||null:null,prossima_info:d.next_episode_to_air?"S"+d.next_episode_to_air.season_number+" E"+d.next_episode_to_air.episode_number:null}}
const tmPanel=(n,x)=>{if(n=="serie_tv"||isFilm(n))$("#ff label").insertAdjacentHTML("afterend",`<div class="pn" style="margin:8px 0 14px;padding:12px"><div class="row"><button type="button" id="tmq">🔎 Cerca su TMDB</button>${x.tmdb_id?'<button type="button" id="tmu">🔄 Aggiorna da TMDB</button>':""}</div><div id="tmr" style="margin-top:8px"><small>Compila in automatico ${isFilm(n)?"durata, genere e anno":"stagioni, episodi per stagione, durata, genere e anno"}.</small></div></div>`)};
const extraPanels=(n,x)=>{tmPanel(n,x);olPanel(n,x);rbPanel(n,x)};
async function tmdbSearch(){const n=curTable(),q=$("#ff [name=titolo]").value.trim(),box=$("#tmr");if(!q){box.innerHTML="<small>Scrivi prima il titolo.</small>";return}
box.innerHTML="<small>Cerco su TMDB…</small>";
try{const d=await tmGet("/search/"+tmKind(n),{query:q}),r=(d.results||[]).slice(0,6);
box.innerHTML=r.length?r.map(x=>{const t=x.name||x.title,o=x.original_name||x.original_title;return `<div class="br" style="grid-template-columns:1fr auto"><span>${e(t)} <small>${(x.first_air_date||x.release_date||"").slice(0,4)}${o&&o!=t?" · "+e(o):""}</small></span><button type="button" data-tm="${x.id}">Usa</button></div>`}).join(""):`<small>Nessun risultato per “${e(q)}”.</small>`}catch(x){box.innerHTML=`<small>${e(tmErr(x))}</small>`}}
async function tmdbFill(id){const n=curTable(),box=$("#tmr");if(!id){box.innerHTML="<small>Nessun ID TMDB: usa la ricerca.</small>";return}
box.innerHTML="<small>Scarico i dettagli…</small>";
try{const d=await tmDet(tmKind(n),id),f=tmFields(n,d),set=(k,v,only)=>{const el=$("#ff [name="+k+"]");if(el&&v!=null&&(!only||!el.value.trim()))el.value=v};
if(isFilm(n)){set("durata",f.durata);set("genere",f.genere,1);set("anno",f.anno,1);set("tmdb_id",f.tmdb_id);set("copertina",f.copertina,1);set("dove_guardarlo",f.dove);
box.innerHTML=`<small>✅ ${e(d.title)}: ${f.durata||"?"} min${f.anno?", "+f.anno:""}. Controlla i dati e premi Salva.</small>`}
else{const eps=f.episodi_stagioni;$("#eps").innerHTML=eps.length?eps.map((v,i)=>epRow(i,v)).join(""):epRow(0,null);
set("lunghezza_stagioni",f.lunghezza_stagioni);set("durata_episodio",f.durata_episodio);set("tmdb_id",f.tmdb_id);set("genere",f.genere,1);set("piattaforma",f.piattaforma,1);set("anno",f.anno,1);set("copertina",f.copertina,1);set("dove_guardarlo",f.dove);set("prossima_data",f.prossima_data||"");set("prossima_info",f.prossima_info||"");
if(f.in_corso!=null){const c=$("#ff [name=in_corso]");if(c)c.checked=f.in_corso}
box.innerHTML=`<small>✅ ${e(d.name)}: ${eps.length} stagioni, ${eps.reduce((a,b)=>a+b,0)} episodi, ${f.durata_episodio} min a episodio. Controlla i dati e premi Salva.</small>`}}catch(x){box.innerHTML=`<small>${e(tmErr(x))}</small>`}}
function keyDlg(title,storage,help){let k="";try{k=localStorage.getItem(storage)||""}catch(x){}
$("#dlg").innerHTML=`<h2>🔑 ${title}</h2><p><small>${help} La chiave resta solo in questo browser: non entra nei backup e non è scritta nel codice.</small></p><label>Chiave<input id="tk" type="password" autocomplete="off" placeholder="${k?"Chiave salvata ("+k.length+" caratteri)":"Incolla qui la chiave"}"></label><div class="act" style="margin-top:14px"><button id="tks" class="pri">💾 Salva</button><button id="tkr" class="dg">🗑️ Rimuovi</button><button id="cx">Chiudi</button></div>`;
$("#cx").onclick=()=>$("#dlg").close();
$("#tks").onclick=()=>{const v=$("#tk").value.trim();if(!v){toast("Incolla prima la chiave");return}try{localStorage.setItem(storage,v);$("#dlg").close();toast("Chiave salvata ✓")}catch(x){toast("Impossibile salvare la chiave in questo browser")}};
$("#tkr").onclick=()=>{try{localStorage.removeItem(storage)}catch(x){}$("#dlg").close();toast("Chiave rimossa")};
$("#dlg").showModal()}
const tmdbKey=()=>keyDlg("Chiave TMDB","mn_tmdb","Registrati su themoviedb.org, apri Impostazioni → API e copia la “Chiave API” (v3) oppure il “Token di accesso in lettura” (v4).");
const rbKeyDlg=()=>keyDlg("Chiave Rebrickable","mn_rb","Registrati su rebrickable.com e crea una chiave gratuita in Account → Impostazioni → API.");
const tmDet=(kind,id)=>tmGet("/"+kind+"/"+id,{append_to_response:"watch/providers"});
async function liveRun(){const items=D.serie_tv.filter(x=>x.in_corso&&x.tmdb_id),noid=D.serie_tv.filter(x=>x.in_corso&&!x.tmdb_id).length;
if(!items.length){toast(noid?"Le serie in corso non hanno ancora l'ID TMDB: usa Controlla → Compila automaticamente":"Nessuna serie segnata come in corso");return}
if(!tmKey()){toast(tmErr({code:"nokey"}));return}
$("#dlg").innerHTML=`<h2>🔄 Aggiorna serie in corso</h2><div class="pg"><i id="bkbar" style="--w:0%"></i></div><p id="bkt" style="margin:8px 0"></p><p><small id="bkc"></small></p><div class="act"><button data-bulk="stop">⏹ Ferma</button></div>`;
if(!$("#dlg").open)$("#dlg").showModal();BK.stop=false;$("#dlg").addEventListener("close",()=>{BK.stop=true},{once:true});
const S={ok:0,rev:0,nf:0,err:0,eps:0,ended:0,fatal:null};
for(let i=0;i<items.length&&!BK.stop;i++){const x=items[i];bulkUi(i,items.length,x.titolo,S);
try{const f=tmFields("serie_tv",await tmDet("tv",x.tmdb_id)),before=epTot(x),ex=epExact(x);
if(f.episodi_stagioni&&f.episodi_stagioni.length)x.episodi_stagioni=f.episodi_stagioni;if(f.lunghezza_stagioni)x.lunghezza_stagioni=f.lunghezza_stagioni;
if(f.in_corso!=null){if(x.in_corso&&!f.in_corso)S.ended++;x.in_corso=f.in_corso}
x.prossima_data=f.prossima_data||null;x.prossima_info=f.prossima_info||null;if(f.dove)x.dove_guardarlo=f.dove;if(!x.copertina&&f.copertina)x.copertina=f.copertina;
if(ex)S.eps+=Math.max(0,epTot(x)-before);await dbPut("serie_tv",x);S.ok++}
catch(err){if(["nokey","auth","net"].includes(err.code)){S.fatal=err;break}S.err++}
await sleep(250)}
render();const d=$("#dlg");if(!d.open)return;
d.innerHTML=`<h2>🔄 Aggiorna serie in corso</h2><p>${S.fatal?"⛔ "+e(tmErr(S.fatal))+"<br>":""}${BK.stop&&!S.fatal?"Interrotto. ":""}Aggiornate ${S.ok} di ${items.length}.</p><p>➕ ${S.eps} episodi nuovi · 🏁 ${S.ended} concluse · ⛔ ${S.err} errori${noid?" · "+noid+" senza ID TMDB":""}</p><div class="act" style="margin-top:14px"><button id="cx">Chiudi</button></div>`;
$("#cx").onclick=()=>d.close()}
function liveSection(){const a=D.serie_tv.filter(x=>x.in_corso),n=a.filter(x=>x.tmdb_id).length;if(!a.length)return"";
return acc("📡 Serie in corso ("+a.length+")",`<div class="pn"><p style="margin:0 0 10px">Riscarica da TMDB episodi, data della prossima puntata e dove guardarle per le serie segnate come in corso.${a.length-n?" "+(a.length-n)+" senza ID TMDB: usa prima “Compila automaticamente”.":""}</p><button class="pri" data-live="run">🔄 Aggiorna serie in corso</button></div>`)}
function calSection(up,stale){const live=D.serie_tv.some(x=>x.in_corso&&x.tmdb_id);if(!up.length&&!live)return"";let mo="";
const rows=up.slice(0,15).map(x=>{const dt=new Date(x.prossima_data+"T12:00:00"),m=dt.toLocaleDateString("it-IT",{month:"long",year:"numeric"}),h=m!=mo?(mo=m,`<h6 style="margin:12px 0 4px;text-transform:uppercase;letter-spacing:.1em;color:var(--mut);font-size:.74rem">${e(m)}</h6>`):"";
return `${h}<div class="br" style="grid-template-columns:100px 1fr auto"><b style="text-align:left">${e(dt.toLocaleDateString("it-IT",{weekday:"short",day:"numeric",month:"short"}))}</b><span>📺 ${e(x.titolo)} <small>${e(x.prossima_info||"")}</small></span>${x.stato_visione=="in_visione"?'<span class="bd bb">▶️ In visione</span>':""}</div>`}).join("");
return acc("📅 Prossime uscite ("+up.length+")",`<div class="pn">${rows||"<small>Nessuna uscita in programma nei dati salvati.</small>"}<div class="row" style="margin-top:12px;align-items:center"><button data-live="run">🔄 Aggiorna serie in corso</button><button data-x="ics">📅 Esporta nel calendario (.ics)</button>${stale?`<small>${stale} date da aggiornare</small>`:""}</div></div>`)}
let REC=[];
async function recDlg(n,id){const x=D[n].find(y=>y.id==id);if(!x||!x.tmdb_id)return;
$("#dlg").innerHTML=`<h2>💡 Simili a ${e(x[T[n].t])}</h2><div id="recb"><small>Cerco su TMDB…</small></div><div class="act" style="margin-top:14px"><button id="cx">Chiudi</button></div>`;
$("#cx").onclick=()=>$("#dlg").close();if(!$("#dlg").open)$("#dlg").showModal();
try{const d=await tmGet("/"+tmKind(n)+"/"+x.tmdb_id+"/recommendations");REC=(d.results||[]).slice(0,8).map(y=>({id:y.id,t:y.name||y.title,y:(y.first_air_date||y.release_date||"").slice(0,4),p:y.poster_path,v:y.vote_average}));REC.n=n;
$("#recb").innerHTML=REC.length?REC.map((y,i)=>{const own=D[n].some(z=>z.tmdb_id==y.id||nk(z[T[n].t])==nk(y.t));return `<div class="br" style="grid-template-columns:1fr auto"><span>${e(y.t)} <small>${y.y}${y.v?" · ★ "+y.v.toFixed(1):""}</small></span>${own?"<small>già in collezione</small>":`<button data-recadd="${i}">➕ Da guardare</button>`}</div>`}).join(""):"<small>Nessun suggerimento.</small>"}
catch(err){const b=$("#recb");if(b)b.innerHTML=`<small>${e(tmErr(err))}</small>`}}
async function recAdd(i,b){const y=REC[i],n=REC.n,o={titolo:y.t,anno:+y.y||null,tmdb_id:y.id,copertina:y.p?"https://image.tmdb.org/t/p/w154"+y.p:null,da_guardare:true};await dbPut(n,o);D[n].push(o);b.outerHTML="<small>✅ aggiunto</small>";render()}
