/// <reference lib="webworker" />

// Service Worker for MAT Frontend PWA
declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'mat-v1';
const urlsToCache = [
  '/',
  '/index.html',
];

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

export {};
