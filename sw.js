/* Hikmah moved to https://hikmah-sadiq.github.io/ — retire the old offline copy. */
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>{e.waitUntil((async()=>{
  const ks=await caches.keys();await Promise.all(ks.filter(k=>k.startsWith("hikmah-")).map(k=>caches.delete(k)));
  await self.registration.unregister();
  const cs=await self.clients.matchAll({type:"window"});cs.forEach(c=>{try{c.navigate(c.url)}catch(e){}});
})())});
