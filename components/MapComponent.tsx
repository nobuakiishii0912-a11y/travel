'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ScheduleItem } from '../lib/types';
import { useState, useCallback } from 'react';
import { Download, CheckCircle2, Loader2 } from 'lucide-react';

interface MapViewProps {
  schedules: ScheduleItem[];
}

// Convert coordinates to OSM tile numbers
function lon2tile(lon: number, zoom: number) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }
function lat2tile(lat: number, zoom: number) { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); }

export default function MapComponent({ schedules }: MapViewProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloaded, setDownloaded] = useState(false);

  const defaultCenter: [number, number] = schedules.length > 0 
    ? [schedules[0].lat, schedules[0].lng] 
    : [1.2834, 103.8607]; // MBS default
    
  const activeItem = schedules.find(s => s.status !== 'Completed');

  const preCacheTiles = useCallback(async () => {
    if (!('caches' in window)) return;
    
    setDownloading(true);
    setDownloadProgress(0);
    setDownloaded(false);

    try {
      const cache = await caches.open('map-tiles');
      const zoomLevels = [12, 13, 14, 15, 16];
      const tilesToFetch = new Set<string>();

      schedules.forEach(item => {
        zoomLevels.forEach(z => {
          // Precache a small grid around each point (3x3 tiles at each zoom)
          const centerTileX = lon2tile(item.lng, z);
          const centerTileY = lat2tile(item.lat, z);
          
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
               const x = centerTileX + dx;
               const y = centerTileY + dy;
               // Cycle through subdomains a, b, c pseudo-randomly based on x and y
               const s = String.fromCharCode(97 + ((x + y) % 3));
               tilesToFetch.add(`https://${s}.tile.openstreetmap.org/${z}/${x}/${y}.png`);
            }
          }
        });
      });

      const tileArray = Array.from(tilesToFetch);
      let loaded = 0;
      
      // Fetch in small chunks to avoid blocking
      for (const url of tileArray) {
         try {
           const cachedObj = await cache.match(url);
           if (!cachedObj) {
               await cache.add(url);
           }
         } catch { console.warn("Failed to cache tile", url); }
         loaded++;
         setDownloadProgress(Math.floor((loaded / tileArray.length) * 100));
      }
      
      setDownloaded(true);
    } catch (e) {
      console.error("Map cache error:", e);
    } finally {
      setDownloading(false);
    }
  }, [schedules]);

  // create custom icons using divIcon to avoid default static asset loading issues
  const createIcon = (item: ScheduleItem, index: number, isActive: boolean, isCompleted: boolean) => {
    let bgColor = 'bg-blue-500';
    if (isCompleted) {
       bgColor = 'bg-neutral-400 opacity-60';
    } else if (isActive) {
       bgColor = 'bg-red-600 animate-bounce';
    } else if (item.category === 'Food') {
       bgColor = 'bg-amber-500';
    }

    const html = `<div class="w-7 h-7 rounded-full border-[3px] border-white shadow-md ${bgColor} flex items-center justify-center text-[11px] font-bold text-white">${index + 1}</div>`;

    return L.divIcon({
      html,
      className: 'custom-leaflet-icon',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14]
    });
  };

  const coordCounts: Record<string, number> = {};
  
  const mapMarkers = schedules.map(item => {
    const key = `${item.lat},${item.lng}`;
    const count = coordCounts[key] || 0;
    coordCounts[key] = count + 1;
    
    let displayLat = item.lat;
    let displayLng = item.lng;
    
    if (count > 0) {
      // Offset by roughly 10 meters per duplicate (0.0001 degrees)
      const angle = (count * Math.PI * 2) / 6;
      const radius = 0.00015 + (Math.floor(count/6) * 0.0001);
      displayLat += radius * Math.cos(angle);
      displayLng += radius * Math.sin(angle);
    }
    
    return {
      ...item,
      displayLat,
      displayLng
    };
  });

  const polylinePositions: [number, number][] = mapMarkers.map(s => [s.displayLat, s.displayLng]);

  return (
    <div className="relative w-full h-full">
      <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }} zoomControl={false} attributionControl={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {polylinePositions.length > 1 && (
          <Polyline positions={polylinePositions} pathOptions={{ color: '#3B82F6', weight: 4, opacity: 0.6 }} />
        )}
        {mapMarkers.map((item, index) => {
          const isActive = activeItem?.id === item.id;
          const isCompleted = item.status === 'Completed';
          
          return (
            <Marker 
              key={item.id} 
              position={[item.displayLat, item.displayLng]} 
              icon={createIcon(item, index, isActive, isCompleted)}
            >
              <Popup className="custom-popup">
                <div className="font-bold text-sm mb-1 break-words">{item.title}</div>
                <div className="text-xs text-neutral-500 mb-2">{item.startTime} - {item.category}</div>
                <a href={item.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors inline-block pb-1">
                  Google Mapsで開く →
                </a>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      <div className="absolute bottom-4 left-4 z-[400]">
         {!downloaded ? (
           <button 
             onClick={preCacheTiles}
             disabled={downloading}
             className="bg-white/90 backdrop-blur text-neutral-800 text-[10px] font-bold px-3 py-2 rounded-xl shadow-lg border border-neutral-200 flex items-center gap-1.5 active:scale-95 transition-transform"
           >
             {downloading ? (
                <><Loader2 size={12} className="animate-spin" /> {downloadProgress}% 完了</>
             ) : (
                <><Download size={12} /> オフライン用地図を保存</>
             )}
           </button>
         ) : (
           <div className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-2 rounded-xl shadow-lg border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 size={12} /> オフライン対応済み
           </div>
         )}
      </div>
    </div>
  );
}
