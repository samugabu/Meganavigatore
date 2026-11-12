const BK={stop:false,run:false,review:[]};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const STOPW=new Set("il lo la i gli le un uno una di del dello della dei degli delle e ed a da in con su per tra fra the of and an to on at".split(" "));
const tok=t=>new Set(String(fixT(t)).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim().split(" ").filter(w=>w&&!STOPW.has(w)));
const jac=(a,b)=>{if(!a.size||!b.size)return 0;let i=0;a.forEach(w=>{if(b.has(w))i++});return i/(a.size+b.size-i)};
const bestOf=(q,res)=>{const A=tok(q),sc=res.map(r=>Math.max(0,...[r.name,r.title,r.original_name,r.original_title].filter(Boolean).map(t=>jac(A,tok(t)))));const ex=sc.findIndex(s=>s>=0.999);if(ex>=0)return res[ex];return res.length&&sc[0]>=0.75?res[0]:null};
const BKCAT=[["serie_tv","📺","Serie TV"],["film","🎬","Film"],["libri","📚","Libri"],["lego","🧱","LEGO"]];
const BKDELAY={serie_tv:250,film:250,libri:1100,lego:1100};
const bkKeyOk=n=>n=="libri"?true:n=="lego"?!!rbKey():!!tmKey();
const bkErrFn=n=>n=="lego"?rbErr:n=="libri"?olErr:tmErr;
const needsBulk=(n,x)=>n=="serie_tv"?(!epExact(x)||!(+x.durata_episodio>0)||!x.genere||!x.anno):n=="film"?(!x.durata||!x.genere||!x.anno):n=="libri"?(!x.pagine||!x.autore||!x.anno||!x.copertina):n=="lego"?(!!String(x.codice_set||"").trim()&&(!x.pezzi||!x.immagine||!x.anno)):false;
const bulkItems=ns=>ns.flatMap(n=>D[n].filter(x=>needsBulk(n,x)).map(x=>[n,x]));
function bulkSection(){const c=BKCAT.map(([n,i,l])=>[l,bulkItems([n]).length]),tot=c.reduce((s,a)=>s+a[1],0);
return acc("🔎 Compila automaticamente ("+tot+" titoli)",tot?`<div class="pn"><p style="margin:0 0 10px">Completa in automatico i dati mancanti: TMDB per serie e film, Open Library per i libri, Rebrickable per i LEGO. Compila solo i campi vuoti e non cambia i titoli. Da completare: ${c.filter(a=>a[1]).map(a=>"<b>"+a[1]+"</b> "+a[0].toLowerCase()).join(", ")}.</p><button class="pri" data-bulk="open">▶ Compila automaticamente…</button></div>`:"<p>Tutto completo 👍</p>")}
const bkSel=()=>[...document.querySelectorAll("#dlg [data-bkn]:checked")].map(c=>c.dataset.bkn);
function bulkEst(){const it=bulkItems(bkSel()),sec=it.reduce((s,[n])=>s+(n=="libri"||n=="lego"?1.4:1.5),0);$("#bke").textContent=it.length?it.length+" titoli · circa "+Math.max(1,Math.ceil(sec/60))+" minuti":"Niente da compilare";$("#bkgo").disabled=!it.length}
function bulkOpen(){
$("#dlg").innerHTML=`<h2>🔎 Compila automaticamente</h2><p><small>Prima di iniziare conviene esportare un backup (menu Dati). Le richieste partono una alla volta, con una pausa, per rispettare i limiti dei servizi.</small></p>${BKCAT.map(([n,i,l])=>{const c=bulkItems([n]).length,ok=bkKeyOk(n),on=ok&&c;return `<label class="cb"><input type="checkbox" data-bkn="${n}"${on?" checked":" disabled"}> ${i} ${l} (${c})${ok?"":" · manca la chiave (menu Dati)"}</label>`}).join("")}<p><small id="bke"></small></p><div class="act"><button id="bkgo" class="pri" data-bulk="start">▶ Avvia</button><button id="cx">Annulla</button></div>`;
$("#cx").onclick=()=>$("#dlg").close();$("#dlg").querySelectorAll("[data-bkn]").forEach(c=>{c.onchange=bulkEst});bulkEst();if(!$("#dlg").open)$("#dlg").showModal()}
function bulkStart(){const items=bulkItems(bkSel());if(!items.length)return;
$("#dlg").innerHTML=`<h2>🔎 Compila automaticamente</h2><div class="pg"><i id="bkbar" style="--w:0%"></i></div><p id="bkt" style="margin:8px 0"></p><p><small id="bkc"></small></p><div class="act"><button data-bulk="stop">⏹ Ferma</button></div>`;
bulkRun(items)}
const bulkUi=(i,t,title,S)=>{const b=$("#bkbar");if(!b)return;b.style.setProperty("--w",Math.round(i/t*100)+"%");$("#bkt").textContent=(i+1)+" di "+t+" · "+title;$("#bkc").textContent="✅ "+S.ok+" compilati · ⚠️ "+S.rev+" da verificare · ❌ "+S.nf+" non trovati · ⛔ "+S.err+" errori"};
async function tmMerge(n,x,f){
if(n=="film"){if(!x.durata&&f.durata)x.durata=f.durata}
else{if(f.episodi_stagioni&&f.episodi_stagioni.length&&!epExact(x))x.episodi_stagioni=f.episodi_stagioni;if(!(+x.durata_episodio>0)&&f.durata_episodio)x.durata_episodio=f.durata_episodio;if(!x.piattaforma&&f.piattaforma)x.piattaforma=f.piattaforma;if(x.in_corso==null&&f.in_corso!=null)x.in_corso=f.in_corso;
const m=epMatch(x),cur=m&&/^s/i.test(m[2])?+m[1]:0,ns=f.episodi_stagioni?f.episodi_stagioni.length:0;if(!x.lunghezza_stagioni||(ns>cur&&(!m||/^s/i.test(m[2]))))x.lunghezza_stagioni=f.lunghezza_stagioni||x.lunghezza_stagioni}
if(!x.genere&&f.genere)x.genere=f.genere;if(!x.anno&&f.anno)x.anno=f.anno;x.tmdb_id=f.tmdb_id;await dbPut(n,x)}
async function bulkLego(x){const c=String(x.codice_set).trim(),num=/-/.test(c)?c:c+"-1";let d;
try{d=await rbGet("/lego/sets/"+encodeURIComponent(num)+"/")}catch(err){if(err.code=="notfound")return"nf";throw err}
if(!x.pezzi&&d.num_parts)x.pezzi=d.num_parts;if(!x.immagine&&d.set_img_url)x.immagine=d.set_img_url;if(!x.anno&&d.year)x.anno=d.year;await dbPut("lego",x);return"ok"}
async function bulkBook(x){const title=x.titolo,p={title:fixT(title),limit:"5",fields:OLF};if(x.autore)p.author=x.autore;
const res=((await olGet(p)).docs||[]).slice(0,5);if(!res.length)return"nf";
const b=bestOf(title,res);
if(!b){BK.review.push({n:"libri",id:x.id,title,c:res.slice(0,3).map(r=>({t:r.title,y:r.first_publish_year||"",a:(r.author_name||[])[0]||"",doc:r}))});return"rev"}
await bookMerge(x,b);return"ok"}
async function bulkOne(n,x){if(n=="lego")return bulkLego(x);if(n=="libri")return bulkBook(x);
const kind=tmKind(n),title=x[T[n].t];let id=x.tmdb_id;
if(!id){const d=await tmGet("/search/"+kind,{query:fixT(title)}),res=(d.results||[]).slice(0,5);if(!res.length)return"nf";
const b=bestOf(title,res);if(!b){BK.review.push({n,id:x.id,title,c:res.slice(0,3).map(r=>({id:r.id,t:r.name||r.title,y:(r.first_air_date||r.release_date||"").slice(0,4)}))});return"rev"}
id=b.id;await sleep(250)}
await tmMerge(n,x,tmFields(n,await tmGet("/"+kind+"/"+id)));return"ok"}
async function bulkRun(items){BK.run=true;BK.stop=false;BK.review=[];const S={ok:0,rev:0,nf:0,err:0,done:0,fatal:null,fatalN:null};
$("#dlg").addEventListener("close",()=>{BK.stop=true},{once:true});
for(let i=0;i<items.length&&!BK.stop;i++){const[n,x]=items[i];bulkUi(i,items.length,x[T[n].t],S);let rr=0,res=null;
while(res===null){try{res=await bulkOne(n,x)}catch(err){if(["nokey","auth","net"].includes(err.code)){S.fatal=err;S.fatalN=n;break}if(err.code=="rate"&&rr++<2){await sleep(10000);continue}res="err"}}
if(S.fatal)break;S[res]++;S.done++;await sleep(BKDELAY[n])}
BK.run=false;bulkEnd(items.length,S)}
const reviewRows=()=>BK.review.map((r,i)=>r?`<div class="pn" style="margin:6px 0;padding:10px"><b>${T[r.n].i} ${e(r.title)}</b><div class="row" style="margin-top:6px">${r.c.map((c,j)=>`<button type="button" data-bkc="${i}:${j}">${e(c.t)}${c.y?" ("+c.y+")":""}${c.a?" – "+e(c.a):""}</button>`).join("")}<button type="button" data-bkc="${i}:x">Salta</button></div></div>`:"").join("");
function bulkEnd(total,S){render();const d=$("#dlg");if(!d.open)return;
d.innerHTML=`<h2>🔎 Compila automaticamente</h2><p>${S.fatal?"⛔ "+e(bkErrFn(S.fatalN)(S.fatal))+"<br>":""}${BK.stop&&!S.fatal?"Interrotto. ":""}Elaborati ${S.done} di ${total}.</p><p>✅ ${S.ok} compilati · ⚠️ ${S.rev} da verificare · ❌ ${S.nf} non trovati · ⛔ ${S.err} errori</p>${BK.review.length?`<h3>Da verificare</h3><div id="bkr" style="max-height:40vh;overflow:auto">${reviewRows()}</div>`:""}<div class="act" style="margin-top:14px"><button id="cx">Chiudi</button></div>`;
$("#cx").onclick=()=>d.close()}
async function bulkPick(v){const[i,j]=v.split(":"),r=BK.review[i];if(!r)return;
if(j!="x"){const x=D[r.n].find(y=>y.id==r.id);try{if(r.n=="libri")await bookMerge(x,r.c[j].doc);else await tmMerge(r.n,x,tmFields(r.n,await tmGet("/"+tmKind(r.n)+"/"+r.c[j].id)))}catch(err){toast(bkErrFn(r.n)(err));return}}
BK.review[i]=null;const box=$("#bkr");if(box)box.innerHTML=reviewRows();render()}
function bulkAct(b){const a=b.dataset.bulk;if(a=="open")bulkOpen();else if(a=="start")bulkStart();else if(a=="stop")BK.stop=true}
