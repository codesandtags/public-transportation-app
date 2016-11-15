const staticCacheName = 'public-static-v1';
const contentImgCache = 'public-imgs';
const dataGTFS = 'public-gtfs';
const allCaches = [
    staticCacheName,
    contentImgCache,
    dataGTFS
];

const cacheFiles = [
    '/',
    'manifest.json',
    // scrripts
    'scripts/vendors/papaparse.min.js',
    'scripts/vendors/jquery-3.1.1.min.js',
    'scripts/gtfs.js',
    'scripts/main.js',
    //styles
    'styles/main.css',
    'styles/material-icons.css',
    //fonts
    'fonts/font-material-design.woff2',
    //favicons
    'favicon.ico',
    'images/icons/favicon-16x16.png',
    'images/icons/favicon-32x32.png',
    'images/icons/favicon-96x96.png',
    'images/icons/apple-icon-152x152.png',
    'images/icons/android-icon-192x192.png',
    // External files
    'https://code.getmdl.io/1.2.1/material.red-orange.min.css',
    'https://code.getmdl.io/1.1.3/material.min.js'
];

/**
 * When the service worker is installed then caches the static files
 */
self.addEventListener('install', (event) => {
    console.info('Installing Service Worker and caching static files!');
    
    event.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            return cache.addAll(cacheFiles);
        })
    );
    
});

self.addEventListener('fetch', function(event) {
    var requestUrl = new URL(event.request.url);
    
    if (requestUrl.origin === location.origin) {
        if (requestUrl.pathname === '/') {
            event.respondWith(caches.match('/'));
            return;
        }
        
        if (requestUrl.pathname.startsWith('/images/') ||
            (/\.(gif|jpg|jpeg|tiff|png|ico)$/i).test(requestUrl.pathname)) {
            event.respondWith(serveImages(event.request));
            return;
        }
        
        if (requestUrl.pathname.startsWith('/data/')) {
            event.respondWith(serveData(event.request));
            return;
        }
    }
    
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});

function serveImages(request) {
    var storageUrlImage = request.url;
    
    return caches.open(contentImgCache).then(function(cache) {
        return cache.match(storageUrlImage).then(function(response) {
            var networkFetch = fetch(request).then(function(networkResponse) {
                cache.put(storageUrlImage, networkResponse.clone());
                return networkResponse;
            });
            
            return response || networkFetch;
        });
    });
}

function serveData(request) {
    var storageUrlData = request.url;
    console.info('Data =>', storageUrlData);
    
    return caches.open(dataGTFS).then(function(cache) {
        return cache.match(storageUrlData).then(function(response) {
            var networkFetch = fetch(request).then(function(networkResponse) {
                cache.put(storageUrlData, networkResponse.clone());
                return networkResponse;
            });
            
            return response || networkFetch;
        });
    });
}

self.addEventListener('message', function(event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
