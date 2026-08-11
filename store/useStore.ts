import { create } from 'zustand';
import { ScheduleItem } from '../lib/types';
import { db } from '../lib/db';
import { initialData } from '../lib/defaultData';

interface TravelStore {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  sgdRate: number | null;
  setSgdRate: (rate: number) => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  
  // Schedules State
  schedules: ScheduleItem[];
  isLoadingSchedules: boolean;
  dbError: boolean;
  
  // Actions
  initSchedules: () => Promise<void>;
  addSchedule: (item: ScheduleItem) => Promise<void>;
  updateSchedule: (id: string, updates: Partial<ScheduleItem>) => Promise<void>;
  reorderSchedules: (orderedItems: ScheduleItem[]) => Promise<void>;
  bulkUpdateSchedules: (updates: ScheduleItem[]) => Promise<void>;
  resetSchedules: () => Promise<void>;
}

export const useStore = create<TravelStore>((set) => ({
  selectedDate: '2026-09-08',
  setSelectedDate: (date) => set({ selectedDate: date }),
  sgdRate: null,
  setSgdRate: (rate) => set({ sgdRate: rate }),
  isOffline: false,
  setIsOffline: (offline) => set({ isOffline: offline }),
  
  // Schedules initial state
  schedules: [],
  isLoadingSchedules: false,
  dbError: false,

  initSchedules: async () => {
    set({ isLoadingSchedules: true });
    
    if (typeof window === 'undefined') {
      set({ schedules: initialData, isLoadingSchedules: false });
      return;
    }

    let loadedSchedules: ScheduleItem[] = [];
    let usingIndexedDB = false;

    // 1. Try Loading from IndexedDB (Dexie)
    if (db) {
      try {
        // Attempt a test count to ensure Dexie is fully functional (no iframe sandbox blocker)
        const count = await db.schedules.count();
        if (count > 0) {
          loadedSchedules = await db.schedules.toArray();
          usingIndexedDB = true;
          console.log('[Store] Loaded schedules from IndexedDB:', loadedSchedules.length);
        } else {
          const schedulesWithStatus = initialData.map(item => ({
            ...item,
            status: item.status || 'NotStarted'
          }));
          await db.schedules.bulkAdd(schedulesWithStatus);
          loadedSchedules = schedulesWithStatus;
          usingIndexedDB = true;
          console.log('[Store] Populated and loaded schedules from IndexedDB:', loadedSchedules.length);
        }
      } catch (err) {
        console.warn('[Store] IndexedDB load failed, falling back to localStorage:', err);
        set({ dbError: true });
      }
    }

    // 2. Fallback to LocalStorage
    if (!usingIndexedDB) {
      try {
        const localData = localStorage.getItem('SingaporeTravelSchedules');
        if (localData) {
          loadedSchedules = JSON.parse(localData);
          console.log('[Store] Loaded schedules from localStorage:', loadedSchedules.length);
        } else {
          loadedSchedules = initialData.map(item => ({
            ...item,
            status: item.status || 'NotStarted'
          }));
          localStorage.setItem('SingaporeTravelSchedules', JSON.stringify(loadedSchedules));
          console.log('[Store] Initialized localStorage with default schedules');
        }
      } catch (err) {
        console.error('[Store] localStorage fallback failed:', err);
        // Absolute fallback to memory only
        loadedSchedules = initialData.map(item => ({
          ...item,
          status: item.status || 'NotStarted'
        }));
      }
    }

    // Ensure sorted by order
    loadedSchedules.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    set({ schedules: loadedSchedules, isLoadingSchedules: false });
  },

  addSchedule: async (item) => {
    const { schedules } = useStore.getState();
    const updated = [...schedules, item];
    set({ schedules: updated });

    if (db) {
      try {
        await db.schedules.add(item);
        console.log('[Store] Added schedule to IndexedDB');
      } catch (err) {
        console.warn('[Store] Failed to add schedule to IndexedDB:', err);
      }
    }

    try {
      localStorage.setItem('SingaporeTravelSchedules', JSON.stringify(updated));
    } catch (err) {
      console.error('[Store] Failed to save added schedule to localStorage:', err);
    }
  },

  updateSchedule: async (id, updates) => {
    const { schedules } = useStore.getState();
    const updated = schedules.map(item => item.id === id ? { ...item, ...updates } : item);
    set({ schedules: updated });

    if (db) {
      try {
        await db.schedules.update(id, updates);
        console.log('[Store] Updated schedule in IndexedDB');
      } catch (err) {
        console.warn('[Store] Failed to update schedule in IndexedDB:', err);
      }
    }

    try {
      localStorage.setItem('SingaporeTravelSchedules', JSON.stringify(updated));
    } catch (err) {
      console.error('[Store] Failed to save updated schedule to localStorage:', err);
    }
  },

  reorderSchedules: async (orderedItems) => {
    // Replace current schedules list with sorted/reordered array
    set({ schedules: orderedItems });

    if (db) {
      try {
        // Bulk update IndexedDB orders
        await db.schedules.bulkPut(orderedItems);
        console.log('[Store] Reordered schedules in IndexedDB');
      } catch (err) {
        console.warn('[Store] Failed to reorder schedules in IndexedDB:', err);
      }
    }

    try {
      localStorage.setItem('SingaporeTravelSchedules', JSON.stringify(orderedItems));
    } catch (err) {
      console.error('[Store] Failed to save reordered schedules to localStorage:', err);
    }
  },

  bulkUpdateSchedules: async (updates) => {
    const { schedules } = useStore.getState();
    const updated = schedules.map(item => {
      const found = updates.find(u => u.id === item.id);
      return found ? { ...item, ...found } : item;
    });
    set({ schedules: updated });

    if (db) {
      try {
        await db.schedules.bulkPut(updates);
        console.log('[Store] Bulk updated schedules in IndexedDB');
      } catch (err) {
        console.warn('[Store] Failed to bulk update schedules in IndexedDB:', err);
      }
    }

    try {
      localStorage.setItem('SingaporeTravelSchedules', JSON.stringify(updated));
    } catch (err) {
      console.error('[Store] Failed to save bulk updated schedules to localStorage:', err);
    }
  },

  resetSchedules: async () => {
    set({ isLoadingSchedules: true });
    
    const freshSchedules = initialData.map(item => ({
      ...item,
      status: item.status || 'NotStarted'
    }));

    set({ schedules: freshSchedules });

    if (db) {
      try {
        await db.schedules.clear();
        await db.schedules.bulkAdd(freshSchedules);
        console.log('[Store] Cleared and reset IndexedDB schedules');
      } catch (err) {
        console.warn('[Store] Failed to reset IndexedDB:', err);
      }
    }

    try {
      localStorage.setItem('SingaporeTravelSchedules', JSON.stringify(freshSchedules));
      console.log('[Store] Cleared and reset localStorage schedules');
    } catch (err) {
      console.error('[Store] Failed to reset localStorage:', err);
    }

    set({ isLoadingSchedules: false });
  }
}));


