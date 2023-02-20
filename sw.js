var APP_PREFIX = 'ITM_'     // Identifier for this app (this needs to be consistent across every cache update)
var VERSION = 'v0'              // Version of the off-line cache (change this value everytime you want to update cache)
var CACHE_NAME = APP_PREFIX + VERSION
var URLS = [                            // Add URL you want to cache in this list.
    '/itm/',                     // If you have separate JS/CSS files,
    '/itm/index.html',            // add path to those files here
    '/itm/dist/8a2a3c8efae774018112.wasm',
    '/itm/dist/55d3459a09daf1539fb9.js',
    '/itm/dist/signtest.sqlite3',
    '/itm/dist/sql-httpvfs.js',
    '/itm/icons/favicon-16x16.png',
    '/itm/icons/mstile-310x310.png',
    '/itm/icons/mstile-144x144.png',
    '/itm/icons/favicon-128x128.png',
    '/itm/icons/apple-touch-icon-120x120.png',
    '/itm/icons/android-chrome-192x192.png',
    '/itm/icons/favicon-196x196.png',
    '/itm/icons/mstile-70x70.png',
    '/itm/icons/apple-touch-icon-152x152.png',
    '/itm/icons/apple-touch-icon-180x180.png',
    '/itm/icons/mstile-310x150.png',
    '/itm/icons/apple-touch-icon-114x114.png',
    '/itm/icons/apple-touch-icon-76x76.png',
    '/itm/icons/android-chrome-512x512.png',
    '/itm/icons/favicon-96x96.png',
    '/itm/icons/apple-touch-icon-57x57.png',
    '/itm/icons/apple-touch-icon-72x72.png',
    '/itm/icons/mstile-150x150.png',
    '/itm/icons/apple-touch-icon-167x167.png',
    '/itm/icons/apple-touch-icon-60x60.png',
    '/itm/icons/apple-touch-icon-144x144.png',
    '/itm/icons/favicon-32x32.png',
    '/itm/app.js',
    '/itm/main.js',
    '/itm/manifest.json',
    '/itm/style.css',
    '._signtest.sqlite3',
    '/itm/_signtest.sqlite3',
    '/itm/dist/_signtest.sqlite3'
]

// Respond with cached resources
self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { // if cache is available, respond with cache
        console.log('responding with cache : ' + e.request.url)
        return request
      } else {       // if there are no cache, try fetching request
        console.log('file is not cached, fetching : ' + e.request.url)
        return fetch(e.request)
      }

      // You can omit if/else for console.log & put one line below like this too.
      // return request || fetch(e.request)
    })
  )
})

// Cache resources
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(URLS)
    })
  )
})

// Delete outdated caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create white list
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      // add current cache name to white list
      cacheWhitelist.push(CACHE_NAME)

      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('deleting cache : ' + keyList[i] )
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})