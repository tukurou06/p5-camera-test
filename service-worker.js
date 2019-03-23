const CACHE_NAME = 'cache-v1';
const urlsToCache = [
    './',
    './index.html',
    './css/siimple.css',
    './js/jquery-3.1.1.min.js',
    './js/main.js',
    './js/p5.dom.js',
    './js/p5.min.js'
];


self.addEventListener('install', function(event){
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache){
            return cache.addAll(urlsToCache); //リソースをすべて登録
        })
    );
});

self.addEventListener('activate', function(event){
    event.waitUntil(
        caches.keys().then(function(cache){
            cache.map(function(name){
                if(CACHE_NAME !== name) caches.delete(name);
            })
        })
    );
});

self.addEventListener('fetch', function(event){
    event.respondWith(
        caches.match(event.request).then(function(res){
            if(res) return res;
            return fetch(event.request);
        })
    );
});