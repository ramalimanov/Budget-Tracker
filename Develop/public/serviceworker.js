const FILE_CACHE = 'my-static-cache-v1';
const DATA_CACHE = 'my-data-cache-v1';

const FilesToCache = [
    '/',
    '/index.js',
    '/styles.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
]

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(FILE_CACHE).then(function (cache) {
            console.log('Cache Opened!');
            return cache.addAll(FilesToCache)
        })
    )
})

self.addEventListener('fetch', function (event) {
    if (event.request.url.includes('/api')) {
        event.respondWith(
            caches.open(DATA_CACHE).then(cache => {
                return fetch(event.request)
                    .then(response => {
                        if (response.status === 200) {
                            cache.put(event.request.url, response.clone())
                        }

                        return response
                    })
                    .catch(err => {
                        cache.match(event.request.url)
                    })
                })
                )
                return;
        }
    event.respondWith(fetch(event.request).catch(function () {
        return caches.match(event.request).then(res => {
            if (res) {
                return res
            } else {
                return ('/')
            }
        })
    }))
})