const staticCacheName = 'public-static';
const imageCacheNames = 'public-imgs';
const scriptsCacheName = 'public-scripts';
const stylesCacheName = 'public-styles';
const gtfsCacheName = 'public-gtfs';
const allCaches = [
    staticCacheName,
    scriptsCacheName,
    imageCacheNames,
    gtfsCacheName
];

const cacheFiles = [
    '/',
    'manifest.json',
    'fonts/font-material-design.woff2',
    'favicon.ico',
];

/**
 * When the service worker is installed then caches the static files
 */
self.addEventListener('install', (event) => {
    //console.info('Installing Service Worker and caching static files!');
    
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
        
        if (requestUrl.pathname.startsWith('/scripts/')) {
            event.respondWith(serveScripts(event.request));
            return;
        }
        
        if (requestUrl.pathname.startsWith('/images/') ||
            (/\.(gif|jpg|jpeg|tiff|png|ico)$/i).test(requestUrl.pathname)) {
            event.respondWith(serveImages(event.request));
            return;
        }
        
        if (requestUrl.pathname.startsWith('/styles/')) {
            event.respondWith(serveStyles(event.request));
            return;
        }
        
        //TODO: remove this data in order use IDB
        //if (requestUrl.pathname.startsWith('/data/')) {
        //    event.respondWith(serveData(event.request));
        //    return;
        //}
    }
    
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});

function serveScripts(request) {
    var storageUrlScript = request.url;
    
    return caches.open(scriptsCacheName).then(function(cache) {
        return cache.match(storageUrlScript).then(function(response) {
            var networkFetch = fetch(request).then(function(networkResponse) {
                cache.put(storageUrlScript, networkResponse.clone());
                return networkResponse;
            });
            
            return response || networkFetch;
        });
    });
}

function serveStyles(request) {
    var storageUrlStyle = request.url;
    
    return caches.open(stylesCacheName).then(function(cache) {
        return cache.match(storageUrlStyle).then(function(response) {
            var networkFetch = fetch(request).then(function(networkResponse) {
                cache.put(storageUrlStyle, networkResponse.clone());
                return networkResponse;
            });
            
            return response || networkFetch;
        });
    });
}

function serveImages(request) {
    var storageUrlImage = request.url;
    
    return caches.open(imageCacheNames).then(function(cache) {
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
    //console.info('Data =>', storageUrlData);
    
    return caches.open(gtfsCacheName).then(function(cache) {
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

/**
 * Delete old caches and
 */
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('public-') && !allCaches.includes(cacheName);
                }).map(function(cacheName) {
                    console.log('Deleting Cache : ' + cacheName);
                    return caches.delete(cacheName);
                })
            );
        })
    );
});
