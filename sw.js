const CACHE="barcode-battle-v18";
const ASSETS=[
"./","./index.html","./manifest.webmanifest",
"./assets/icon-192.png","./assets/icon-512.png","./assets/apple-touch-icon.png","./assets/icon-1024.png",
"./assets/monsters/slime.png","./assets/monsters/dragon.png","./assets/monsters/beast.png","./assets/monsters/bird.png","./assets/monsters/ghost.png","./assets/monsters/machine.png","./assets/monsters/knight.png",
"./assets/backgrounds/arena/arena.jpg","./assets/backgrounds/grassland/grassland.jpg","./assets/backgrounds/forest/forest.jpg","./assets/backgrounds/ruins/ruins.jpg","./assets/backgrounds/castle/castle.jpg",
"./assets/effects/slash/slash_blue.png","./assets/effects/fire/fire_red.png","./assets/effects/poison/poison.png","./assets/effects/lightning/lightning.png"
];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
