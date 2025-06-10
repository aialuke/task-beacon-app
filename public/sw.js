// Task Beacon App Service Worker - Phase 3 Optimization
// Cache routes, assets, and API responses for better performance

const CACHE_NAME = 'task-beacon-v1';
const STATIC_CACHE_NAME = 'task-beacon-static-v1';
const API_CACHE_NAME = 'task-beacon-api-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  // Main chunks will be added automatically
];

// Routes to cache
const ROUTES_TO_CACHE = [
  '/',
  '/tasks',
  '/create-task',
  '/calendar',
  '/profile',
];

// API endpoints to cache (short-term)
const API_ENDPOINTS_TO_CACHE = [
  '/api/tasks',
  '/api/users',
];

self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');
  
  // Cache static assets
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');
  
  // Clean up old caches
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              // Remove old cache versions
              return cacheName.startsWith('task-beacon-') && 
                     cacheName !== CACHE_NAME && 
                     cacheName !== STATIC_CACHE_NAME &&
                     cacheName !== API_CACHE_NAME;
            })
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        // Take control of all clients immediately
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Only handle same-origin requests
  if (url.origin !== location.origin) {
    return;
  }
  
  // Handle different types of requests
  if (request.method === 'GET') {
    if (isStaticAsset(request.url)) {
      // Cache-first strategy for static assets
      event.respondWith(cacheFirstStrategy(request, STATIC_CACHE_NAME));
    } else if (isAPIRequest(request.url)) {
      // Network-first strategy for API calls with short cache
      event.respondWith(networkFirstWithShortCache(request, API_CACHE_NAME));
    } else if (isRouteRequest(request)) {
      // Stale-while-revalidate for routes
      event.respondWith(staleWhileRevalidateStrategy(request, CACHE_NAME));
    }
  }
});

// Cache-first strategy: Try cache first, fallback to network
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('[SW] Serving from cache:', request.url);
      return cachedResponse;
    }
    
    console.log('[SW] Fetching from network:', request.url);
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache-first failed:', error);
    // Return offline fallback if available
    return new Response('Offline - content not available', { status: 503 });
  }
}

// Network-first with short cache for API calls
async function networkFirstWithShortCache(request, cacheName) {
  try {
    console.log('[SW] API: Trying network first:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      // Cache for 5 minutes only
      const responseToCache = networkResponse.clone();
      responseToCache.headers.set('sw-cached-at', Date.now().toString());
      cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] API: Network failed, trying cache:', request.url);
    
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      const cachedAt = cachedResponse.headers.get('sw-cached-at');
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
      
      // Only use cache if less than 5 minutes old
      if (cachedAt && parseInt(cachedAt) > fiveMinutesAgo) {
        console.log('[SW] Serving fresh cached API response:', request.url);
        return cachedResponse;
      }
    }
    
    throw error;
  }
}

// Stale-while-revalidate for routes
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Fetch from network in background
  const networkResponsePromise = fetch(request)
    .then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(error => {
      console.log('[SW] Network update failed for route:', request.url);
      return null;
    });
  
  // Return cached version immediately if available
  if (cachedResponse) {
    console.log('[SW] Serving cached route, updating in background:', request.url);
    return cachedResponse;
  }
  
  // Wait for network if no cache
  console.log('[SW] No cache, waiting for network:', request.url);
  return networkResponsePromise;
}

// Helper functions
function isStaticAsset(url) {
  return url.includes('/assets/') || 
         url.endsWith('.js') || 
         url.endsWith('.css') || 
         url.endsWith('.png') || 
         url.endsWith('.jpg') || 
         url.endsWith('.jpeg') || 
         url.endsWith('.svg') || 
         url.endsWith('.woff') || 
         url.endsWith('.woff2');
}

function isAPIRequest(url) {
  return url.includes('/api/') || 
         url.includes('supabase.co');
}

function isRouteRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));
}

// Listen for messages from main thread
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data?.type === 'PREFETCH_ROUTE') {
    const route = event.data.route;
    console.log('[SW] Prefetching route:', route);
    
    // Prefetch the route
    fetch(route)
      .then(response => {
        if (response.ok) {
          return caches.open(CACHE_NAME)
            .then(cache => cache.put(route, response));
        }
      })
      .catch(error => console.log('[SW] Prefetch failed:', route, error));
  }
});

console.log('[SW] Service worker script loaded'); 