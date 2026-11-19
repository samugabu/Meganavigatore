const icsEnc=new TextEncoder();
const icsEvents=()=>{const today=new Date().toISOString().slice(0,10);return D.serie_tv.filter(x=>x.prossima_data&&x.prossima_data>=today).sort((a,b)=>a.prossima_data.localeCompare(b.prossima_data))};
const icsEsc=s=>String(s).replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n");
function icsFold(l){const out=[];let cur="",len=0;for(const ch of l){const b=icsEnc.encode(ch).length;if(len+b>(out.length?74:75)){out.push(cur);cur="";len=0}cur+=ch;len+=b}out.push(cur);return out.map((s,i)=>i?" "+s:s).join("\r\n")}
function buildIcs(){const now=new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d+/,""),L=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Meganavigatore//IT","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:Uscite serie TV"];
icsEvents().forEach(x=>{const d=x.prossima_data.replace(/-/g,""),nx=new Date(x.prossima_data+"T12:00:00");nx.setDate(nx.getDate()+1);const d2=nx.toISOString().slice(0,10).replace(/-/g,"");
L.push("BEGIN:VEVENT","UID:serie-"+x.id+"-"+d+"@meganavigatore","DTSTAMP:"+now,"DTSTART;VALUE=DATE:"+d,"DTEND;VALUE=DATE:"+d2,"SUMMARY:"+icsEsc(x.titolo+(x.prossima_info?" - "+x.prossima_info:"")),"DESCRIPTION:"+icsEsc("Nuova puntata"+(x.prossima_info?" ("+x.prossima_info+")":"")+(x.dove_guardarlo?". Dove guardarla: "+x.dove_guardarlo:"")),"TRANSP:TRANSPARENT","END:VEVENT")});
L.push("END:VCALENDAR");return L.map(icsFold).join("\r\n")+"\r\n"}
function icsExport(){if(!icsEvents().length){toast("Nessuna uscita in programma da esportare");return}out("uscite-serie.ics",buildIcs)}
