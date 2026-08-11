'use client';

import { useStore } from '../store/useStore';
import { Timeline } from '../components/Timeline';
import { MapView } from '../components/MapView';
import { NowPlaying } from '../components/NowPlaying';
import { CurrencyWidget } from '../components/CurrencyWidget';
import { ChecklistModal } from '../components/ChecklistModal';
import { AddScheduleModal } from '../components/AddScheduleModal';
import { Plus, Map as MapIcon, List, DatabaseZap, RefreshCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';

export default function DashboardContent({ id, tripDates }: { id: string; tripDates: string[] }) {
  const { 
    selectedDate, 
    setSelectedDate,
    schedules: allSchedules,
    isLoadingSchedules,
    dbError,
    initSchedules,
    resetSchedules
  } = useStore();

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showChecklist, setShowChecklist] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Load schedules on mount via Zustand store (handles both IndexedDB and LocalStorage fallback)
  useEffect(() => {
    initSchedules();
  }, [initSchedules]);

  // Filter schedules by selected date
  const schedules = allSchedules.filter(item => item.date === selectedDate);

  const handleRecoverDB = async () => {
    try {
      // 1. Reset Zustand schedules (clears and re-populates both IndexedDB and LocalStorage)
      await resetSchedules();
      
      // 2. Clear Cache Storage
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
        } catch (e) {
          console.error(e);
        }
      }

      // 3. Unregister Service Workers
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const reg of registrations) {
            await reg.unregister();
          }
        } catch (e) {
          console.error(e);
        }
      }

      // 4. Force bypass cache and reload
      const nextUrl = new URL(window.location.origin + window.location.pathname);
      nextUrl.searchParams.set('t', Date.now().toString());
      window.location.href = nextUrl.toString();
    } catch (e) {
      console.error('Recovery failed:', e);
      window.location.reload();
    }
  };

  return (

    <div id={id} className="min-h-screen bg-[#e5e5e5] text-neutral-900 pb-24 md:pb-0 font-sans">
      <main id="main-frame" className="max-w-md mx-auto min-h-screen bg-[#F5F5F7] relative shadow-2xl overflow-hidden flex flex-col">
        <header id="header-bar" className="sticky top-0 bg-[#F5F5F7]/90 backdrop-blur-xl z-40 border-b border-neutral-200/60 pb-3">
          <div id="header-content" className="px-5 pt-8 pb-3">
            <div id="header-top-row" className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h1 id="main-heading" className="text-xl font-extrabold tracking-tight text-neutral-900">SG Trip Navigator</h1>
                <div id="system-controls" className="flex items-center gap-1">
                  <button 
                    id="btn-refresh"
                    onClick={() => window.location.reload()}
                    className="p-1.5 text-neutral-400 hover:text-blue-500 rounded-full transition-colors"
                  >
                    <RefreshCcw size={16} />
                  </button>
                  <button 
                    id="btn-db-reset"
                    onClick={handleRecoverDB}
                    className="p-1.5 text-neutral-400 hover:text-red-500 rounded-full transition-colors"
                  >
                    <DatabaseZap size={16} />
                  </button>
                </div>
              </div>
              <div id="layout-switch" className="bg-white p-1 rounded-full flex gap-1 shadow-sm border border-neutral-200">
                  <button 
                    id="btn-switch-list"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-full transition-colors ${viewMode === 'list' ? 'bg-neutral-900 text-white shadow' : 'text-neutral-500'}`}
                  >
                    <List size={16} />
                  </button>
                  <button 
                    id="btn-switch-map"
                    onClick={() => setViewMode('map')}
                    className={`p-1.5 rounded-full transition-colors ${viewMode === 'map' ? 'bg-neutral-900 text-white shadow' : 'text-neutral-500'}`}
                  >
                    <MapIcon size={16} />
                  </button>
              </div>
            </div>
            
            <div id="date-tabs" className="flex gap-2 overflow-x-auto no-scrollbar snap-x">
              {tripDates.map((date, idx) => {
                const isActive = selectedDate === date;
                const parsedDate = parseISO(date);
                return (
                  <button
                    key={date}
                    id={`tab-date-${date}`}
                    onClick={() => setSelectedDate(date)}
                    className={`snap-start shrink-0 px-4 py-2.5 rounded-2xl flex flex-col items-center gap-0.5 transition-all border ${isActive ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-neutral-200 text-neutral-500'}`}
                  >
                    <span className="text-[10px] uppercase tracking-widest font-bold">Day {idx + 1}</span>
                    <span className="font-bold text-lg leading-none">{format(parsedDate, 'dd')}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <div id="header-widget" className="px-3">
             <NowPlaying />
          </div>
        </header>

        <div id="scroll-area" className="flex-1 overflow-y-auto px-4 py-4">
           <div id="top-widget" className="mb-6">
              <CurrencyWidget />
           </div>

           <div id="main-section">
              <div id="section-title-box" className="flex items-center gap-2 mb-4">
                 <h2 id="section-heading" className="font-semibold text-lg">Schedule</h2>
              </div>
              
              {isLoadingSchedules ? (
                 <div id="loading-cards" className="space-y-4">
                   <div className="bg-white p-4 rounded-[24px] animate-pulse h-24" />
                 </div>
              ) : viewMode === 'list' ? (
                 <Timeline schedules={schedules} date={selectedDate} />
              ) : (
                 <div id="map-container" className="h-[500px]">
                   <MapView schedules={schedules} />
                 </div>
              )}
           </div>
        </div>

        <div id="footer-box" className="px-4 mt-8 mb-12 text-center pb-12">
          <button 
            id="btn-checklist"
            onClick={() => setShowChecklist(true)}
            className="text-xs font-bold text-neutral-500 bg-neutral-200/70 py-3 px-6 rounded-2xl inline-flex items-center gap-2"
          >
            チェックリスト
          </button>
        </div>
        <ChecklistModal isOpen={showChecklist} onClose={() => setShowChecklist(false)} />
        <AddScheduleModal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)} 
          selectedDate={selectedDate} 
          onSuccess={() => setShowAddModal(false)} 
        />

        <button 
          id="fab-add"
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center z-50"
        >
           <Plus size={24} />
        </button>
      </main>
    </div>
  );
}
