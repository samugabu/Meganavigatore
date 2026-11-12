const OL="https://openlibrary.org";
const olErr=x=>({net:"Impossibile contattare Open Library: controlla la connessione. Dentro claude.ai le chiamate esterne sono bloccate: scarica il file e aprilo dal computer.",rate:"Troppe richieste a Open Library: riprova tra qualche secondo.",http:"Open Library ha risposto con un errore ("+(x&&x.status)+")."}[x&&x.code]||"Errore imprevisto durante la chiamata a Open Library.");
async function olGet(q){const qs=new URLSearchParams(q).toString(),tries=location.protocol.startsWith("http")?["/api/openlibrary/search.json?"+qs,OL+"/search.json?"+qs]:[OL+"/search.json?"+qs];
for(const u of tries){let r;try{r=await fetch(u)}catch(x){continue}if(r.status==404&&(r.headers.get("content-type")||"").indexOf("json")<0)continue;if(r.status==429)throw{code:"rate"};if(!r.ok)throw{code:"http",status:r.status};return r.json()}throw{code:"net"}}
let OLR=[];
const olPanel=(n,x)=>{if(n=="libri")$("#ff label").insertAdjacentHTML("afterend",`<div class="pn" style="margin:8px 0 14px;padding:12px"><div class="row"><button type="button" id="olq">🔎 Cerca su Open Library</button></div><div id="olr" style="margin-top:8px"><small>Compila autore, anno, pagine e copertina.</small></div></div>`)};
async function olSearch(){const q=$("#ff [name=titolo]").value.trim(),au=$("#ff [name=autore]"),box=$("#olr");if(!q){box.innerHTML="<small>Scrivi prima il titolo del libro.</small>";return}
box.innerHTML="<small>Cerco su Open Library…</small>";
try{const p={title:q,limit:"6",fields:"key,title,author_name,first_publish_year,number_of_pages_median,cover_i"};if(au&&au.value.trim())p.author=au.value.trim();
const d=await olGet(p);OLR=d.docs||[];
box.innerHTML=OLR.length?OLR.map((r,i)=>`<div class="br" style="grid-template-columns:1fr auto"><span>${e(r.title)} <small>${e((r.author_name||[]).slice(0,2).join(", "))}${r.first_publish_year?" · "+r.first_publish_year:""}${r.number_of_pages_median?" · "+r.number_of_pages_median+" pag.":""}</small></span><button type="button" data-ol="${i}">Usa</button></div>`).join(""):`<small>Nessun risultato per “${e(q)}”.</small>`}catch(x){box.innerHTML=`<small>${e(olErr(x))}</small>`}}
function olFill(i){const r=OLR[i];if(!r)return;const set=(k,v)=>{const el=$("#ff [name="+k+"]");if(el&&v!=null&&!el.value.trim())el.value=v};
set("autore",(r.author_name||[])[0]);set("anno",r.first_publish_year);set("pagine",r.number_of_pages_median);set("copertina",r.cover_i?"https://covers.openlibrary.org/b/id/"+r.cover_i+"-M.jpg":null);
$("#olr").innerHTML=`<small>✅ ${e(r.title)}: dati compilati nei campi vuoti. Controlla e premi Salva.</small>`}
async function bkact(b){const d=b.dataset,x=D.libri.find(y=>y.id==d.i);if(!x)return;
if(d.bk=="inc"){const t=+x.pagine||Infinity;x.pagina_corrente=Math.min((+x.pagina_corrente||0)+10,t);if(!x.stato_lettura)x.stato_lettura="in_lettura";await dbPut("libri",x);render();toast(x.pagina_corrente>=t?"Ultima pagina: segna il libro come finito dal modulo":"Pagina "+x.pagina_corrente)}}
