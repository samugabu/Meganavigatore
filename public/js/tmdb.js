const TM="https://api.themoviedb.org/3";
const tmKey=()=>{try{return localStorage.getItem("mn_tmdb")||""}catch(x){return ""}};
const tmErr=x=>({nokey:"Imposta la chiave TMDB dal menu Dati → 🔑 Chiave TMDB (oppure configura il proxy sul server).",net:"Impossibile contattare TMDB: controlla la connessione. Dentro claude.ai le chiamate esterne sono bloccate: scarica il file e aprilo dal computer.",auth:"Chiave TMDB non valida o scaduta.",notfound:"Non trovato su TMDB.",forbidden:"Richiesta rifiutata dal server.",proxy:"Il server non ha la chiave TMDB: aggiungi il segreto TMDB_API_KEY su Cloudflare e rifai il deploy.",rate:"Troppe richieste a TMDB: riprova tra "+((x&&x.wait)||"qualche")+" secondi.",http:"TMDB ha risposto con un errore ("+(x&&x.status)+")."}[x&&x.code]||"Errore imprevisto durante la chiamata a TMDB.");
async function tmGet(path,params,retry=1){const k=tmKey(),h={Accept:"application/json"},q={language:"it-IT",...(params||{})};
let u;if(k){u=new URL(TM+path);if(k.startsWith("eyJ"))h.Authorization="Bearer "+k;else q.api_key=k}else u=new URL("/api/tmdb"+path,location.href);
Object.entries(q).forEach(([a,b])=>u.searchParams.set(a,b));
let r;try{r=await fetch(u.toString(),{headers:h})}catch(x){throw{code:k?"net":"nokey"}}
if(!k&&r.status==404&&!(r.headers.get("content-type")||"").includes("json"))throw{code:"nokey"};
if(r.status==429){const w=Math.min(+r.headers.get("Retry-After")||2,10);if(retry){await new Promise(o=>setTimeout(o,w*1000));return tmGet(path,params,0)}throw{code:"rate",wait:w}}
if(r.status==401)throw{code:"auth"};if(r.status==403&&!k)throw{code:"forbidden"};if(r.status==404)throw{code:"notfound"};if(r.status==500&&!k)throw{code:"proxy"};if(!r.ok)throw{code:"http",status:r.status};
return r.json()}
const curTable=()=>fm.id?fm.n:($("#ft")?$("#ft").value:fm.n);
const tmKind=n=>n=="film"?"movie":"tv";
function tmFields(n,d){const g=(d.genres||[]).map(s=>s.name.toLowerCase()).join(", "),y=+(d.first_air_date||d.release_date||"").slice(0,4)||null;
if(n=="film")return{durata:d.runtime||null,genere:g||null,anno:y,tmdb_id:d.id};
const ss=(d.seasons||[]).filter(s=>s.season_number>0).sort((a,b)=>a.season_number-b.season_number),ns=d.number_of_seasons||ss.length;
return{episodi_stagioni:ss.map(s=>s.episode_count||0),lunghezza_stagioni:ns?ns+(ns==1?" stagione":" stagioni"):null,durata_episodio:(Array.isArray(d.episode_run_time)&&d.episode_run_time.find(v=>v>0))||(d.last_episode_to_air&&d.last_episode_to_air.runtime)||60,genere:g||null,piattaforma:(d.networks&&d.networks[0]&&d.networks[0].name)||null,anno:y,in_corso:typeof d.in_production=="boolean"?d.in_production:null,tmdb_id:d.id}}
const tmPanel=(n,x)=>{if(n=="serie_tv"||n=="film")$("#ff label").insertAdjacentHTML("afterend",`<div class="pn" style="margin:8px 0 14px;padding:12px"><div class="row"><button type="button" id="tmq">🔎 Cerca su TMDB</button>${x.tmdb_id?'<button type="button" id="tmu">🔄 Aggiorna da TMDB</button>':""}</div><div id="tmr" style="margin-top:8px"><small>Compila in automatico ${n=="film"?"durata, genere e anno":"stagioni, episodi per stagione, durata, genere e anno"}.</small></div></div>`)};
const extraPanels=(n,x)=>{tmPanel(n,x);olPanel(n,x);rbPanel(n,x)};
async function tmdbSearch(){const n=curTable(),q=$("#ff [name=titolo]").value.trim(),box=$("#tmr");if(!q){box.innerHTML="<small>Scrivi prima il titolo.</small>";return}
box.innerHTML="<small>Cerco su TMDB…</small>";
try{const d=await tmGet("/search/"+tmKind(n),{query:q}),r=(d.results||[]).slice(0,6);
box.innerHTML=r.length?r.map(x=>{const t=x.name||x.title,o=x.original_name||x.original_title;return `<div class="br" style="grid-template-columns:1fr auto"><span>${e(t)} <small>${(x.first_air_date||x.release_date||"").slice(0,4)}${o&&o!=t?" · "+e(o):""}</small></span><button type="button" data-tm="${x.id}">Usa</button></div>`}).join(""):`<small>Nessun risultato per “${e(q)}”.</small>`}catch(x){box.innerHTML=`<small>${e(tmErr(x))}</small>`}}
async function tmdbFill(id){const n=curTable(),box=$("#tmr");if(!id){box.innerHTML="<small>Nessun ID TMDB: usa la ricerca.</small>";return}
box.innerHTML="<small>Scarico i dettagli…</small>";
try{const d=await tmGet("/"+tmKind(n)+"/"+id),f=tmFields(n,d),set=(k,v,only)=>{const el=$("#ff [name="+k+"]");if(el&&v!=null&&(!only||!el.value.trim()))el.value=v};
if(n=="film"){set("durata",f.durata);set("genere",f.genere,1);set("anno",f.anno,1);set("tmdb_id",f.tmdb_id);
box.innerHTML=`<small>✅ ${e(d.title)}: ${f.durata||"?"} min${f.anno?", "+f.anno:""}. Controlla i dati e premi Salva.</small>`}
else{const eps=f.episodi_stagioni;$("#eps").innerHTML=eps.length?eps.map((v,i)=>epRow(i,v)).join(""):epRow(0,null);
set("lunghezza_stagioni",f.lunghezza_stagioni);set("durata_episodio",f.durata_episodio);set("tmdb_id",f.tmdb_id);set("genere",f.genere,1);set("piattaforma",f.piattaforma,1);set("anno",f.anno,1);
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
