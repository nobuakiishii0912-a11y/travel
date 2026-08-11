'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ScheduleItem } from '../lib/types';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-100 text-neutral-400">
      <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-500 rounded-full animate-spin mb-2" />
      <span className="text-xs font-semibold tracking-wider">LOADING MAP COMPONENT...</span>
    </div>
  )
});

interface MapViewProps {
  schedules: ScheduleItem[];
}

export function MapView({ schedules }: MapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-neutral-100 text-neutral-400 rounded-3xl">
        <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-500 rounded-full animate-spin mb-2" />
        <span className="text-xs font-semibold tracking-wider">LOADING MAP...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[300px] rounded-3xl overflow-hidden border border-neutral-200 shadow-inner">
      <MapComponent schedules={schedules} />
    </div>
  );
}
