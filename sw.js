const CACHE_NAME = 'hand-tracking-cache-v1';
const urlsToCache = [
    './',
    './index.html',
    './modules/camera_utils.js',
    './modules/control_utils.js',
    './modules/drawing_utils.js',
    './modules/hands.js',
    './modules/hands_files/hand_landmark_full.tflite',
    './modules/hands_files/hands_solution_packed_assets_loader.js',
    './modules/hands_files/hands_solution_simd_wasm_bin.js',
    './modules/hands_files/hands.binarypb',
    './modules/hands_files/hands_solution_packed_assets.data'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
}); 