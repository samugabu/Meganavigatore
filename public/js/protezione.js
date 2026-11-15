const VER=2;
const MIGR={1:d=>{(d.serie_tv||[]).forEach(x=>{if(typeof x.episodi_stagioni=="string")x.episodi_stagioni=x.episodi_stagioni.split(",").map(v=>+v||0)});return d}};
const getCfg=()=>{try{return JSON.parse(localStorage.getItem("mn_cfg")||"{}")}catch(x){return{}}};
const setCfg=o=>{try{localStorage.setItem("mn_cfg",JSON.stringify({...getCfg(),...o}))}catch(x){}};
const packBackup=()=>({app:"meganavigatore",versione:VER,esportato:new Date().toISOString(),impostazioni:getCfg(),tabelle:{serie_tv:D.serie_tv,film:D.film,lego:D.lego,libri:D.libri,progetti:D.progetti}});
function unpackBackup(o){let v=1,t=o;if(o&&o.tabelle&&typeof o.tabelle=="object"){v=+o.versione||1;t=o.tabelle}
if(v>VER)throw{code:"newer"};for(let i=v;i<VER;i++)if(MIGR[i])t=MIGR[i](t);
return{tabelle:t,impostazioni:(o&&o.impostazioni)||null,versione:v,esportato:(o&&o.esportato)||null}}
const markBackup=()=>{try{localStorage.setItem("mn_backup",String(Date.now()))}catch(x){}};
const touch=()=>{try{localStorage.setItem("mn_changed",String(Date.now()))}catch(x){}autoSoon()};
const bkAge=()=>{try{return+localStorage.getItem("mn_backup")||0}catch(x){return 0}};
const AUTO={h:null,on:false,t:null,err:null,last:0};
let PERSIST=null;
const FTYPES=[{description:"Backup JSON",accept:{"application/json":[".json"]}}];
async function metaGet(k){if(!idb)return null;try{return await req(store("meta").get(k))}catch(x){return null}}
async function metaPut(o){if(idb)try{await req(store("meta","readwrite").put(o))}catch(x){}}
async function metaDel(k){if(idb)try{await req(store("meta","readwrite").delete(k))}catch(x){}}
async function persistInit(){try{if(navigator.storage&&navigator.storage.persisted){PERSIST=await navigator.storage.persisted();if(!PERSIST)PERSIST=await navigator.storage.persist()}}catch(x){}}
async function askPersist(){try{if(navigator.storage&&navigator.storage.persist)PERSIST=await navigator.storage.persist()}catch(x){}return PERSIST}
async function autoInit(){if(!window.showSaveFilePicker)return;const r=await metaGet("filehandle");if(!r||!r.handle)return;AUTO.h=r.handle;
let p="prompt";try{p=await AUTO.h.queryPermission({mode:"readwrite"})}catch(x){}
if(p=="granted")await autoSync()}
async function autoSync(){try{const txt=await(await AUTO.h.getFile()).text();let fl=null;if(txt.trim()){try{fl=unpackBackup(JSON.parse(txt))}catch(x){fl=null}}
let loc=0;try{loc=+localStorage.getItem("mn_changed")||0}catch(x){}
const ft=fl&&fl.esportato?Date.parse(fl.esportato):0;
if(fl&&ft>loc+2000){AUTO.on=false;autoNewer(fl);return}
AUTO.on=true;await autoWrite()}catch(x){AUTO.err=String(x&&x.message||x);AUTO.on=false}}
async function autoWrite(){if(!AUTO.h||!AUTO.on)return;
try{const w=await AUTO.h.createWritable();await w.write(JSON.stringify(packBackup(),null,1));await w.close();AUTO.last=Date.now();markBackup();AUTO.err=null}
catch(x){AUTO.err=String(x&&x.message||x);AUTO.on=false;toast("Salvataggio automatico interrotto: "+AUTO.err)}}
const autoSoon=()=>{if(!AUTO.on)return;clearTimeout(AUTO.t);AUTO.t=setTimeout(autoWrite,1500)};
function previewImport(ok,meta,after){const lab=n=>n=="progetti"?"Progetti":T[n].n,ic=n=>n=="progetti"?"📋":T[n].i;
$("#dlg").innerHTML=`<h2>📥 Importare questi dati?</h2><p><small>Le tabelle del file sostituiranno quelle attuali. Le altre restano come sono.</small></p><div class="pn">${Object.keys(ok).map(n=>`<div class="st"><span>${ic(n)} ${lab(n)}</span><b>${(D[n]||[]).length} → ${ok[n].length}</b></div>`).join("")}</div>${meta&&meta.esportato?`<p><small>Backup del ${new Date(meta.esportato).toLocaleString("it-IT")}${meta.versione<VER?" · formato più vecchio, verrà aggiornato":""}</small></p>`:""}<div class="act" style="margin-top:14px"><button id="pvok" class="pri">✅ Sostituisci</button><button id="cx">Annulla</button></div>`;
$("#cx").onclick=()=>$("#dlg").close();
$("#pvok").onclick=async()=>{$("#dlg").close();await replaceAll(ok);if(meta&&meta.impostazioni)setCfg(meta.impostazioni);if(after)await after();go(st.tab);toast("Backup importato ✓: "+Object.keys(ok).map(n=>lab(n)+" "+ok[n].length).join(", "))};
if(!$("#dlg").open)$("#dlg").showModal()}
function autoNewer(fl){
$("#dlg").innerHTML=`<h2>💾 Il file di salvataggio è più recente</h2><p><small>${e(AUTO.h.name)} contiene dati più recenti di quelli di questo computer (${new Date(fl.esportato).toLocaleString("it-IT")}).</small></p><div class="act" style="flex-wrap:wrap"><button id="anl" class="pri">📥 Carica il file</button><button id="ank">Tieni questi dati e sovrascrivi il file</button><button id="and">Decidi dopo</button></div>`;
$("#anl").onclick=()=>previewImport(okTables(fl.tabelle),fl,async()=>{AUTO.on=true;await autoWrite()});
$("#ank").onclick=async()=>{$("#dlg").close();AUTO.on=true;await autoWrite();toast("Salvataggio automatico attivo")};
$("#and").onclick=()=>$("#dlg").close();
if(!$("#dlg").open)$("#dlg").showModal()}
async function autoAct(b){const a=b.dataset.au;
if(a=="choose"){try{const h=await showSaveFilePicker({suggestedName:"meganavigatore-dati.json",types:FTYPES});AUTO.h=h;await metaPut({id:"filehandle",handle:h});AUTO.on=true;await autoWrite();toast("Salvataggio automatico attivo su "+h.name)}catch(x){if(!x||x.name!="AbortError")toast("Impossibile attivare il salvataggio: "+(x&&x.message||x))}protDlg()}
else if(a=="link"){try{const[h]=await showOpenFilePicker({types:FTYPES,multiple:false});const p=await h.requestPermission({mode:"readwrite"});if(p!="granted")throw{message:"permesso negato"};
const txt=await(await h.getFile()).text();const enable=async()=>{AUTO.h=h;await metaPut({id:"filehandle",handle:h});AUTO.on=true;await autoWrite()};
let u=null;if(txt.trim())u=unpackBackup(JSON.parse(txt));
if(u&&Object.keys(okTables(u.tabelle)).length)previewImport(okTables(u.tabelle),u,enable);else{await enable();toast("Salvataggio automatico attivo su "+h.name);protDlg()}}
catch(x){if(!x||x.name!="AbortError")toast(x&&x.code=="newer"?"Questo file è stato creato da una versione più recente dell'app":"Impossibile collegare il file: "+(x&&x.message||x));protDlg()}}
else if(a=="stop"){AUTO.h=null;AUTO.on=false;await metaDel("filehandle");toast("Salvataggio automatico interrotto");protDlg()}
else if(a=="resume"){try{if(await AUTO.h.requestPermission({mode:"readwrite"})=="granted")await autoSync();else toast("Permesso negato")}catch(x){toast("Impossibile riattivare: "+(x&&x.message||x))}protDlg()}
else if(a=="persist"){await askPersist();protDlg()}}
function ageTxt(t){if(!t)return"nessun backup finora";const g=Math.floor((Date.now()-t)/864e5);return g<=0?"oggi":g==1?"ieri":g+" giorni fa"}
function bkBanner(){const t=bkAge(),au=AUTO.h&&AUTO.on,warn=!au&&(!t||Date.now()-t>14*864e5);
return `<div class="note" style="--a:${warn?"#f59e0b":"#06b6a4"};margin:0 0 14px;display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span>💾 ${au?"Salvataggio automatico attivo su "+e(AUTO.h.name):"Ultimo backup: "+ageTxt(t)}</span><button data-x="prot">🛡️ Protezione dati</button></div>`}
function protDlg(){const t=bkAge(),sup=!!window.showSaveFilePicker;
const st1=AUTO.h?(AUTO.on?`✅ Attivo su <b>${e(AUTO.h.name)}</b>${AUTO.last?" · ultimo salvataggio "+new Date(AUTO.last).toLocaleTimeString("it-IT"):""}`:`⏸️ In pausa su <b>${e(AUTO.h.name)}</b>${AUTO.err?" ("+e(AUTO.err)+")":""}`):"Non attivo";
const btns=sup?(AUTO.h?(AUTO.on?`<button data-au="stop">⏹ Interrompi</button>`:`<button class="pri" data-au="resume">▶ Riattiva</button><button data-au="stop">⏹ Interrompi</button>`):`<button class="pri" data-au="choose">📁 Crea un file di salvataggio…</button><button data-au="link">📂 Collega un file esistente…</button>`):"<small>Non disponibile in questo browser: usa Chrome o Edge.</small>";
$("#dlg").innerHTML=`<h2>🛡️ Protezione dei dati</h2><div class="pn" style="margin-bottom:10px"><b>Backup manuale</b><p style="margin:6px 0">Ultimo backup: ${ageTxt(t)}</p><button data-x="json">⬇️ Esporta backup JSON</button></div><div class="pn" style="margin-bottom:10px"><b>Salvataggio automatico su file</b><p style="margin:6px 0">${st1}</p><div class="row">${btns}</div><small style="color:var(--mut)">Ogni modifica viene scritta nel file che scegli. Se il file sta in una cartella sincronizzata (OneDrive, Google Drive, Dropbox) hai anche il backup e il passaggio tra computer.</small></div><div class="pn"><b>Protezione del browser</b><p style="margin:6px 0">${PERSIST===true?"✅ Il browser non cancellerà i dati da solo.":PERSIST===false?"⚠️ Il browser potrebbe cancellare i dati se lo spazio scarseggia.":"Stato non disponibile in questo browser."}</p>${PERSIST===true?"":'<button data-au="persist">🛡️ Chiedi la protezione</button>'}</div><div class="act" style="margin-top:14px"><button id="cx">Chiudi</button></div>`;
$("#cx").onclick=()=>$("#dlg").close();if(!$("#dlg").open)$("#dlg").showModal()}
