let LASTC=null;
const KEYS=[["/","Cerca nella scheda corrente"],["N","Aggiungi un elemento"],["S","Cosa guardo stasera?"],["T","Cambia tema chiaro o scuro"],["B","Protezione dei dati"],["?","Mostra questo elenco"],["C","Apri Codice (appunti)"],["M","Apri o chiudi il menu laterale"],["Esc","Chiudi le finestre ed esci dalla ricerca"]];
function keysDlg(){const tabs=[...document.querySelectorAll("#nav button")].slice(0,10).map((b,i)=>`<span class="ch">${(i+1)%10} ${e(b.dataset.label)}</span>`).join(" ");
$("#dlg").innerHTML=`<h2>Scorciatoie da tastiera</h2><div class="pn">${KEYS.map(([k,t])=>`<div class="st"><span>${e(t)}</span><b style="font-size:1rem"><kbd>${e(k)}</kbd></b></div>`).join("")}<div class="st" style="display:block"><span>Numeri da 1 a 9 e 0: vai alla scheda in quella posizione</span><div class="row" style="margin-top:8px">${tabs}</div></div></div><p><small>Le scorciatoie non funzionano mentre scrivi in un campo o con una finestra aperta.</small></p><p><small>Meganavigatore versione ${APP_VERSION}</small></p><div class="act" style="margin-top:14px"><button id="cx">Chiudi</button></div>`;
$("#cx").onclick=()=>$("#dlg").close();if(!$("#dlg").open)$("#dlg").showModal()}
document.addEventListener("keydown",ev=>{if(ev.ctrlKey||ev.metaKey||ev.altKey)return;const t=ev.target,tag=t&&t.tagName;
if(tag=="INPUT"||tag=="TEXTAREA"||tag=="SELECT"||(t&&t.isContentEditable))return;if($("#dlg").open)return;const k=ev.key;
if(k=="/"){ev.preventDefault();let q=$("#q");if(q.style.display=="none"){go(LASTC||"film");q=$("#q")}q.focus();q.select()}
else if(k=="n"||k=="N"){ev.preventDefault();$("#add").click()}
else if(k=="?"){ev.preventDefault();keysDlg()}
else if(/^[0-9]$/.test(k)){const b=document.querySelectorAll("#nav button")[(+k||10)-1];if(b)b.click()}
else if(k=="c"||k=="C")go("codice");
else if(k=="m"||k=="M")sideToggle();
else if(k=="s"||k=="S"){ev.preventDefault();pick()}
else if(k=="t"||k=="T")$("#th").click();
else if(k=="b"||k=="B")protDlg()});
$("#q").addEventListener("keydown",ev=>{if(ev.key=="Escape"){if(ev.target.value){ev.target.value="";st.q="";st.n=24;render()}else ev.target.blur()}});
