// Service Worker stub
self.addEventListener('install', (event) => {
  // Service Worker installing
  if (import.meta.env.DEV) {
    console.log('Service Worker installing.');
  }
});

self.addEventListener('activate', (event) => {
  // Service Worker activating
  if (import.meta.env.DEV) {
    console.log('Service Worker activating.');
  }
});

self.addEventListener('fetch', (event) => {
  // Pass through for now
});
