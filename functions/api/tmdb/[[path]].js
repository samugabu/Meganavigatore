const CONSENTITI=[/^search\/tv$/,/^tv\/\d+$/];
const json=(o,s)=>new Response(JSON.stringify(o),{status:s,headers:{"Content-Type":"application/json"}});

export async function onRequestGet({request,env,params}){
  const url=new URL(request.url);
  const path=Array.isArray(params.path)?params.path.join("/"):String(params.path||"");
  if(!CONSENTITI.some(r=>r.test(path)))return json({error:"percorso non consentito"},404);

  const origin=request.headers.get("Origin");
  const site=request.headers.get("Sec-Fetch-Site");
  if((origin&&origin!==url.origin)||site==="cross-site")return json({error:"richiesta non consentita"},403);

  const key=env.TMDB_API_KEY;
  if(!key)return json({error:"TMDB_API_KEY non configurata"},500);

  const target=new URL("https://api.themoviedb.org/3/"+path);
  for(const k of ["query","language","page"]){
    if(url.searchParams.has(k))target.searchParams.set(k,url.searchParams.get(k).slice(0,200));
  }
  const headers={Accept:"application/json"};
  if(key.startsWith("eyJ"))headers.Authorization="Bearer "+key;
  else target.searchParams.set("api_key",key);

  const r=await fetch(target,{headers,cf:{cacheEverything:true,cacheTtlByStatus:{"200-299":3600,"300-599":0}}});
  const out=new Headers({"Content-Type":"application/json","Cache-Control":r.ok?"public, max-age=3600":"no-store"});
  const ra=r.headers.get("Retry-After");
  if(ra)out.set("Retry-After",ra);
  return new Response(r.body,{status:r.status,headers:out});
}
