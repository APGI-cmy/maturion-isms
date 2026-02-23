/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'mat-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install service worker and cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    })
  );
});

// Update service worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync — G-16 Wave 2R offline evidence queue replay
self.addEventListener('sync', (event) => {
  if (event.tag === 'evidence-sync') {
    event.waitUntil(syncOfflineEvidence());
  }
});

async function syncOfflineEvidence() {
  try {
    const db = await openOfflineDB();
    const tx = db.transaction('evidence_queue', 'readonly');
    const store = tx.objectStore('evidence_queue');
    const pendingItems = await getAllRecords(store);

    for (const item of pendingItems) {
      if (item.sync_status !== 'pending') continue;
      try {
        // Notify main thread to handle the actual Supabase upload
        const clients = await self.clients.matchAll({ type: 'window' });
        for (const client of clients) {
          client.postMessage({ type: 'SYNC_EVIDENCE', payload: item });
        }
        // Mark as syncing (main thread will confirm synced via message)
        const writeTx = db.transaction('evidence_queue', 'readwrite');
        const writeStore = writeTx.objectStore('evidence_queue');
        await putRecord(writeStore, { ...item, sync_status: 'syncing' });
      } catch (err) {
        console.error('[SW] Failed to initiate sync for item', item.id, err);
      }
    }
    db.close();
  } catch (err) {
    console.error('[SW] syncOfflineEvidence failed:', err);
  }
}

function openOfflineDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('mat-offline-db', 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('evidence_queue')) {
        const store = db.createObjectStore('evidence_queue', { keyPath: 'id' });
        store.createIndex('sync_status', 'sync_status', { unique: false });
        store.createIndex('criterion_id', 'criterion_id', { unique: false });
      }
    };
  });
}

function getAllRecords(store) {
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

function putRecord(store, record) {
  return new Promise((resolve, reject) => {
    const request = store.put(record);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
