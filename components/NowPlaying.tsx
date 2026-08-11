'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { parse, format, differenceInMinutes, subMinutes, addMinutes } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { Clock, AlertTriangle, Navigation, Footprints, Train, Car, Plane, Bus } from 'lucide-react';
import { ScheduleItem } from '../lib/types';
import { useStore } from '../store/useStore';

export function NowPlaying() {
  const [now, setNow] = useState(new Date());
  const { selectedDate, schedules: allSchedules, bulkUpdateSchedules } = useStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  // Current time in Singapore
  const sgTimeZone = 'Asia/Singapore';
  const currentTime = toZonedTime(now, sgTimeZone);
  const timeString = format(currentTime, 'HH:mm');

  // Filter schedules by selected date
  const schedules = useMemo(() => {
    return allSchedules.filter(item => item.date === selectedDate);
  }, [allSchedules, selectedDate]);
  
  const [showOfflineRoute, setShowOfflineRoute] = useState(false);


  if (!schedules || schedules.length === 0) {
    return null;
  }

  // Find active target (first not completed)
  let initialTargetIndex = schedules.findIndex((s: ScheduleItem) => s.status !== 'Completed');
  let targetIndex = initialTargetIndex;
  let skippedCount = 0;

  if (targetIndex !== -1) {
    while (targetIndex < schedules.length - 1) {
      const tEnd = parse(`${selectedDate} ${schedules[targetIndex].endTime}`, 'yyyy-MM-dd HH:mm', new Date());
      // 終了時刻から30分以上経過していたら「完了押し忘れ」とみなして次をNowPlayingの対象とする
      if (differenceInMinutes(currentTime, tEnd) > 30) {
        targetIndex++;
        skippedCount++;
      } else {
        break;
      }
    }
  }

  if (targetIndex === -1) {
    return (
      <div className="bg-emerald-50 text-emerald-800 p-5 rounded-3xl mb-4 shadow-sm border border-emerald-200">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <CheckCircle2Icon /> すべての予定が完了しました！
        </h2>
        <p className="text-sm mt-1 opacity-80">お疲れ様でした。ゆっくりお休みください。</p>
      </div>
    );
  }

  const activeItem = schedules[targetIndex];
  const activeStart = parse(`${selectedDate} ${activeItem.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
  const activeEnd = parse(`${selectedDate} ${activeItem.endTime}`, 'yyyy-MM-dd HH:mm', new Date());
  
  const transportTime = activeItem.transport?.durationMin || 0;
  const departureTime = subMinutes(activeStart, transportTime);
  
  const minsToStart = differenceInMinutes(activeStart, currentTime);
  const minsToDepart = differenceInMinutes(departureTime, currentTime);
  const delayMins = differenceInMinutes(currentTime, activeEnd);
  
  // 現在の遅延時間 (目標出発時間と現在時刻の差。未来なら遅延なし)
  const currentDelay = differenceInMinutes(currentTime, departureTime);
  const isDelayed = currentDelay > 0 && minsToStart > 0; // まだ開始してないのに出発時刻を過ぎている

  let stateTitle = "";
  let stateMessage = "";
  let isWarning = false;
  let isMoving = false;
  let showDepartureAlert = false;

  if (delayMins > 0) {
      stateTitle = "予定より遅れています";
      stateMessage = `「${activeItem.title}」の終了時刻を過ぎています。`;
      isWarning = true;
  } else if (minsToDepart > 0) {
      if (minsToDepart <= 30) {
          showDepartureAlert = true;
      }
      stateTitle = "自由時間・滞在中";
      if (targetIndex > 0) {
          stateMessage = `まもなく出発時間です。次は「${activeItem.title}」です。`;
      } else {
          stateMessage = `まもなく出発です。`;
      }
  } else if (minsToDepart <= 0 && minsToStart > 0) {
      stateTitle = "移動開始";
      stateMessage = `「${activeItem.title}」へ移動する時間です！`;
      isMoving = true;
  } else {
      // currentTime >= activeStart && currentTime <= activeEnd
      stateTitle = `「${activeItem.title}」に滞在中`;
      stateMessage = `終了まであと ${differenceInMinutes(activeEnd, currentTime)}分`;
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!navigator.onLine) {
       e.preventDefault();
       setShowOfflineRoute(true);
    }
  };

  const getTransportIcon = (type: string) => {
    switch (type) {
      case '徒歩': return <Footprints size={18} />;
      case 'MRT': return <Train size={18} />;
      case 'タクシー': return <Car size={18} />;
      case 'バス': return <Bus size={18} />;
      case '飛行機': return <Plane size={18} />;
      default: return <Navigation size={18} />;
    }
  };

  return (
    <div className={`relative p-5 rounded-3xl mb-4 shadow-xl border overflow-hidden transition-colors ${
       isWarning ? 'bg-red-50/90 border-red-200 text-red-900' : 
       isMoving ? 'bg-blue-600 border-blue-700 text-white' : 
       'bg-neutral-900 border-neutral-800 text-white'
    }`}>
      {/* Decorative gradient */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 blur-3xl rounded-full pointer-events-none" />

      {/* Skipped Notice */}
      {skippedCount > 0 && (
         <div className="bg-neutral-800/80 text-neutral-300 text-[10px] font-bold px-3 py-1.5 rounded-lg mb-3 inline-block">
            ※ 前の予定が未完了ですが大幅に時間が過ぎたためスキップ表示しています
         </div>
      )}

      {/* Header Info */}
      <div className="flex justify-between items-start relative z-10 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
             {isWarning && <AlertTriangle size={16} className="text-red-600 animate-pulse" />}
             {!isWarning && !isMoving && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
             <p className={`text-xs font-bold tracking-wider uppercase ${isWarning ? 'text-red-700' : isMoving ? 'text-blue-200' : 'text-neutral-400'}`}>
                {stateTitle}
             </p>
          </div>
          <h2 className="text-xl font-bold leading-tight">{stateMessage}</h2>
        </div>
        <div className="text-right shrink-0">
           <p className={`text-[10px] font-bold uppercase tracking-wider ${isWarning ? 'text-red-500' : isMoving ? 'text-blue-200' : 'text-neutral-500'}`}>Now</p>
           <p className="text-2xl font-mono font-medium tracking-tight mt-px">{timeString}</p>
        </div>
      </div>

      {showDepartureAlert && (
         <div className="bg-amber-100/90 border border-amber-200 text-amber-900 px-3 py-2 rounded-xl mb-4 flex items-center gap-2 text-sm font-bold shadow-sm backdrop-blur-sm relative z-10">
            <AlertTriangle size={16} className="text-amber-600" />
            <div>
              あと{minsToDepart}分で出発時間です！
              <div className="text-[10px] font-medium text-amber-700/80 mt-0.5">移動手段: {activeItem.transport?.type} ({activeItem.transport?.durationMin}分)</div>
            </div>
         </div>
      )}

      {/* Next Action Box */}
      <div className={`p-4 rounded-2xl relative z-10 ${
         isWarning ? 'bg-white/50 border border-white/50 text-red-900' : 
         isMoving ? 'bg-white/10 border border-white/20' : 
         'bg-white/5 border border-white/10'
      }`}>
         <div className="flex items-center gap-2 mb-2 opacity-80">
            <p className="text-xs font-bold tracking-wider uppercase">次のアクション</p>
         </div>
         
         <div className="flex items-start justify-between gap-4">
           <h3 className="font-bold text-lg leading-tight break-words flex-1">{activeItem.title}</h3>
           {isDelayed && (
             <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shrink-0 flex flex-col items-end gap-1">
               <span>遅延 +{currentDelay}分</span>
               <button 
                 onClick={async () => {
                   if(confirm(`以降のすべての予定を${currentDelay}分後ろにずらしますか？`)) {
                     const updates = [];
                     for(let i = targetIndex; i < schedules.length; i++) {
                       const s = schedules[i];
                       const newStart = format(addMinutes(parse(`${selectedDate} ${s.startTime}`, 'yyyy-MM-dd HH:mm', new Date()), currentDelay), 'HH:mm');
                       const newEnd = format(addMinutes(parse(`${selectedDate} ${s.endTime}`, 'yyyy-MM-dd HH:mm', new Date()), currentDelay), 'HH:mm');
                       updates.push({ ...s, startTime: newStart, endTime: newEnd });
                     }
                     try { await bulkUpdateSchedules(updates); } catch (err) { console.error("Reschedule failed:", err); }
                   }
                 }}
                 className="bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded transition-colors active:scale-95"
               >
                 以降をリスケ
               </button>
             </div>
           )}
           {!isDelayed && currentDelay > 0 && minsToStart <= 0 && currentDelay <= (activeItem.transport?.durationMin || 0) && (
             <div className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md shrink-0">
               計画より進行遅れ +{currentDelay}分
             </div>
           )}
         </div>
         
         <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
            <div className={`flex items-center gap-1.5 text-sm font-medium ${isWarning ? 'text-red-700' : isMoving ? 'text-blue-100' : 'text-neutral-300'}`}>
               <Clock size={16} opacity={0.7} />
               {activeItem.startTime} ({minsToStart > 0 ? `あと${minsToStart}分` : '開始時刻経過'})
            </div>
            
            {activeItem.transport && activeItem.transport.type !== 'なし' && (
               <div className={`flex items-center gap-1.5 text-sm font-medium ${isWarning ? 'text-red-700' : isMoving ? 'text-white' : 'text-blue-300'}`}>
                 {getTransportIcon(activeItem.transport.type)}
                 {activeItem.transport.type} {activeItem.transport.durationMin}分
               </div>
            )}
         </div>

         {/* Target Action Button Inside Navigator */}
         <div className="mt-4 pt-3 border-t border-current/10">
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${activeItem.lat},${activeItem.lng}${activeItem.placeId ? `&destination_place_id=${activeItem.placeId}` : ''}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleNavClick}
              className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold transition-transform active:scale-95 ${
                 isWarning ? 'bg-red-600 text-white hover:bg-red-700' : 
                 isMoving ? 'bg-white text-blue-700 hover:bg-blue-50' : 
                 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <Navigation size={18} />
              ここへナビ開始
            </a>
         </div>

         {/* Offline Modal */}
         {showOfflineRoute && (
           <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowOfflineRoute(false)}>
             <div className="bg-white text-neutral-900 max-w-sm w-full rounded-[32px] p-6 text-left shadow-2xl relative" onClick={e => e.stopPropagation()}>
               <div className="flex items-center gap-2 text-red-600 mb-4">
                  <AlertTriangle size={24} />
                  <h3 className="font-bold text-lg">オフライン状態です</h3>
               </div>
               <p className="text-sm text-neutral-600 mb-4">
                 現在インターネットに接続されていないため、マップアプリが正常に起動しない・経路検索できない可能性があります。<br/>
                 以下の情報をもとに移動してください。
               </p>
               <div className="bg-neutral-100 p-4 rounded-2xl mb-6">
                 <p className="text-xs font-bold text-neutral-500 mb-1">目的地</p>
                 <p className="font-bold text-lg mb-2">{activeItem.locationName || activeItem.title}</p>
                 {activeItem.address && (
                    <>
                      <p className="text-xs font-bold text-neutral-500 mb-1 mt-3">住所</p>
                      <p className="text-sm font-medium">{activeItem.address}</p>
                    </>
                 )}
                 {activeItem.transport && (
                   <>
                     <p className="text-xs font-bold text-neutral-500 mb-1 mt-3">移動手段</p>
                     <p className="text-sm font-medium">{activeItem.transport.type} (約{activeItem.transport.durationMin}分)</p>
                   </>
                 )}
               </div>
               <button 
                 onClick={() => setShowOfflineRoute(false)}
                 className="w-full py-3 bg-neutral-900 text-white font-bold rounded-xl active:scale-95 transition-transform"
               >
                 閉じる
               </button>
             </div>
           </div>
         )}
      </div>
    </div>
  );
}

function CheckCircle2Icon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>; }
