const V='brokeros-v2';
const CACHE=['/','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CACHE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.url.includes('supabase.co')) return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    if(res.ok&&e.request.method==='GET'){const rc=res.clone();caches.open(V).then(c=>c.put(e.request,rc))}
    return res;
  })));
});
self.addEventListener('push',e=>{
  const d=e.data?.json()||{title:'BrokerOS',body:'Новое уведомление'};
  e.waitUntil(self.registration.showNotification(d.title,{body:d.body,icon:'/icon-192.png',badge:'/icon-192.png',vibrate:[200,100,200]}));
});
