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
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/globals.compiled.css" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
