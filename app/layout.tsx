import type {Metadata, Viewport} from 'next';
import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { ServiceWorkerRegister } from '../components/ServiceWorkerRegister';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Singapore Trip Planner',
  description: 'Personal travel schedule for Singapore trip',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                // 1. Clean up /index.html from url path
                if (window.location.pathname.endsWith('/index.html')) {
                  var cleanPath = window.location.pathname.replace(/\\/index\\.html$/, '') || '/';
                  window.history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
                }

                // 2. Unregister service workers immediately to prevent "Cannot read properties of undefined (reading 'call')" Webpack chunk mismatches
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(regs) {
                    for (var i = 0; i < regs.length; i++) {
                      regs[i].unregister().then(function(success) {
                        if (success) console.log('[Inline SW] Successfully unregistered service worker');
                      });
                    }
                  }).catch(function(err) {
                    console.error('[Inline SW] Error:', err);
                  });
                }

                // 3. Clear Cache Storage immediately on load to prevent loading stale chunks
                if ('caches' in window) {
                  caches.keys().then(function(keys) {
                    for (var i = 0; i < keys.length; i++) {
                      caches.delete(keys[i]).then(function(success) {
                        if (success) console.log('[Inline Cache] Cleared:', keys[i]);
                      });
                    }
                  }).catch(function(err) {
                    console.error('[Inline Cache] Error:', err);
                  });
                }
              }
            `
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
