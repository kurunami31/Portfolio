var CACHE = 'portfolio-v20';
var urls = [
  'index.html',
  'style.css',
  'script.js',
  'logo.png',
  'christopher.webp',
  'codex-logo.png',
  'fnahs-logo.png',
  'deis-logo.png',
  'favicon.svg',
  'favicon-32.png',
  'apple-touch-icon.png',
  'og-image.webp',
  'christopher.vcf',
  'qr.svg',
  'sitemap.xml',
  '404.html',
  'portfolio/index.html',
  'blog/index.html',
  'blog/building-for-student-orgs.html',
  'case-studies/codex.html'
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
