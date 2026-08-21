import Dexie, { type Transaction } from 'dexie';
import { initialData } from './defaultData';

export interface AppCache {
  key: string;
  data: any;
  timestamp: number;
  queryDate?: string;
}

export type TravelDB = any;

let db: TravelDB | null = null;

if (typeof window !== 'undefined') {
  try {
    db = new Dexie('SingaporeTravelDB');

    // Consolidated schema to avoid multi-step transaction hangs
    db.version(16).stores({
      schedules: 'id, date, order, status',
      appCache: 'key, timestamp'
    }).upgrade(async (tx: Transaction) => {
      try {
        await tx.table('schedules').clear();
        const schedulesWithStatus = initialData.map(item => ({
          ...item,
          status: item.status || 'NotStarted'
        }));
        await tx.table('schedules').bulkAdd(schedulesWithStatus);
      } catch (e) {
        console.warn('Dexie upgrade warning:', e);
      }
    });

    db.on('populate', async () => {
      try {
        const schedulesWithStatus = initialData.map(item => ({
          ...item,
          status: item.status || 'NotStarted'
        }));
        await db!.schedules.bulkAdd(schedulesWithStatus);
      } catch (e) {
        console.warn('Dexie populate warning:', e);
      }
    });
  } catch (err) {
    console.warn('IndexedDB unavailable or restricted:', err);
    db = null;
  }
}

export { db };


