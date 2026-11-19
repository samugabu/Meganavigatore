let TASTE={};
function tasteMap(){const all=[...D.film,...D.animazione,...D.serie_tv].filter(x=>!x.da_guardare&&x.valutazione!=null&&x.genere),g={};
all.forEach(x=>x.genere.split(",").map(s=>s.trim()).filter(Boolean).forEach(k=>{(g[k]=g[k]||{s:0,n:0});g[k].s+=+x.valutazione;g[k].n++}));
const mean=all.length?all.reduce((s,x)=>s+ +x.valutazione,0)/all.length:7,sc={};Object.entries(g).forEach(([k,v])=>{sc[k]=(v.s+mean*3)/(v.n+3)});return sc}
const affin=x=>{const gs=(x.genere||"").split(",").map(s=>s.trim()).filter(k=>TASTE[k]!=null);return gs.length?gs.reduce((s,k)=>s+TASTE[k],0)/gs.length:null};
