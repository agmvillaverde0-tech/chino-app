const CACHE_NAME = "chino-app-v2";  // Cambia la versión aquí

self.addEventListener("install", (event) => {
  self.skipWaiting(); // Se activa inmediatamente
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "./",
        "./index.html",
        "./icon-192.png",
        "./icon-512.png",
        "./manifest.webmanifest"
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  // Borra todas las cachés antiguas automáticamente
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim(); // Se aplica la nueva versión a todas las ventanas
});

// Responde 1º desde la red, y si falla usa la caché
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() =>
        caches.match(event.request).then((response) => response)
      )
  );
});


