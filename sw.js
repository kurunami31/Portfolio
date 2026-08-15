var CACHE = 'portfolio-v15';
var urls = [
  'index.html',
  'style.css',
  'script.js',
  'clm-logo.svg',
  'christopher.webp',
  'codex-logo.png',
  'fnahs-logo.png',
  'deis-logo.png',
  'favicon.svg',
  'camera-favicon.svg',
  'og-image.webp',
  'sitemap.xml',
  '404.html',
  'blog/index.html',
  'blog/building-for-student-orgs.html',
  'case-studies/sweetworks.html',
  'case-studies/resibooth.html',
  'case-studies/codex.html',
  'case-studies/dorsu-esports.html'
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
