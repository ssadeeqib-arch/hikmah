/* Hikmah service worker */
const VERSION="hikmah-v2.3.0";
const SHELL="hikmah-shell-"+VERSION;
const PRECACHE=["./", "index.html", "app.css", "app.js", "art.js", "fonts.css", "manifest.webmanifest", "data/packages.json", "data/timings.json","data/people.json", "icons/apple-touch-icon.png", "icons/favicon-32.png", "icons/favicon-48.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-96.png", "icons/maskable-512.png", "fonts/amiri-arabic-400-normal.woff2", "fonts/amiri-arabic-700-normal.woff2", "fonts/amiri-quran-arabic-400-normal.woff2", "fonts/plus-jakarta-sans-latin-400-normal.woff2", "fonts/plus-jakarta-sans-latin-500-normal.woff2", "fonts/plus-jakarta-sans-latin-600-normal.woff2", "fonts/plus-jakarta-sans-latin-700-normal.woff2", "fonts/plus-jakarta-sans-latin-800-normal.woff2", "fonts/plus-jakarta-sans-latin-ext-400-normal.woff2", "fonts/plus-jakarta-sans-latin-ext-500-normal.woff2", "fonts/plus-jakarta-sans-latin-ext-600-normal.woff2", "fonts/plus-jakarta-sans-latin-ext-700-normal.woff2", "fonts/plus-jakarta-sans-latin-ext-800-normal.woff2", "fonts/plus-jakarta-sans-vietnamese-400-normal.woff2", "fonts/plus-jakarta-sans-vietnamese-500-normal.woff2", "fonts/plus-jakarta-sans-vietnamese-600-normal.woff2", "fonts/plus-jakarta-sans-vietnamese-700-normal.woff2", "fonts/plus-jakarta-sans-vietnamese-800-normal.woff2"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(SHELL).then(c=>c.addAll(PRECACHE.map(u=>new Request(u,{cache:"reload"})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("hikmah-shell-")&&k!==SHELL).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const req=e.request, url=new URL(req.url);
  if(req.method!=="GET"||url.origin!==location.origin) return;
  if(url.pathname.endsWith(".mp3")) return; /* audio is handled by the page */
  if(url.pathname.endsWith(".json")||url.pathname.endsWith(".js")||url.pathname.endsWith(".css")||req.mode==="navigate"){
    /* network first so updates arrive; cache as fallback offline */
    e.respondWith(fetch(req,{cache:"no-cache"}).then(r=>{if(r.ok){const cp=r.clone();caches.open(SHELL).then(c=>c.put(req.mode==="navigate"?"index.html":req,cp))}return r}).catch(async()=>(await caches.match(req,{ignoreSearch:true}))||(req.mode==="navigate"?await caches.match("index.html"):undefined)));
    return;
  }
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(hit=>hit||fetch(req)));
});
