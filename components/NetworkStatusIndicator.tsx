'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { useStore } from '../store/useStore';

export function NetworkStatusIndicator() {
  const { isOffline, setIsOffline } = useStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    // Only run on client
    if (typeof window === 'undefined') return;

    function handleOnline() {
      setIsOffline(false);
    }


    function handleOffline() {
      setIsOffline(true);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setIsOffline]);

  if (!mounted) return null;

  return (
    <>
      {isOffline && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-amber-500 px-4 py-3 text-xs font-semibold text-white shadow-md sm:text-sm animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <WifiOff size={16} />
          <span>現在オフラインです。データはローカルに保存されます。</span>
        </div>
      )}
    </>
  );
}
