'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { ScheduleItem } from '../lib/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Clock, MapPin, QrCode, Train, Car, Bus, Plane, Footprints, ChevronDown, ChevronUp, Sparkles, AlertTriangle, ArrowDown, Map as MapIcon, Navigation, CheckCircle2, Circle, Copy, Edit2, Save, X, ExternalLink } from 'lucide-react';
import { WeatherWidget } from './WeatherWidget';
import { useStore } from '../store/useStore';

interface ScheduleCardProps {
  item: ScheduleItem;
}

export const ScheduleCard = React.memo(function ScheduleCard({ item }: ScheduleCardProps) {
  const { updateSchedule } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeModal, setActiveModal] = useState<'qr' | 'offline' | 'taxi' | null>(null);

  const [isEditingHighlights, setIsEditingHighlights] = useState(false);
  const [highlightsText, setHighlightsText] = useState((item.highlights || []).join('\n'));

  const [isEditingWarnings, setIsEditingWarnings] = useState(false);
  const [warningsText, setWarningsText] = useState((item.warnings || []).join('\n'));

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const isCompleted = item.status === 'Completed';

  const toggleComplete = async () => {
    try {
      const newStatus = isCompleted ? 'NotStarted' : 'Completed';
      await updateSchedule(item.id, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const getCategoryColor = (cat: string) => {
    if (isCompleted) return 'bg-neutral-100 text-neutral-500 border-neutral-200';
    switch (cat) {
      case 'Food': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Flight': return 'bg-sky-100 text-sky-700 border-sky-200';
      case 'Hotel': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Sightseeing': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const getTransportIcon = (type: string) => {
    if (type.includes('地下鉄') || type.includes('MRT') || type.includes('電車')) return <Train size={14} className={isCompleted ? "text-neutral-400" : "text-blue-500"} />;
    if (type.includes('バス') || type.includes('シャトルバス')) return <Bus size={14} className={isCompleted ? "text-neutral-400" : "text-blue-500"} />;
    if (type.includes('タクシー') || type.includes('車')) return <Car size={14} className={isCompleted ? "text-neutral-400" : "text-blue-500"} />;
    if (type.includes('徒歩')) return <Footprints size={14} className={isCompleted ? "text-neutral-400" : "text-blue-500"} />;
    if (type.includes('飛行機')) return <Plane size={14} className={isCompleted ? "text-neutral-400" : "text-blue-500"} />;
    return <ArrowDown size={14} className={isCompleted ? "text-neutral-400" : "text-blue-500"} />;
  };

  const hasDetails = true;

  return (
    <div 
      id={`card-${item.id}`}
      ref={setNodeRef} 
      style={style} 
      className={`relative flex flex-col ${isDragging ? 'opacity-50' : ''} ${isCompleted ? 'opacity-60 grayscale-[0.5]' : ''}`}
    >
      <div className="absolute left-[30px] top-0 bottom-[-16px] w-[2px] bg-neutral-200" />
      
      <div className="flex w-full">
        <div className="w-[60px] shrink-0 flex justify-center pt-4 relative">
           <div 
             {...attributes} 
             {...listeners}
             className="bg-white p-1.5 border border-neutral-200 shadow-sm rounded-lg z-10 cursor-grab active:cursor-grabbing hover:text-blue-600 hover:border-blue-300 text-neutral-400 h-fit transition-colors touch-none"
           >
             <GripVertical size={16} />
           </div>
        </div>

        <div className="flex-1 bg-white border border-neutral-200/60 rounded-3xl p-4 sm:p-5 mb-0 shadow-sm z-10 pointer-events-auto hover:shadow-md transition-shadow min-w-0">
          <div className="flex justify-between items-start mb-3 gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                <span className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${getCategoryColor(item.category)}`}>
                  {item.category}
                </span>
                {item.priority === 'High' && (
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">★ High</span>
                )}
                {item.stayDurationMin !== undefined && (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-neutral-500 px-1">
                    <Clock size={10} /> 滞在 {item.stayDurationMin > 0 ? `${item.stayDurationMin}分` : '-'}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-[15px] sm:text-base text-neutral-900 leading-tight break-words">{item.title}</h3>
            </div>
            <div className="text-right shrink-0 flex flex-col items-end">
              <div className="bg-neutral-100 px-2.5 py-1 rounded-lg flex flex-col items-center justify-center min-w-[52px]">
                <div className="text-sm sm:text-base font-bold font-mono tracking-tight text-neutral-900 leading-none">{item.startTime}</div>
                {item.endTime && item.endTime !== item.startTime && (
                  <div className="text-[10px] font-mono text-neutral-500 leading-none mt-1">{item.endTime}</div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 mb-3 bg-neutral-50 p-2 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-neutral-600 min-w-0 w-full">
              <MapPin size={14} className="text-neutral-400 shrink-0" />
              <a 
                href={item.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}${item.placeId ? `&query_place_id=${item.placeId}` : ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 hover:underline truncate transition-colors font-bold flex-1 min-w-0"
              >
                {item.locationName}
              </a>
              {item.qrCodeUrl && (
                 <button 
                   onClick={(e) => {
                     e.preventDefault();
                     setActiveModal('qr');
                   }}
                   className="p-1.5 bg-blue-100 text-blue-600 rounded-lg shrink-0 ml-1 hover:bg-blue-200 transition-colors cursor-pointer active:scale-95 shadow-sm"
                   title="eチケットを表示"
                 >
                   <QrCode size={14} />
                 </button>
              )}
            </div>
            {item.address && (
              <div className="text-[10px] text-neutral-400 pl-5 truncate min-w-0 w-full">
                {item.address}
              </div>
            )}
            {item.openingHours && (
              <div className="text-[10px] text-neutral-500 pl-5 flex items-center gap-1">
                <Clock size={10} />
                <span>営業時間: {item.openingHours.open} - {item.openingHours.close}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mb-1">
             <WeatherWidget lat={item.lat} lng={item.lng} timeStr={item.startTime} date={item.date} />
          </div>
          
          {/* Quick Actions Row */}
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-neutral-100">
            <a 
              href={item.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}${item.placeId ? `&query_place_id=${item.placeId}` : ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-2 px-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-bold rounded-xl transition-colors"
            >
              <MapIcon size={14} /> Maps
            </a>
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}${item.placeId ? `&destination_place_id=${item.placeId}` : ''}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!navigator.onLine) {
                  e.preventDefault();
                  setActiveModal('offline');
                }
              }}
              className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-2 px-2 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[11px] font-bold rounded-xl transition-colors"
            >
              <Navigation size={14} /> ナビ
            </a>
            <button
               onClick={(e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 if (item.address) {
                   navigator.clipboard.writeText(item.address);
                   console.log('住所をコピーしました: \n' + item.address);
                 }
               }}
               className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-2 px-2 bg-neutral-100/50 hover:bg-neutral-200 text-neutral-600 text-[11px] font-bold rounded-xl transition-colors"
            >
              <Copy size={14} /> 住所コピー
            </button>
            <button 
              onClick={toggleComplete}
              className={`flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-2 px-2 text-[11px] font-bold rounded-xl transition-colors ${
                isCompleted 
                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-emerald-600'
              }`}
            >
              {isCompleted ? <CheckCircle2 size={14} /> : <Circle size={14} />}
              {isCompleted ? '完了' : '完了にする'}
            </button>
          </div>

          {item.showTaxiCard && (
            <div className="mt-2 text-center">
              <button
                onClick={() => setActiveModal('taxi')}
                className="w-full py-2 bg-neutral-900 text-white font-bold text-[11px] rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-800 transition-transform active:scale-95 shadow-md"
              >
                <Car size={14} /> タクシー用 行き先カードを表示
              </button>
            </div>
          )}

          {hasDetails && (
            <>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-3 w-full py-2 flex items-center justify-center gap-1 text-[11px] sm:text-xs font-bold tracking-wide text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100/50 rounded-xl transition-all border border-transparent hover:border-neutral-200"
              >
                {isExpanded ? (
                  <>詳細を閉じる <ChevronUp size={14} /></>
                ) : (
                  <>詳細を表示 <ChevronDown size={14} /></>
                )}
              </button>

              {isExpanded && (
                <div className="mt-3 space-y-3 pt-3 border-t border-neutral-100">
                  <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-bold text-xs text-emerald-700 flex items-center gap-1.5">
                        <Sparkles size={14} /> 楽しむポイント
                      </h4>
                      {isEditingHighlights ? (
                        <div className="flex items-center gap-1">
                          <button onClick={async () => {
                            try {
                              const newHighlights = highlightsText.split('\n').filter(s => s.trim().length > 0);
                              await updateSchedule(item.id, { highlights: newHighlights });
                            } catch (err) {
                              console.error("Failed to update highlights:", err);
                            }
                            setIsEditingHighlights(false);
                          }} className="p-1 hover:bg-emerald-200 rounded text-emerald-700">
                            <Save size={12} />
                          </button>
                          <button onClick={() => {
                            setIsEditingHighlights(false);
                          }} className="p-1 hover:bg-emerald-200 rounded text-emerald-700">
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => {
                          setHighlightsText((item.highlights || []).join('\n'));
                          setIsEditingHighlights(true);
                        }} className="p-1 hover:bg-emerald-200 rounded text-emerald-600 transition-colors">
                          <Edit2 size={12} />
                        </button>
                      )}
                    </div>
                    {isEditingHighlights ? (
                      <textarea
                        value={highlightsText}
                        onChange={(e) => setHighlightsText(e.target.value)}
                        className="w-full text-xs p-2 rounded bg-white/50 border border-emerald-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[60px]"
                        placeholder="ポイントを入力（改行で区切る）"
                      />
                    ) : item.highlights && item.highlights.length > 0 ? (
                      <ul className="list-disc list-inside text-xs space-y-1 text-emerald-800/80 font-medium">
                        {item.highlights.map((hl, i) => <li key={i}>{hl}</li>)}
                      </ul>
                    ) : (
                       <div className="text-xs text-emerald-600/60 italic">楽しむポイントはまだありません</div>
                    )}
                  </div>

                  <div className="bg-red-50/50 p-3 rounded-xl border border-red-100/50">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-bold text-xs text-red-600 flex items-center gap-1.5">
                        <AlertTriangle size={14} /> 注意事項
                      </h4>
                      {isEditingWarnings ? (
                        <div className="flex items-center gap-1">
                          <button onClick={async () => {
                            try {
                              const newWarnings = warningsText.split('\n').filter(s => s.trim().length > 0);
                              await updateSchedule(item.id, { warnings: newWarnings });
                            } catch (err) {
                              console.error("Failed to update warnings:", err);
                            }
                            setIsEditingWarnings(false);
                          }} className="p-1 hover:bg-red-200 rounded text-red-700">
                            <Save size={12} />
                          </button>
                          <button onClick={() => {
                            setIsEditingWarnings(false);
                          }} className="p-1 hover:bg-red-200 rounded text-red-700">
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => {
                          setWarningsText((item.warnings || []).join('\n'));
                          setIsEditingWarnings(true);
                        }} className="p-1 hover:bg-red-200 rounded text-red-600 transition-colors">
                          <Edit2 size={12} />
                        </button>
                      )}
                    </div>
                    {isEditingWarnings ? (
                      <textarea
                        value={warningsText}
                        onChange={(e) => setWarningsText(e.target.value)}
                        className="w-full text-xs p-2 rounded bg-white/50 border border-red-200 focus:outline-none focus:ring-1 focus:ring-red-500 min-h-[60px]"
                        placeholder="注意事項を入力（改行で区切る）"
                      />
                    ) : item.warnings && item.warnings.length > 0 ? (
                      <ul className="list-disc list-inside text-xs space-y-1 text-red-700/80 font-medium">
                        {item.warnings.map((warn, i) => <li key={i}>{warn}</li>)}
                      </ul>
                    ) : (
                       <div className="text-xs text-red-600/60 italic">注意事項はまだありません</div>
                    )}
                  </div>
                  {item.notes && (
                     <div className="bg-indigo-50/50 p-3.5 rounded-2xl border border-indigo-100/60 shadow-xs">
                       <h4 className="font-bold text-[10px] uppercase tracking-wider text-indigo-500 mb-1.5 flex items-center gap-1">
                         📝 MEMO
                       </h4>
                       <div className="text-xs text-indigo-950 font-medium whitespace-pre-wrap leading-relaxed space-y-1">
                         {item.notes}
                       </div>
                     </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {item.transport && item.transport.type && item.transport.type !== 'なし' && (
        <div className="flex items-center gap-3 pl-10 py-2 sm:py-3 cursor-default">
           <div className="-ml-[42px] bg-white p-1.5 rounded-full border border-neutral-200 z-10 shadow-sm shrink-0">
             {getTransportIcon(item.transport.type)}
           </div>
           <div className="flex flex-col z-10 bg-white/80 backdrop-blur-sm pr-3 py-1 rounded-lg">
             {item.transport.mapUrl ? (
               <a 
                 href={item.transport.mapUrl}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline font-bold text-xs sm:text-sm group cursor-pointer transition-colors"
                 title="Google Mapsでルートを確認"
               >
                 <span>{item.transport.type} {item.transport.durationMin}分</span>
                 <ExternalLink size={12} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
               </a>
             ) : (
               <span className="text-blue-600 font-semibold text-xs sm:text-sm">{item.transport.type} {item.transport.durationMin}分</span>
             )}
             {item.transport.route && <span className="text-neutral-500 text-[10px]">{item.transport.route}</span>}
           </div>
        </div>
      )}

      {activeModal && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setActiveModal(null)}>
          {activeModal === 'qr' && (
             <div className="bg-white max-w-sm w-full rounded-[32px] p-8 text-center shadow-2xl relative" onClick={e => e.stopPropagation()}>
               <button className="absolute top-4 right-4 bg-neutral-200 rounded-full p-2 text-neutral-600" onClick={() => setActiveModal(null)}>✕</button>
               <div className="mb-4 text-emerald-600 flex justify-center"><QrCode size={32} /></div>
               <h2 className="text-xl font-bold text-neutral-900 mb-1">{item.locationName}</h2>
               <p className="text-xs text-neutral-500 font-bold tracking-widest uppercase mb-6">入館用 e-Ticket</p>
               <div className="mx-auto border-4 border-dashed border-emerald-100 p-4 rounded-3xl w-fit mb-6 relative">
                  <Image src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TICKET-123456789" alt="e-Ticket QR" width={160} height={160} referrerPolicy="no-referrer" className="w-40 h-40" />
                  <div className="absolute -left-6 top-1/2 w-4 h-8 bg-white rounded-r-full"></div>
                  <div className="absolute -right-6 top-1/2 w-4 h-8 bg-white rounded-l-full"></div>
               </div>
               <p className="text-sm font-mono text-neutral-600 bg-neutral-100 py-2 rounded-lg">Booking Ref: #9876-5432</p>
             </div>
          )}
          {activeModal === 'offline' && (
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
                 <p className="font-bold text-lg mb-2">{item.locationName || item.title}</p>
                 {item.address && (
                   <>
                     <p className="text-xs font-bold text-neutral-500 mb-1 mt-3">住所</p>
                     <p className="text-sm font-medium">{item.address}</p>
                   </>
                 )}
                 {item.transport && item.transport.type !== 'なし' && (
                   <>
                     <p className="text-xs font-bold text-neutral-500 mb-1 mt-3">移動手段</p>
                     <p className="text-sm font-medium">{item.transport.type} (約{item.transport.durationMin}分)</p>
                   </>
                 )}
               </div>
               <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-neutral-900 text-white font-bold rounded-xl active:scale-95 transition-transform">
                 閉じる
               </button>
             </div>
          )}
          {activeModal === 'taxi' && (
             <div className="bg-white max-w-sm w-full rounded-[32px] p-8 text-center shadow-2xl relative" onClick={e => e.stopPropagation()}>
               <button className="absolute top-4 right-4 bg-neutral-200 rounded-full p-2 text-neutral-600" onClick={() => setActiveModal(null)}>✕</button>
               <p className="text-lg font-bold text-blue-600 mb-2">目的地 / Destination:</p>
               <h2 className="text-5xl font-black text-neutral-950 leading-tight mb-6 break-words">{item.locationName}</h2>
               <div className="text-2xl font-bold text-neutral-700 mb-8 border-t-4 border-b-4 border-neutral-200 py-6">
                 {item.address ? item.address.split(',')[0] : 'Address not available'}
               </div>
               <div className="mx-auto bg-neutral-100 p-2 rounded-2xl w-fit mb-4">
                  <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(item.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`)}`} alt="QR Code to Maps" width={112} height={112} referrerPolicy="no-referrer" className="w-28 h-28" />
               </div>
               <p className="text-lg text-neutral-800 font-bold bg-amber-200 p-4 rounded-2xl">Please show this screen to the driver.</p>
             </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
});
