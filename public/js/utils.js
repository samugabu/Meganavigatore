const $=s=>document.querySelector(s);
const e=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const gi=g=>{g=(g||"").toLowerCase();return(GI.find(([k])=>g.includes(k))||[0,"🎬"])[1]};
const fd=d=>d?new Date(d).toLocaleDateString("it-IT"):null;
const rc=v=>v>=9?"r9":v>=8?"r8":v>=7?"r7":"r6";
const rb=v=>v==null?"":`<span class="rt ${rc(v)}">★ ${(+v).toFixed(1)}</span>`;
const pb=p=>p?`<span class="pl" style="--c:${(PLT[p]||[0,"#64748b"])[1]}">${(PLT[p]||["📡"])[0]} ${e(p)}</span>`:"";
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove("show"),2800)}
const sel=(k,arr,all)=>`<select data-k="${k}"><option value="">${all}</option>${arr.map(v=>`<option${st[k]==v?" selected":""}>${e(v)}</option>`).join("")}</select>`;
const bars=r=>{const mx=Math.max(1,...r.map(a=>a[1]));return r.map(([l,c])=>`<div class="br"><span>${l}</span><i style="--w:${c/mx*100}%"></i><b>${c}</b></div>`).join("")||"<p>Nessun dato</p>"};
const sure=(b,l)=>{if(b.dataset.s)return true;b.dataset.s=1;b.textContent="❗ Confermi?";setTimeout(()=>{if(b.isConnected){delete b.dataset.s;b.textContent=l}},3000);return false};
const pkOpt=(a,all)=>`<option value="">${all}</option>${a.map(v=>`<option>${e(v)}</option>`).join("")}`;
const fixT=t=>{let s=String(t).replace(/\s{2,}/g," ").trim();TY.forEach(([w,r])=>{s=s.replace(new RegExp("(^|[^\\p{L}])"+w.replace(/[\/\\^$*+?.()|[\]{}]/g,"\\$&")+"(?=$|[^\\p{L}])","giu"),(m,p)=>p+r)});return s};
const nk=t=>fixT(t).toLowerCase().replace(/[^\p{L}\p{N}]/gu,"");
const acc=(t,b)=>`<details class="ac" open><summary>${t}</summary><div class="acb">${b}</div></details>`;
const fhm=m=>{const h=Math.floor(m/60),r=Math.round(m%60);return r?`${h}h ${r}m`:`${h}h`};
const imgIc=(u,f)=>`<img class="cv" src="${e(u)}" alt="" loading="lazy" onerror="this.outerHTML='${f}'">`;
