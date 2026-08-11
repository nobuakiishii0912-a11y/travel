'use client';

import { CheckSquare, WifiOff, Battery, Map as MapIcon, QrCode, RefreshCcw, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ChecklistModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white text-neutral-900 max-w-sm w-full max-h-[85vh] overflow-y-auto rounded-[32px] p-6 text-left shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 bg-neutral-100 rounded-full p-2 text-neutral-600 hover:bg-neutral-200">
          <X size={20} />
        </button>
        
        <div className="flex items-center gap-2 text-indigo-600 mb-6 mt-2">
          <CheckSquare size={24} />
          <h2 className="font-bold text-lg">本番利用チェックリスト</h2>
        </div>
        
        <p className="text-sm text-neutral-600 mb-6">
          海外旅行で本アプリを安全・快適に利用するために、出発前に以下の項目をご確認ください。
        </p>

        <div className="space-y-4">
           {[
             {
               icon: <MapIcon size={18} />,
               title: "オフライン用地図の保存",
               desc: "マップ画面の左下から「オフライン用地図を保存」をタップし、事前に現地の地図データをダウンロードしておきます。"
             },
             {
               icon: <QrCode size={18} />,
               title: "e-Ticket・QRのスクショ保存",
               desc: "万が一端末が圏外でフリーズした時のため、重要な予約のチケット画面（e-Ticketボタン等）はスクリーンショットも保存しておきます。"
             },
             {
               icon: <Battery size={18} />,
               title: "モバイルバッテリーの持参",
               desc: "GPSや地図アプリを多用するため、スマートフォンのバッテリー消費が早くなります。モバイルバッテリーは必ず持参してください。"
             },
             {
               icon: <WifiOff size={18} />,
               title: "通信が不安定な場合の対処法",
               desc: "地下鉄や一部の建物内では通信が途切れます。アプリがオフライン状態（赤い警告表示）になっても、スケジュールを見ることは可能です。"
             },
             {
               icon: <RefreshCcw size={18} />,
               title: "Wi-Fiスポットでのデータ同期",
               desc: "ホテルやカフェなど、フリーWi-Fiがある場所に着いたらアプリを開いて天気や為替の最新情報をキャッシュしておきます。"
             }
           ].map((item, i) => (
             <label key={i} className="flex gap-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-100 cursor-pointer active:scale-[0.98] transition-transform">
                <div className="mt-0.5">
                  <input type="checkbox" className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-neutral-300 cursor-pointer" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-neutral-900 mb-1">
                    <span className="text-indigo-600">{item.icon}</span>
                    {item.title}
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
             </label>
           ))}
        </div>

        <button 
          onClick={onClose}
          className="w-full py-3 mt-6 bg-neutral-900 text-white font-bold rounded-xl active:scale-95 transition-transform"
        >
          確認して閉じる
        </button>
      </div>
    </div>
  );
}
