const CONSENTITI=[/^lego\/sets\/[0-9A-Za-z-]+$/];
const json=(o,s)=>new Response(JSON.stringify(o),{status:s,headers:{"Content-Type":"application/json"}});

export async function onRequestGet({request,env,params}){
  const url=new URL(request.url);
  const path=(Array.isArray(params.path)?params.path.join("/"):String(params.path||"")).replace(/\/$/,"");
  if(!CONSENTITI.some(r=>r.test(path)))return json({error:"percorso non consentito"},404);

  const origin=request.headers.get("Origin");
  const site=request.headers.get("Sec-Fetch-Site");
  if((origin&&origin!==url.origin)||site==="cross-site")return json({error:"richiesta non consentita"},403);

  const key=env.REBRICKABLE_API_KEY;
  if(!key)return json({error:"REBRICKABLE_API_KEY non configurata"},500);

  const r=await fetch("https://rebrickable.com/api/v3/"+path+"/",{
    headers:{Accept:"application/json",Authorization:"key "+key},
    cf:{cacheEverything:true,cacheTtlByStatus:{"200-299":86400,"300-599":0}}
  });
  const out=new Headers({"Content-Type":"application/json","Cache-Control":r.ok?"public, max-age=86400":"no-store"});
  const ra=r.headers.get("Retry-After");
  if(ra)out.set("Retry-After",ra);
  return new Response(r.body,{status:r.status,headers:out});
}
