var CACHE = 'portfolio-v3';
var urls = [
  'index.html',
  'style.css',
  'script.js',
  'clm-logo.svg',
  'christopher.webp',
  'dorsu-logo.webp',
  'favicon.svg',
  '404.html'
];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(urls);
    })
  );
});

self.addEventListener('fetch', function (e) {
  e.respondWith(
    fetch(e.request)
      .then(function (res) {
        var clone = res.clone();
        caches.open(CACHE).then(function (cache) {
          cache.put(e.request, clone);
        });
        return res;
      })
      .catch(function () {
        return caches.match(e.request);
      })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; })
          .map(function (k) { return caches.delete(k); })
      );
    })
  );
});
