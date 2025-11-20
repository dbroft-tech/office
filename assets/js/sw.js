// D-Broft Technologies - Service Worker
// Progressive Web App functionality with 1-space indentation

 'use strict';

 const CACHE_NAME = 'dbroft-v1.0.0';
 const STATIC_CACHE = 'dbroft-static-v1.0.0';
 const DYNAMIC_CACHE = 'dbroft-dynamic-v1.0.0';

// Assets to cache immediately
 const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/services.html',
  '/portfolio.html',
  '/contact.html',
  '/assets/css/main.css',
  '/assets/css/components.css',
  '/assets/css/animations.css',
  '/assets/js/main.js',
  '/assets/js/components.js',
  '/assets/js/animations.js',
  '/assets/img/logo.jpg',
  '/assets/img/favicon.png',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap'
 ];

// Assets to cache on demand
 const DYNAMIC_ASSETS = [
  '/reviews.html',
  '/faq.html',
  '/terms.html',
  '/social.html',
  '/services.html',
  '/portfolio.html'
 ];

// Network-first resources (always try network first)
 const NETWORK_FIRST = [
  '/contact.html',
  'https://www.google-analytics.com',
  'https://www.googletagmanager.com'
 ];

// Install event - cache static assets
 self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
   caches.open(STATIC_CACHE)
    .then((cache) => {
     console.log('Service Worker: Caching static assets');
     return cache.addAll(STATIC_ASSETS);
    })
    .then(() => {
     console.log('Service Worker: Static assets cached');
     return self.skipWaiting();
    })
    .catch((error) => {
     console.error('Service Worker: Error caching static assets', error);
    })
  );
 });

// Activate event - clean up old caches
 self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
   caches.keys()
    .then((cacheNames) => {
     return Promise.all(
      cacheNames.map((cacheName) => {
       if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
        console.log('Service Worker: Deleting old cache', cacheName);
        return caches.delete(cacheName);
       }
      })
     );
    })
    .then(() => {
     console.log('Service Worker: Activated');
     return self.clients.claim();
    })
  );
 });

// Fetch event - serve cached content when offline
 self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
 // Skip non-GET requests
  if (request.method !== 'GET') {
   return;
  }
  
 // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
   return;
  }
  
 // Handle different caching strategies based on request type
  if (isStaticAsset(request.url)) {
   event.respondWith(cacheFirst(request));
  } else if (isNetworkFirst(request.url)) {
   event.respondWith(networkFirst(request));
  } else if (isHTMLPage(request.url)) {
   event.respondWith(staleWhileRevalidate(request));
  } else {
   event.respondWith(networkFirst(request));
  }
 });

// Cache-first strategy (for static assets)
 async function cacheFirst(request) {
  try {
   const cachedResponse = await caches.match(request);
   if (cachedResponse) {
    return cachedResponse;
   }
   
   const networkResponse = await fetch(request);
   if (networkResponse.ok) {
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, networkResponse.clone());
   }
   return networkResponse;
  } catch (error) {
   console.error('Cache-first strategy failed:', error);
   return new Response('Offline content not available', {
    status: 503,
    statusText: 'Service Unavailable'
   });
  }
 }

// Network-first strategy (for dynamic content)
 async function networkFirst(request) {
  try {
   const networkResponse = await fetch(request);
   if (networkResponse.ok) {
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
   }
   return networkResponse;
  } catch (error) {
   console.log('Network failed, trying cache:', request.url);
   const cachedResponse = await caches.match(request);
   if (cachedResponse) {
    return cachedResponse;
   }
   
  // Return offline page for HTML requests
   if (isHTMLPage(request.url)) {
    return caches.match('/index.html');
   }
   
   return new Response('Offline', {
    status: 503,
    statusText: 'Service Unavailable'
   });
  }
 }

// Stale-while-revalidate strategy (for HTML pages)
 async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
   if (networkResponse.ok) {
    cache.put(request, networkResponse.clone());
   }
   return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
 }

// Helper functions
 function isStaticAsset(url) {
  return STATIC_ASSETS.some(asset => url.includes(asset)) ||
         url.includes('.css') ||
         url.includes('.js') ||
         url.includes('.png') ||
         url.includes('.jpg') ||
         url.includes('.jpeg') ||
         url.includes('.svg') ||
         url.includes('.woff') ||
         url.includes('.woff2') ||
         url.includes('fonts.googleapis.com') ||
         url.includes('fonts.gstatic.com');
 }

 function isNetworkFirst(url) {
  return NETWORK_FIRST.some(pattern => url.includes(pattern));
 }

 function isHTMLPage(url) {
  return url.includes('.html') || 
         (!url.includes('.') && !url.includes('api/'));
 }

// Background sync for form submissions
 self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'contact-form') {
   event.waitUntil(syncContactForm());
  }
 });

// Sync contact form submissions when back online
 async function syncContactForm() {
  try {
   const db = await openDB();
   const tx = db.transaction(['pending-forms'], 'readonly');
   const store = tx.objectStore('pending-forms');
   const pendingForms = await store.getAll();
   
   for (const form of pendingForms) {
    try {
     const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
       'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.data)
     });
     
     if (response.ok) {
     // Remove from pending forms
      const deleteTx = db.transaction(['pending-forms'], 'readwrite');
      const deleteStore = deleteTx.objectStore('pending-forms');
      await deleteStore.delete(form.id);
      
      console.log('Form synced successfully:', form.id);
     }
    } catch (error) {
     console.error('Failed to sync form:', form.id, error);
    }
   }
  } catch (error) {
   console.error('Background sync failed:', error);
  }
 }

// Push notification handling
 self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
   body: event.data ? event.data.text() : 'New update from D-Broft Technologies',
   icon: '/assets/img/favicon.png',
   badge: '/assets/img/favicon.png',
   vibrate: [200, 100, 200],
   data: {
    url: '/'
   },
   actions: [
    {
     action: 'open',
     title: 'Open Website',
     icon: '/assets/img/favicon.png'
    },
    {
     action: 'close',
     title: 'Close',
     icon: '/assets/img/favicon.png'
    }
   ]
  };
  
  event.waitUntil(
   self.registration.showNotification('D-Broft Technologies', options)
  );
 });

// Notification click handling
 self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'open') {
   event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
   );
  }
 });

// Message handling from main thread
 self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
   self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
   event.waitUntil(
    caches.open(DYNAMIC_CACHE)
     .then(cache => cache.addAll(event.data.urls))
   );
  }
 });

// IndexedDB helper for offline form storage
 function openDB() {
  return new Promise((resolve, reject) => {
   const request = indexedDB.open('dbroft-offline', 1);
   
   request.onerror = () => reject(request.error);
   request.onsuccess = () => resolve(request.result);
   
   request.onupgradeneeded = (event) => {
    const db = event.target.result;
    
    if (!db.objectStoreNames.contains('pending-forms')) {
     const store = db.createObjectStore('pending-forms', { keyPath: 'id' });
     store.createIndex('timestamp', 'timestamp');
    }
   };
  });
 }

// Periodic background sync for cache updates
 self.addEventListener('periodicsync', (event) => {
  console.log('Service Worker: Periodic sync triggered', event.tag);
  
  if (event.tag === 'cache-update') {
   event.waitUntil(updateCache());
  }
 });

// Update cache with fresh content
 async function updateCache() {
  try {
   const cache = await caches.open(DYNAMIC_CACHE);
   const requests = STATIC_ASSETS.map(url => new Request(url));
   
   for (const request of requests) {
    try {
     const response = await fetch(request);
     if (response.ok) {
      await cache.put(request, response);
     }
    } catch (error) {
     console.log('Failed to update cache for:', request.url);
    }
   }
   
   console.log('Cache updated successfully');
  } catch (error) {
   console.error('Cache update failed:', error);
  }
 }

// Error handling
 self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
 });

 self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
 });

 console.log('Service Worker: Loaded successfully');
