const LIBS={};
const LIB_DOCX="https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.js",LIB_MAM="https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js";
function loadLib(key,url,glob){if(window[glob])return Promise.resolve(window[glob]);if(LIBS[key])return LIBS[key];
return LIBS[key]=new Promise((ok,ko)=>{const s=document.createElement("script");s.src=url;s.onload=()=>window[glob]?ok(window[glob]):ko(new Error("lib"));s.onerror=()=>{LIBS[key]=null;ko(new Error("net"))};document.head.appendChild(s)})}
const fdt=t=>t?new Date(t).toLocaleDateString("it-IT",{day:"numeric",month:"short"}):"";
const notesSorted=()=>D.note.slice().sort((a,b)=>(b.modificato||0)-(a.modificato||0));
function mdLite(t){const inl=s=>e(s).replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\*\*([^*]+)\*\*/g,"<b>$1</b>").replace(/\*([^*]+)\*/g,"<i>$1</i>").replace(/\[\[([^\]]+)\]\]/g,(m,a)=>`<button class="wl" data-nt="link" data-l="${a}">${a}</button>`);
const out=[];let code=null,list=null;const flush=()=>{if(list){out.push(`<${list[0]}>${list[1].join("")}</${list[0]}>`);list=null}};
for(const l of String(t).split("\n")){let m;
if(/^```/.test(l)){if(code){out.push(`<pre>${e(code.join("\n"))}</pre>`);code=null}else{flush();code=[]}continue}
if(code){code.push(l);continue}
if(m=l.match(/^(#{1,6})\s+(.*)/)){flush();out.push(`<h${m[1].length}>${inl(m[2])}</h${m[1].length}>`)}
else if(m=l.match(/^\s*[-*]\s+(.*)/)){if(!list||list[0]!="ul"){flush();list=["ul",[]]}list[1].push(`<li>${inl(m[1])}</li>`)}
else if(m=l.match(/^\s*\d+\.\s+(.*)/)){if(!list||list[0]!="ol"){flush();list=["ol",[]]}list[1].push(`<li>${inl(m[1])}</li>`)}
else if(m=l.match(/^>\s?(.*)/)){flush();out.push(`<blockquote>${inl(m[1])}</blockquote>`)}
else if(/^---+$/.test(l.trim())){flush();out.push("<hr>")}
else if(!l.trim())flush();
else{flush();out.push(`<p>${inl(l)}</p>`)}}
flush();if(code)out.push(`<pre>${e(code.join("\n"))}</pre>`);return out.join("")}
const noteList=()=>{const q=(st.nq||"").toLowerCase(),a=notesSorted().filter(x=>!q||((x.titolo||"")+" "+(x.testo||"")).toLowerCase().includes(q));
return a.length?a.map(x=>`<button class="ni2${x.id==st.nt?" on":""}" data-nt="open" data-i="${x.id}"><b>${e(x.titolo||"Senza titolo")}</b><small>${e(fdt(x.modificato))} · ${e((x.testo||"").replace(/\s+/g," ").slice(0,48))}</small></button>`).join(""):"<small>Nessuna pagina</small>"};
function noteEditor(x){if(!x)return `<div class="empty">Nessuna pagina. Creane una nuova o importa un file Word.</div>`;
const t=String(x.titolo||"").trim(),back=t?D.note.filter(y=>y.id!=x.id&&String(y.testo||"").toLowerCase().includes("[["+t.toLowerCase()+"]]")):[];
return `<div class="bar"><input id="nt-title" value="${e(x.titolo)}" placeholder="Titolo"><button data-nt="pv">${st.npv?"Modifica":"Anteprima"}</button><button data-nt="exp">Esporta Word</button><button data-nt="del" class="dg">Elimina</button><small id="nt-st">Salvato</small></div>${st.npv?`<div class="md" id="nt-md">${mdLite(x.testo||"")}</div>`:`<textarea id="nt-text" spellcheck="false" placeholder="Scrivi qui i tuoi appunti. Usa # per i titoli, ** per il grassetto e [[Titolo]] per collegare altre pagine.">${e(x.testo||"")}</textarea>`}${back.length?`<div class="pn" style="margin-top:12px"><b>Collegamenti in entrata</b><div class="row" style="margin-top:6px">${back.map(y=>`<button data-nt="open" data-i="${y.id}">${e(y.titolo)}</button>`).join("")}</div></div>`:""}`}
function codice(){const ns=notesSorted();if(!D.note.some(x=>x.id==st.nt))st.nt=ns[0]?ns[0].id:null;const cur=D.note.find(x=>x.id==st.nt);
return `<div class="cd"><aside class="cdl"><div class="row"><button class="pri" data-nt="new">Nuova pagina</button><button data-nt="imp">Importa Word</button></div><input id="nq" type="search" placeholder="Cerca nelle note" value="${e(st.nq||"")}"><div id="ntl">${noteList()}</div></aside><section class="cde" id="nte">${noteEditor(cur)}</section></div><input type="file" id="fdoc" accept=".docx" hidden>`}
let NT_T=null;
function ntSave(x){const s=$("#nt-st");if(s)s.textContent="Salvataggio…";clearTimeout(NT_T);
NT_T=setTimeout(async()=>{await dbPut("note",x);const s2=$("#nt-st"),l=$("#ntl");if(s2)s2.textContent="Salvato";if(l)l.innerHTML=noteList()},500)}
async function ntNew(titolo,testo){const x={titolo:titolo||"Senza titolo",testo:testo||"",creato:Date.now(),modificato:Date.now()};await dbPut("note",x);D.note.push(x);st.nt=x.id;st.npv=false;return x}
async function ntact(b){const d=b.dataset;
if(d.nt=="new"){await ntNew();render();const t=$("#nt-title");if(t){t.focus();t.select()}}
else if(d.nt=="open"){st.nt=+d.i;st.npv=false;render()}
else if(d.nt=="pv"){st.npv=!st.npv;render()}
else if(d.nt=="del"){if(sure(b,"Elimina")){const x=D.note.find(y=>y.id==st.nt);if(!x)return;await dbDel("note",x.id);D.note=D.note.filter(y=>y.id!=x.id);st.nt=null;render();toastUndo("Pagina eliminata",async()=>{await dbPut("note",x);D.note.push(x);st.nt=x.id;render()})}}
else if(d.nt=="link"){const x=D.note.find(y=>String(y.titolo).toLowerCase()==d.l.toLowerCase());if(x){st.nt=x.id;st.npv=false}else await ntNew(d.l);render()}
else if(d.nt=="imp")$("#fdoc").click();
else if(d.nt=="exp")docxExport()}
document.addEventListener("input",ev=>{const t=ev.target;
if(t.id=="nt-title"||t.id=="nt-text"){const x=D.note.find(y=>y.id==st.nt);if(!x)return;if(t.id=="nt-title")x.titolo=t.value;else x.testo=t.value;x.modificato=Date.now();ntSave(x)}
else if(t.id=="nq"){st.nq=t.value;$("#ntl").innerHTML=noteList()}});
document.addEventListener("keydown",ev=>{const t=ev.target;if(t.id=="nt-text"&&ev.key=="Tab"){ev.preventDefault();const s=t.selectionStart;t.value=t.value.slice(0,s)+"  "+t.value.slice(t.selectionEnd);t.selectionStart=t.selectionEnd=s+2;t.dispatchEvent(new Event("input",{bubbles:true}))}});
document.addEventListener("change",ev=>{if(ev.target.id=="fdoc"&&ev.target.files[0]){docxImport(ev.target.files[0]);ev.target.value=""}});
function mdToDocx(L,x){const{Paragraph,TextRun,HeadingLevel}=L,HL=[null,HeadingLevel.HEADING_1,HeadingLevel.HEADING_2,HeadingLevel.HEADING_3,HeadingLevel.HEADING_4,HeadingLevel.HEADING_5,HeadingLevel.HEADING_6];
const runs=s=>String(s).split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\[\[[^\]]+\]\])/).filter(Boolean).map(p=>/^\*\*/.test(p)?new TextRun({text:p.slice(2,-2),bold:true}):/^`/.test(p)?new TextRun({text:p.slice(1,-1),style:"CodiceInline"}):/^\*/.test(p)?new TextRun({text:p.slice(1,-1),italics:true}):/^\[\[/.test(p)?new TextRun({text:p.slice(2,-2),underline:{}}):new TextRun(p));
const out=[new Paragraph({text:x.titolo||"Senza titolo",heading:HeadingLevel.TITLE})];let code=false;
String(x.testo||"").split("\n").forEach(l=>{let m;if(/^```/.test(l)){code=!code;return}
if(code)out.push(new Paragraph({style:"Codice",children:[new TextRun(l)]}));
else if(m=l.match(/^(#{1,6})\s+(.*)/))out.push(new Paragraph({children:runs(m[2]),heading:HL[m[1].length]}));
else if(m=l.match(/^\s*[-*]\s+(.*)/))out.push(new Paragraph({children:runs(m[1]),bullet:{level:0}}));
else if(m=l.match(/^\s*(\d+)\.\s+(.*)/))out.push(new Paragraph({children:runs(m[1]+". "+m[2]),indent:{left:360}}));
else if(m=l.match(/^>\s?(.*)/))out.push(new Paragraph({children:runs(m[1]),indent:{left:480}}));
else out.push(new Paragraph({children:runs(l)}))});return out}
async function docxExport(){const x=D.note.find(y=>y.id==st.nt);if(!x)return;let L;
try{L=await loadLib("docx",LIB_DOCX,"docx")}catch(err){toast("Libreria Word non caricata: controlla la connessione a internet");return}
const name=(String(x.titolo||"pagina").replace(/[\\/:*?"<>|]+/g,"").trim()||"pagina")+".docx";
await out(name,async()=>await L.Packer.toBlob(new L.Document({styles:{paragraphStyles:[{id:"Codice",name:"Codice",basedOn:"Normal",run:{font:"Consolas",size:20},paragraph:{spacing:{after:0}}}],characterStyles:[{id:"CodiceInline",name:"Codice inline",run:{font:"Consolas"}}]},sections:[{children:mdToDocx(L,x)}]})).then(b=>b.arrayBuffer()))}
function htmlToMd(h){const d=new DOMParser().parseFromString(h,"text/html"),out=[];
const one=c=>{if(c.nodeType==3)return c.textContent;if(c.nodeType!=1)return"";const t=c.tagName.toLowerCase(),i=inl(c);
if((t=="strong"||t=="b")&&i.trim())return"**"+i.trim()+"**";if((t=="em"||t=="i")&&i.trim())return"*"+i.trim()+"*";if(t=="code"&&i.trim())return"`"+i.trim()+"`";if(t=="br")return"\n";return i},
inl=n=>[...n.childNodes].map(one).join("");
const lst=(n,ord,dep)=>{let k=0;[...n.children].forEach(li=>{if(li.tagName.toLowerCase()!="li")return;k++;const subs=[...li.children].filter(c=>/^(ul|ol)$/i.test(c.tagName));
const txt=[...li.childNodes].filter(c=>!(c.nodeType==1&&/^(ul|ol)$/i.test(c.tagName))).map(one).join("").trim().replace(/\n/g," ");
out.push("  ".repeat(dep)+(ord?k+". ":"- ")+txt);subs.forEach(s=>lst(s,/^ol$/i.test(s.tagName),dep+1))})};
[...d.body.children].forEach(n=>{const t=n.tagName.toLowerCase();let m;
if(m=t.match(/^h([1-6])$/)){out.push("","#".repeat(+m[1])+" "+inl(n).trim(),"")}
else if(t=="ul"||t=="ol"){out.push("");lst(n,t=="ol",0);out.push("")}
else if(t=="table"){out.push("");n.querySelectorAll("tr").forEach(tr=>out.push([...tr.children].map(c=>inl(c).trim().replace(/\n/g," ")).join(" | ")));out.push("")}
else if(t=="blockquote")out.push("> "+inl(n).trim(),"");
else if(t=="pre"){if(out[out.length-2]=="```"&&out[out.length-1]==""){out.pop();out.splice(out.length-1,0,n.textContent)}else out.push("```",n.textContent,"```","")}
else out.push(inl(n).trim(),"")});
return out.join("\n").replace(/\n{3,}/g,"\n\n").trim()}
async function docxImport(f){let M;try{M=await loadLib("mammoth",LIB_MAM,"mammoth")}catch(err){toast("Libreria Word non caricata: controlla la connessione a internet");return}
try{const r=await M.convertToHtml({arrayBuffer:await f.arrayBuffer()},{styleMap:["p[style-name='Title'] => h1:fresh","p[style-name='Codice'] => pre","r[style-name='Codice inline'] => code"]});let md=htmlToMd(r.value),ti=f.name.replace(/\.docx$/i,"");const hm=md.match(/^#\s+(.+)\n*/);if(hm){ti=hm[1].trim();md=md.slice(hm[0].length)}await ntNew(ti,md);render();toast("Pagina creata da "+f.name)}catch(err){toast("Impossibile leggere il file Word")}}
