let idb=null,D={serie_tv:[],film:[],lego:[],libri:[],progetti:[]},st={},cur=[],fm={};
const req=r=>new Promise((ok,ko)=>{r.onsuccess=()=>ok(r.result);r.onerror=()=>ko(r.error)});
const store=(n,m="readonly")=>idb.transaction(n,m).objectStore(n);
async function openDB(){try{const need=[...names,"progetti"],op=v=>new Promise((ok,ko)=>{const o=v?indexedDB.open("meganavigatore",v):indexedDB.open("meganavigatore");o.onupgradeneeded=()=>need.forEach(n=>{if(!o.result.objectStoreNames.contains(n))o.result.createObjectStore(n,{keyPath:"id",autoIncrement:true})});o.onsuccess=()=>{o.result.onversionchange=()=>o.result.close();ok(o.result)};o.onerror=()=>ko(o.error);o.onblocked=()=>ko("blocked")});let d=await op();if(!need.every(n=>d.objectStoreNames.contains(n))){const v=d.version+1;d.close();d=await op(v)}idb=d}catch(x){idb=null}}
async function dbPut(n,x){if(idb)x.id=await req(store(n,"readwrite").put(x));else if(!x.id)x.id=Math.max(0,...D[n].map(y=>y.id))+1;return x}
async function dbDel(n,id){if(idb)await req(store(n,"readwrite").delete(id))}
async function replaceAll(data){for(const n of [...names,"progetti"]){if(!Array.isArray(data[n]))continue;const rows=data[n].map((r,i)=>({...r,id:r.id||i+1}));if(idb){await req(store(n,"readwrite").clear());const tx=idb.transaction(n,"readwrite");rows.forEach(r=>tx.objectStore(n).put(r));await new Promise(ok=>{tx.oncomplete=ok;tx.onerror=ok})}D[n]=rows}}
async function savP(p){await dbPut("progetti",p);D.progetti=D.progetti.map(x=>x.id==p.id?p:x)}
