const json=(o,s)=>new Response(JSON.stringify(o),{status:s,headers:{"Content-Type":"application/json"}});

export async function onRequestGet({request,env,params}){
  const url=new URL(request.url);
  const path=Array.isArray(params.path)?params.path.join("/"):String(params.path||"");
  if(path!=="search.json")return json({error:"percorso non consentito"},404);

  const origin=request.headers.get("Origin");
  const site=request.headers.get("Sec-Fetch-Site");
  if((origin&&origin!==url.origin)||site==="cross-site")return json({error:"richiesta non consentita"},403);

  const target=new URL("https://openlibrary.org/search.json");
  for(const k of ["title","author","q","limit","fields"]){
    if(url.searchParams.has(k))target.searchParams.set(k,url.searchParams.get(k).slice(0,200));
  }
  const contact=env.OL_CONTACT||"https://github.com";
  const r=await fetch(target,{
    headers:{Accept:"application/json","User-Agent":"Meganavigatore/1.0 ("+contact+")"},
    cf:{cacheEverything:true,cacheTtlByStatus:{"200-299":86400,"300-599":0}}
  });
  const out=new Headers({"Content-Type":"application/json","Cache-Control":r.ok?"public, max-age=86400":"no-store"});
  const ra=r.headers.get("Retry-After");
  if(ra)out.set("Retry-After",ra);
  return new Response(r.body,{status:r.status,headers:out});
}
