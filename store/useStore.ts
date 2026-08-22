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

const defaultSchedules: ScheduleItem[] = initialData.map(item => ({
  ...item,
  status: item.status || 'NotStarted'
}));

export const useStore = create<TravelStore>((set) => ({
  selectedDate: '2026-09-08',
  setSelectedDate: (date) => set({ selectedDate: date }),
  sgdRate: null,
  setSgdRate: (rate) => set({ sgdRate: rate }),
  isOffline: false,
  setIsOffline: (offline) => set({ isOffline: offline }),
  
  // Schedules initial state: initialized immediately with default data so UI renders without delay
  schedules: defaultSchedules,
  isLoadingSchedules: false,
  dbError: false,

  initSchedules: async () => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      let loadedSchedules: ScheduleItem[] | null = null;

      // 1. Synchronously read from localStorage for 0ms instant display
      try {
        const storedVersion = localStorage.getItem('SingaporeTravelDataVersion');
        const localData = localStorage.getItem('SingaporeTravelSchedules');
        const CURRENT_VERSION = 'v30';

        if (localData && storedVersion === CURRENT_VERSION) {
          try {
            const parsed = JSON.parse(localData);
            if (Array.isArray(parsed) && parsed.length > 0) {
              loadedSchedules = parsed;
            }
          } catch (parseErr) {
            console.warn('[Store] JSON parse error, falling back to defaultSchedules:', parseErr);
            loadedSchedules = defaultSchedules;
          }
        } else {
          // Version updated or first load: clear old storage and use updated defaults
          loadedSchedules = defaultSchedules;
          localStorage.setItem('SingaporeTravelSchedules', JSON.stringify(defaultSchedules));
          localStorage.setItem('SingaporeTravelDataVersion', CURRENT_VERSION);
          if (db) {
            db.schedules.clear().then(() => db.schedules.bulkAdd(defaultSchedules)).catch(err => console.warn(err));
          }
        }
      } catch (lsErr) {
        console.warn('[Store] localStorage read warning:', lsErr);
      }

      // If localStorage had valid data, set it immediately
      if (loadedSchedules) {
        loadedSchedules.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        set({ schedules: loadedSchedules });
      }

      // 2. Safely check IndexedDB in the background with a 1-second timeout
      if (db) {
        try {
          const idbPromise = (async () => {
            const count = await db.schedules.count();
            if (count > 0) {
              return await db.schedules.toArray();
            } else {
              const dataToSave = loadedSchedules || defaultSchedules;
              await db.schedules.bulkAdd(dataToSave);
              return dataToSave;
            }
          })();

          const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 1000));
          const idbResult = await Promise.race([idbPromise, timeoutPromise]);

          if (Array.isArray(idbResult) && idbResult.length > 0) {
            idbResult.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            set({ schedules: idbResult, isLoadingSchedules: false });
            return;
          }
        } catch (idbErr) {
          console.warn('[Store] IndexedDB background sync warning:', idbErr);
        }
      }

      // 3. Fallback save to localStorage if not yet stored
      if (!loadedSchedules) {
        try {
          localStorage.setItem('SingaporeTravelSchedules', JSON.stringify(defaultSchedules));
          localStorage.setItem('SingaporeTravelDataVersion', 'v16');
        } catch (e) {
          console.warn('[Store] Failed to save fallback to localStorage:', e);
        }
      }
    } catch (globalErr) {
      console.error('[Store] initSchedules global catch:', globalErr);
    } finally {
      set({ isLoadingSchedules: false });
    }
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
      localStorage.setItem('SingaporeTravelDataVersion', 'v18');
      console.log('[Store] Cleared and reset localStorage schedules');
    } catch (err) {
      console.error('[Store] Failed to reset localStorage:', err);
    }

    set({ isLoadingSchedules: false });
  }
}));


