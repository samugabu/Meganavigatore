const RB="https://rebrickable.com/api/v3";
const rbKey=()=>{try{return localStorage.getItem("mn_rb")||""}catch(x){return ""}};
const rbErr=x=>({nokey:"Imposta la chiave Rebrickable dal menu Dati → 🔑 Chiave Rebrickable.",net:"Impossibile contattare Rebrickable: controlla la connessione a internet. Se usi la pagina dentro claude.ai le chiamate esterne sono bloccate: apri il file dal computer.",auth:"Chiave Rebrickable non valida.",notfound:"Set non trovato su Rebrickable.",rate:"Troppe richieste a Rebrickable: riprova tra qualche secondo.",http:"Rebrickable ha risposto con un errore ("+(x&&x.status)+")."}[x&&x.code]||"Errore imprevisto durante la chiamata a Rebrickable.");
async function rbGet(path){const k=rbKey();if(!k)throw{code:"nokey"};
let r;try{r=await fetch(RB+path+"?key="+encodeURIComponent(k),{headers:{Accept:"application/json"}})}catch(x){throw{code:"net"}}
if(r.status==429)throw{code:"rate"};if(r.status==401||r.status==403)throw{code:"auth"};if(r.status==404)throw{code:"notfound"};if(!r.ok)throw{code:"http",status:r.status};
return r.json()}
const rbPanel=(n,x)=>{if(n=="lego")$("#ff label").insertAdjacentHTML("afterend",`<div class="pn" style="margin:8px 0 14px;padding:12px"><div class="row"><button type="button" id="rbq">🔎 Cerca su Rebrickable</button></div><div id="rbr" style="margin-top:8px"><small>Scrivi il codice del set (per esempio 75192) e recupera nome, pezzi e immagine.</small></div></div>`)};
async function rbSearch(){const c=$("#ff [name=codice_set]").value.trim(),box=$("#rbr");if(!c){box.innerHTML="<small>Scrivi prima il codice del set, per esempio 75192.</small>";return}
const num=/-/.test(c)?c:c+"-1";box.innerHTML="<small>Cerco su Rebrickable…</small>";
try{const d=await rbGet("/lego/sets/"+encodeURIComponent(num)+"/"),set=(k,v)=>{const el=$("#ff [name="+k+"]");if(el&&v!=null&&!el.value.trim())el.value=v};
set("modello_nome",d.name);set("pezzi",d.num_parts);set("immagine",d.set_img_url);
box.innerHTML=`<small>✅ ${e(d.name)} (${d.year}): ${d.num_parts} pezzi. Controlla i dati e premi Salva.</small>`}catch(x){box.innerHTML=`<small>${e(rbErr(x))}</small>`}}
