'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { DollarSign, AlertCircle } from 'lucide-react';
import { db } from '../lib/db';

export const CurrencyWidget = React.memo(function CurrencyWidget() {
  const { sgdRate, setSgdRate, isOffline } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  
  // Minimal manual entry
  const [amountSgd, setAmountSgd] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    async function fetchRate() {
      if (sgdRate) return; // If already set, skip
      setLoading(true);
      setError(false);
      
      const cacheKey = 'currency_sgd_jpy';
      
      try {
        const cached = db ? await db.appCache.get(cacheKey) : null;
        
        // 24 hours cache TTL
        if (cached && (Date.now() - cached.timestamp < 24 * 60 * 60 * 1000)) {
           if (isMounted) {
             setSgdRate(cached.data);
             setLoading(false);
           }
           if (isOffline) return;
        }
        
        if (isOffline) {
          if (!cached && isMounted) setError(true);
          return;
        }

        const res = await fetch('https://api.exchangerate-api.com/v4/latest/SGD').catch(() => null);
        if (!res || !res.ok) throw new Error('Network error');
        const data = await res.json().catch(() => null);
        if (!data || !data.rates || typeof data.rates.JPY !== 'number') {
          throw new Error('Invalid rate data format');
        }
        const rate = data.rates.JPY;
        
        if (db) {
          await db.appCache.put({ key: cacheKey, data: rate, timestamp: Date.now() });
        }
        
        if (isMounted) setSgdRate(rate);
      } catch (e) {
        console.error("Currency fetch error:", e);
        if (isMounted && !sgdRate) {
           setError(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchRate();
    
    return () => { isMounted = false; };
  }, [sgdRate, setSgdRate, isOffline]);

  const sgdNum = parseFloat(amountSgd) || 1;
  const jpyEquivalent = sgdRate ? (sgdNum * sgdRate).toFixed(0) : '---';

  return (
    <div className="bg-white p-4 rounded-3xl shadow-sm border border-neutral-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
          <DollarSign size={20} />
        </div>
        <div>
          <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">SGD to JPY</p>
          {loading && !sgdRate ? (
            <p className="text-sm font-semibold">Loading...</p>
          ) : error || !sgdRate ? (
            <div className="flex items-center gap-1 text-sm font-semibold text-red-500">
              <AlertCircle size={14} /> Failed
            </div>
          ) : (
            <p className="text-lg font-bold">1 SGD = {sgdRate?.toFixed(2)} JPY</p>
          )}
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-1 bg-neutral-100 rounded-full px-3 py-1">
          <span className="text-xs font-semibold text-neutral-500">S$</span>
          <input 
            type="number"
            className="w-12 bg-transparent text-sm font-bold focus:outline-none text-right"
            value={amountSgd}
            onChange={(e) => setAmountSgd(e.target.value)}
            placeholder="1"
          />
        </div>
        <p className="text-xs font-semibold text-neutral-500 mt-1">≈ ¥{jpyEquivalent}</p>
      </div>
    </div>
  );
});
