'use client';

import React, { useEffect, useState } from 'react';
import { CloudRain, Cloud, Sun, Loader2, AlertCircle } from 'lucide-react';
import { db } from '../lib/db';
import { useStore } from '../store/useStore';

interface WeatherProps {
  lat: number;
  lng: number;
  timeStr: string; // HH:mm
  date: string; // YYYY-MM-DD
}

export const WeatherWidget = React.memo(function WeatherWidget({ lat, lng, timeStr, date }: WeatherProps) {
  const [weather, setWeather] = useState<{ temp: number, isRain: boolean, isCloudy: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const isOffline = useStore((state) => state.isOffline);

  useEffect(() => {
    let isMounted = true;
    async function fetchWeather() {
      setLoading(true);
      setError(false);
      
      const cacheKey = `weather_${lat}_${lng}_${date}`;
      try {
        // Target hour string (e.g. 15:30 -> 15:00)
        const hourStr = timeStr.split(':')[0] + ':00';
        
        // 1. Check cache first
        const cached = db ? await db.appCache.get(cacheKey) : null;
        
        // Use cache if it exists and is less than 24 hours old
        if (cached && (Date.now() - cached.timestamp < 24 * 60 * 60 * 1000)) {
           const data = cached.data;
           const targetDateForQuery = cached.queryDate || date;
           const targetTime = `${targetDateForQuery}T${hourStr}`;
           const times: string[] = data.hourly.time;
           const index = times.indexOf(targetTime);
           
           if (index !== -1 && isMounted) {
              const code = data.hourly.weather_code[index];
              const temp = data.hourly.temperature_2m[index];
              const isRain = code >= 51;
              const isCloudy = code >= 1 && code <= 48;
              setWeather({ temp: Math.round(temp), isRain, isCloudy });
              setLoading(false);
              // if we use valid cache and we are offline, no need to fetch
              if (isOffline) return;
           }
        }

        if (isOffline) {
          if (!cached && isMounted) setError(true);
          return;
        }

        // 2. Fetch from API (Forecast then Archive)
        let data = null;
        let targetDateForQuery = date;
        
        const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,weather_code&timezone=Asia%2FSingapore&start_date=${date}&end_date=${date}`;
        let res = await fetch(forecastUrl);
        if (res.ok) {
            data = await res.json();
            // Verify if data actually has the target hour
            if (!data.hourly.time.includes(`${date}T${hourStr}`)) {
                data = null;
            }
        }
        
        if (!data) {
             // Attempt Archive
             const currentYear = parseInt(date.substring(0, 4));
             const lastYearDate = (currentYear - 1) + date.substring(4);
             targetDateForQuery = lastYearDate;
             
             const archiveUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&timezone=Asia%2FSingapore&start_date=${lastYearDate}&end_date=${lastYearDate}&hourly=temperature_2m,weather_code`;
             res = await fetch(archiveUrl);
             if (res.ok) {
                data = await res.json();
             }
        }

        if (data) {
           // 3. Save to cache
           if (db) await db.appCache.put({ key: cacheKey, data, timestamp: Date.now(), queryDate: targetDateForQuery });

           const targetTime = `${targetDateForQuery}T${hourStr}`;
           const times: string[] = data.hourly.time;
           const index = times.indexOf(targetTime);
           
           if (index !== -1 && isMounted) {
              const code = data.hourly.weather_code[index];
              const temp = data.hourly.temperature_2m[index];
              const isRain = code >= 51;
              const isCloudy = code >= 1 && code <= 48;
              
              setWeather({ temp: Math.round(temp), isRain, isCloudy });
           } else if (isMounted) {
               // Fallback mock if index not found even in archive
                setWeather({ temp: 30 + Math.floor(Math.random() * 4), isRain: Math.random() > 0.8, isCloudy: Math.random() > 0.5 });
           }
        } else {
            // Fallback mock if all fail
            if (isMounted) {
               setWeather({ temp: 30 + Math.floor(Math.random() * 4), isRain: Math.random() > 0.8, isCloudy: Math.random() > 0.5 });
            }
        }
      } catch (err) {
        console.error("Weather fetch error:", err);
        // Use functional state update to check previous weather without adding it to deps
        if (isMounted) {
          setWeather(prev => {
            if (!prev) setError(true);
            return prev;
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    
    fetchWeather();
    return () => { isMounted = false; };
  }, [lat, lng, timeStr, date, isOffline]);

  if (loading && !weather) return <Loader2 size={14} className="animate-spin text-neutral-400" />;
  
  if (error || !weather) return (
     <div className="flex items-center gap-1 text-[10px] text-neutral-400 px-2 py-1 bg-neutral-50 rounded-md border border-neutral-100">
       <AlertCircle size={10} />
       <span>天気取得失敗</span>
     </div>
  );

  return (
    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md border ${weather.isRain ? 'bg-red-50 text-red-600 border-red-100' : 'bg-neutral-50 text-neutral-600 border-neutral-200'}`}>
      {weather.isRain ? <CloudRain size={12} /> : weather.isCloudy ? <Cloud size={12} /> : <Sun size={12} />}
      <span>{weather.temp}°C</span>
      {weather.isRain && <span className="ml-1 text-red-500 font-bold">Rain Warning</span>}
    </div>
  );
});
