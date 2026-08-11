import Dexie, { type Transaction } from 'dexie';
import { initialData } from './defaultData';

export interface AppCache {
  key: string;
  data: any;
  timestamp: number;
  queryDate?: string;
}

// Define the type for our DB
export type TravelDB = any; // Dexie & { ... }

let db: TravelDB | null = null;

if (typeof window !== 'undefined') {
  try {
    console.log('Initializing Dexie DB');
    db = new Dexie('SingaporeTravelDB');

    db.version(1).stores({
      schedules: 'id, date, order'
    });

    db.version(2).stores({
      schedules: 'id, date, order'
    });

    // Bump to version 3 to ensure upgrade runs and replaces old sample data
    db.version(3).stores({
      schedules: 'id, date, order'
    }).upgrade(async (tx: Transaction) => {
      await tx.table('schedules').clear();
      await tx.table('schedules').bulkAdd(initialData);
    });

    db.version(5).stores({
      schedules: 'id, date, order, status'
    }).upgrade(async (tx: Transaction) => {
      await tx.table('schedules').clear();
      const schedulesWithStatus = initialData.map(item => ({
        ...item,
        status: item.status || 'NotStarted'
      }));
      await tx.table('schedules').bulkAdd(schedulesWithStatus);
    });

    db.version(6).stores({
      schedules: 'id, date, order, status',
      appCache: 'key, timestamp'
    });

    db.version(7).stores({
      schedules: 'id, date, order, status',
      appCache: 'key, timestamp'
    }).upgrade(async (tx: Transaction) => {
      const item = await tx.table('schedules').get('13');
      if (item && item.title === 'チェックアウト') {
        await tx.table('schedules').update('13', { title: 'ホテル（チェックアウト）' });
      }
    });

    db.version(10).stores({
      schedules: 'id, date, order, status',
      appCache: 'key, timestamp'
    }).upgrade(async (tx: Transaction) => {
      // Force reload with latest initialData (including stayDurationMin: 0 changes)
      await tx.table('schedules').clear();
      const schedulesWithStatus = initialData.map(item => ({
        ...item,
        status: item.status || 'NotStarted'
      }));
      await tx.table('schedules').bulkAdd(schedulesWithStatus);
    });

    db.version(11).stores({
      schedules: 'id, date, order, status',
      appCache: 'key, timestamp'
    }).upgrade(async (tx: Transaction) => {
      // Force reload with latest initialData containing Day 2/3 final destinations
      await tx.table('schedules').clear();
      const schedulesWithStatus = initialData.map(item => ({
        ...item,
        status: item.status || 'NotStarted'
      }));
      await tx.table('schedules').bulkAdd(schedulesWithStatus);
    });

    db.version(12).stores({
      schedules: 'id, date, order, status',
      appCache: 'key, timestamp'
    }).upgrade(async (tx: Transaction) => {
      // Force reload with latest initialData containing Hotel Mi Rochor and updated dates (9/8 - 9/10)
      await tx.table('schedules').clear();
      const schedulesWithStatus = initialData.map(item => ({
        ...item,
        status: item.status || 'NotStarted'
      }));
      await tx.table('schedules').bulkAdd(schedulesWithStatus);
    });

    db.version(13).stores({
      schedules: 'id, date, order, status',
      appCache: 'key, timestamp'
    }).upgrade(async (tx: Transaction) => {
      // Force reload with latest data for version 13 to guarantee latest updates
      await tx.table('schedules').clear();
      const schedulesWithStatus = initialData.map(item => ({
        ...item,
        status: item.status || 'NotStarted'
      }));
      await tx.table('schedules').bulkAdd(schedulesWithStatus);
    });

    db.version(14).stores({
      schedules: 'id, date, order, status',
      appCache: 'key, timestamp'
    }).upgrade(async (tx: Transaction) => {
      // Force reload with latest data for version 14 to guarantee latest updates
      await tx.table('schedules').clear();
      const schedulesWithStatus = initialData.map(item => ({
        ...item,
        status: item.status || 'NotStarted'
      }));
      await tx.table('schedules').bulkAdd(schedulesWithStatus);
    });

    db.version(15).stores({
      schedules: 'id, date, order, status',
      appCache: 'key, timestamp'
    }).upgrade(async (tx: Transaction) => {
      // Safe upgrade: merge new default data and preserve any user modifications or custom schedules
      const existing = await tx.table('schedules').toArray();
      const existingMap = new Map(existing.map(item => [item.id, item]));

      const updatedSchedules = initialData.map(item => {
        const exist = existingMap.get(item.id);
        if (exist) {
          return {
            ...item,
            status: exist.status || item.status || 'NotStarted',
            highlights: exist.highlights || item.highlights || [],
            warnings: exist.warnings || item.warnings || [],
            notes: exist.notes || item.notes || '',
            qrCodeUrl: exist.qrCodeUrl || item.qrCodeUrl || undefined
          };
        }
        return {
          ...item,
          status: item.status || 'NotStarted'
        };
      });

      const defaultIds = new Set(initialData.map(item => item.id));
      const customItems = existing.filter(item => !defaultIds.has(item.id));

      await tx.table('schedules').clear();
      await tx.table('schedules').bulkAdd([...updatedSchedules, ...customItems]);
    });

    db.on('populate', async () => {
      const schedulesWithStatus = initialData.map(item => ({
        ...item,
        status: item.status || 'NotStarted'
      }));
      await db!.schedules.bulkAdd(schedulesWithStatus);
    });
  } catch (err) {
    console.error('Failed to initialize Dexie database (IndexedDB might be blocked in sandboxed/cross-origin iframe):', err);
    db = null;
  }
}

export { db };

