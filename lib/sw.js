// importScripts("sw-config.js");

workbox.core.setCacheNameDetails({
    prefix: 'img-lib',
    suffix: 'v1',
    precache: 'install-time',
    runtime: 'run-time',
    googleAnalytics: 'ga',
});

workbox.core.setLogLevel(workbox.core.LOG_LEVELS.silent);

workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

workbox.routing.registerRoute(
    // Cache image files
    /.*\.(?:png|jpg|jpeg|svg|gif)/,
    // Use the cache if it's available
    workbox.strategies.cacheFirst({
        // Use a custom cache name
        cacheName: 'image-cache',
        cacheableResponse: {statuses: [0, 200]},
        plugins: [
            new workbox.expiration.Plugin({
                // Cache only 60 images
                maxEntries: 60,
                // Cache for a maximum of a week
                maxAgeSeconds: 7 * 24 * 60 * 60,
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            })
        ],
    })
);

workbox.routing.registerRoute(
    // Cache CSS files
    /.*\.css$/,
    // Use cache but update in the background ASAP
    workbox.strategies.staleWhileRevalidate({
        // Use a custom cache name
        cacheName: 'css-cache',
    })
);

workbox.routing.registerRoute(
    /.*\.js$/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'js-cache',
    }),
  );

//   workbox.routing.registerRoute(
//     self.config.API_BASE_URL +'/*',
//     workbox.strategies.cacheFirst({
//         cacheName: 'image-api-gets',
//         plugins: [
//           new workbox.expiration.Plugin({
//             maxEntries: 50,
//             maxAgeSeconds: 5 * 60, // 5 minutes
//           }),
//           new workbox.cacheableResponse.Plugin({
//             statuses: [0, 200],
//           }),
//         ],
//     }),
// );
