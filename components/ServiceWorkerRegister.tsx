'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. Unregister all existing service workers to solve chunk mismatch conflicts during preview/dev
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister().then((success) => {
              if (success) {
                console.log('Successfully unregistered service worker:', registration.scope);
              }
            });
          }
        }).catch((err) => {
          console.error('Error unregistering service workers:', err);
        });
      }

      // 2. Clear all standard cache storages to prevent Webpack chunk 404/500 errors
      if ('caches' in window) {
        caches.keys().then((names) => {
          for (const name of names) {
            caches.delete(name).then((success) => {
              if (success) {
                console.log('Cleared Cache Storage:', name);
              }
            });
          }
        }).catch((err) => {
          console.error('Error clearing cache storage:', err);
        });
      }
    }
  }, []);

  return null;
}

