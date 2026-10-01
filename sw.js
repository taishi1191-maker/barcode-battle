const CACHE="barcode-battle-v16";
const ASSETS=["./","./index.html","./manifest.webmanifest","./assets/icon-192.png","./assets/icon-512.png","./assets/apple-touch-icon.png","./assets/icon-1024.png","./assets/monsters/slime.png","./assets/monsters/dragon.png","./assets/monsters/beast.png","./assets/monsters/bird.png","./assets/monsters/ghost.png","./assets/monsters/machine.png","./assets/monsters/knight.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener("fetch",e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
