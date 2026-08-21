'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // 1. Clean up /index.html from url path if present
      if (window.location.pathname && window.location.pathname.endsWith('/index.html')) {
        const cleanPath = window.location.pathname.replace(/\/index\.html$/, '') || '/';
        try {
          window.history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
        } catch (e) {
          console.warn('[PWA] URL cleanup warning:', e);
        }
      }

      // 2. Unregister all existing service workers to solve chunk mismatch conflicts during preview/dev
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister().catch(() => {});
          }
        }).catch(() => {});
      }

      // 3. Clear all standard cache storages to prevent Webpack chunk 404/500 errors
      if ('caches' in window) {
        caches.keys().then((names) => {
          for (const name of names) {
            caches.delete(name).catch(() => {});
          }
        }).catch(() => {});
      }
    } catch (err) {
      console.warn('[PWA] ServiceWorkerRegister error:', err);
    }
  }, []);

  return null;
}


