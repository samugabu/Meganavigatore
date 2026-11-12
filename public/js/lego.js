const RB="https://rebrickable.com/api/v3";
const rbKey=()=>{try{return localStorage.getItem("mn_rb")||""}catch(x){return ""}};
const rbErr=x=>({nokey:"Imposta la chiave Rebrickable dal menu Dati → 🔑 Chiave Rebrickable (oppure configura il proxy sul server).",net:"Impossibile contattare Rebrickable: controlla la connessione. Dentro claude.ai le chiamate esterne sono bloccate: scarica il file e aprilo dal computer.",auth:"Chiave Rebrickable non valida.",notfound:"Set non trovato su Rebrickable.",forbidden:"Richiesta rifiutata dal server.",proxy:"Il server non ha la chiave Rebrickable: aggiungi il segreto REBRICKABLE_API_KEY su Cloudflare e rifai il deploy.",rate:"Troppe richieste a Rebrickable: riprova tra qualche secondo.",http:"Rebrickable ha risposto con un errore ("+(x&&x.status)+")."}[x&&x.code]||"Errore imprevisto durante la chiamata a Rebrickable.");
async function rbGet(path){const k=rbKey(),h={Accept:"application/json"};let u;if(k){u=RB+path;h.Authorization="key "+k}else u=new URL("/api/rebrickable"+path,location.href).toString();
let r;try{r=await fetch(u,{headers:h})}catch(x){throw{code:k?"net":"nokey"}}
if(!k&&r.status==404&&!(r.headers.get("content-type")||"").includes("json"))throw{code:"nokey"};
if(r.status==429)throw{code:"rate"};if(r.status==401||(r.status==403&&k))throw{code:"auth"};if(r.status==403)throw{code:"forbidden"};if(r.status==404)throw{code:"notfound"};if(r.status==500&&!k)throw{code:"proxy"};if(!r.ok)throw{code:"http",status:r.status};
return r.json()}
const rbPanel=(n,x)=>{if(n=="lego")$("#ff label").insertAdjacentHTML("afterend",`<div class="pn" style="margin:8px 0 14px;padding:12px"><div class="row"><button type="button" id="rbq">🔎 Cerca su Rebrickable</button></div><div id="rbr" style="margin-top:8px"><small>Scrivi il codice del set (per esempio 75192) e recupera nome, pezzi e immagine.</small></div></div>`)};
async function rbSearch(){const c=$("#ff [name=codice_set]").value.trim(),box=$("#rbr");if(!c){box.innerHTML="<small>Scrivi prima il codice del set, per esempio 75192.</small>";return}
const num=/-/.test(c)?c:c+"-1";box.innerHTML="<small>Cerco su Rebrickable…</small>";
try{const d=await rbGet("/lego/sets/"+encodeURIComponent(num)+"/"),set=(k,v)=>{const el=$("#ff [name="+k+"]");if(el&&v!=null&&!el.value.trim())el.value=v};
set("modello_nome",d.name);set("pezzi",d.num_parts);set("immagine",d.set_img_url);
box.innerHTML=`<small>✅ ${e(d.name)} (${d.year}): ${d.num_parts} pezzi. Controlla i dati e premi Salva.</small>`}catch(x){box.innerHTML=`<small>${e(rbErr(x))}</small>`}}
