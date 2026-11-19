/* Hikmah service worker */
const VERSION="hikmah-v1.0.0";
const SHELL="hikmah-shell-"+VERSION, AUDIO="hikmah-audio-v1";
const PRECACHE=["./", "index.html", "manifest.webmanifest", "fonts.css", "data/packages.json", "data/timings.json", "icons/apple-touch-icon.png", "icons/favicon-32.png", "icons/favicon-48.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-96.png", "icons/maskable-512.png", "fonts/amiri-arabic-400-normal.woff2", "fonts/amiri-arabic-700-normal.woff2", "fonts/amiri-quran-arabic-400-normal.woff2", "fonts/cormorant-garamond-latin-500-italic.woff2", "fonts/cormorant-garamond-latin-500-normal.woff2", "fonts/cormorant-garamond-latin-600-normal.woff2", "fonts/cormorant-garamond-latin-700-normal.woff2", "fonts/cormorant-garamond-latin-ext-500-italic.woff2", "fonts/cormorant-garamond-latin-ext-500-normal.woff2", "fonts/cormorant-garamond-latin-ext-600-normal.woff2", "fonts/cormorant-garamond-latin-ext-700-normal.woff2", "fonts/cormorant-garamond-vietnamese-500-italic.woff2", "fonts/cormorant-garamond-vietnamese-500-normal.woff2", "fonts/cormorant-garamond-vietnamese-600-normal.woff2", "fonts/cormorant-garamond-vietnamese-700-normal.woff2", "fonts/source-sans-3-latin-400-normal.woff2", "fonts/source-sans-3-latin-500-normal.woff2", "fonts/source-sans-3-latin-600-normal.woff2", "fonts/source-sans-3-latin-700-normal.woff2", "fonts/source-sans-3-latin-ext-400-normal.woff2", "fonts/source-sans-3-latin-ext-500-normal.woff2", "fonts/source-sans-3-latin-ext-600-normal.woff2", "fonts/source-sans-3-latin-ext-700-normal.woff2", "fonts/source-sans-3-vietnamese-400-normal.woff2", "fonts/source-sans-3-vietnamese-500-normal.woff2", "fonts/source-sans-3-vietnamese-600-normal.woff2", "fonts/source-sans-3-vietnamese-700-normal.woff2"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(SHELL).then(c=>c.addAll(PRECACHE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("hikmah-shell-")&&k!==SHELL).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
async function rangeResponse(req,res){
  const range=req.headers.get("range"); if(!range) return res;
  const buf=await res.arrayBuffer(); const size=buf.byteLength;
  const m=/bytes=(\d*)-(\d*)/.exec(range); let start=m&&m[1]?parseInt(m[1],10):0, end=m&&m[2]?parseInt(m[2],10):size-1;
  if(!m||start>=size){return new Response(null,{status:416,headers:{"Content-Range":"bytes */"+size}})}
  end=Math.min(end,size-1);
  return new Response(buf.slice(start,end+1),{status:206,headers:{"Content-Type":"audio/mpeg","Content-Length":String(end-start+1),"Content-Range":`bytes ${start}-${end}/${size}`,"Accept-Ranges":"bytes"}});
}
self.addEventListener("fetch",e=>{
  const req=e.request, url=new URL(req.url);
  if(req.method!=="GET"||url.origin!==location.origin) return;
  if(url.pathname.endsWith(".mp3")){
    e.respondWith((async()=>{
      const c=await caches.open(AUDIO); const hit=await c.match(url.href);
      if(hit) return rangeResponse(req,hit);
      return fetch(req);
    })()); return;
  }
  if(url.pathname.endsWith("/data/packages.json")||url.pathname.endsWith("/data/timings.json")){
    e.respondWith((async()=>{const c=await caches.open(SHELL);const hit=await c.match(req,{ignoreSearch:true});
      const net=fetch(req).then(r=>{if(r.ok)c.put(req,r.clone());return r}).catch(()=>hit);
      return hit||net})()); return;
  }
  if(req.mode==="navigate"){
    e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(SHELL).then(c=>c.put("index.html",cp));return r}).catch(async()=>(await caches.match("index.html"))||(await caches.match("./"))));
    return;
  }
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(hit=>hit||fetch(req)));
});
