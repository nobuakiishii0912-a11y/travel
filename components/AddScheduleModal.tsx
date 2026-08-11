'use client';

import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, MapPin, Tag } from 'lucide-react';
import { Category, ScheduleItem } from '../lib/types';
import { useStore } from '../store/useStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onSuccess: () => void;
}

export function AddScheduleModal({ isOpen, onClose, selectedDate, onSuccess }: Props) {
  const { addSchedule } = useStore();
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [locationName, setLocationName] = useState('');
  const [category, setCategory] = useState<Category>('Sightseeing');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !startTime || !endTime) {
      alert('タイトル、開始時間、終了時間は必須です');
      return;
    }

    // Default coordinates (Singapore)
    const newSchedule: ScheduleItem = {
      id: typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      date: selectedDate,
      title,
      startTime,
      endTime,
      locationName: locationName || title,
      lat: 1.3521, // Singapore default
      lng: 103.8198,
      category,
      priority: 'Medium',
      order: 999, // Placed at the bottom initially
      status: 'NotStarted'
    };

    try {
      await addSchedule(newSchedule);
      onSuccess();
      setTitle('');
      setStartTime('');
      setEndTime('');
      setLocationName('');
      setCategory('Sightseeing');
      onClose();
    } catch (error) {
      console.error('Failed to add schedule', error);
      alert('追加に失敗しました。');
    }
  };

  const categories: { value: Category, label: string }[] = [
    { value: 'Sightseeing', label: '観光' },
    { value: 'Food', label: '食事' },
    { value: 'Hotel', label: 'ホテル' },
    { value: 'Transport', label: '移動' },
    { value: 'Flight', label: 'フライト' },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white text-neutral-900 max-w-sm w-full max-h-[85vh] overflow-y-auto rounded-[32px] p-6 text-left shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 bg-neutral-100 rounded-full p-2 text-neutral-600 hover:bg-neutral-200 focus:outline-none">
          <X size={20} />
        </button>
        
        <div className="flex items-center gap-2 text-blue-600 mb-6 mt-2">
          <CalendarIcon size={24} />
          <h2 className="font-bold text-lg">予定を追加</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1">タイトル <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例: マリーナベイ・サンズ"
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-neutral-600 mb-1 flex items-center gap-1"><Clock size={12}/> 開始 <span className="text-red-500">*</span></label>
              <input 
                type="time" 
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-neutral-600 mb-1 flex items-center gap-1"><Clock size={12}/> 終了 <span className="text-red-500">*</span></label>
              <input 
                type="time" 
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1 flex items-center gap-1"><MapPin size={12}/> 場所 (任意)</label>
            <input 
              type="text" 
              value={locationName}
              onChange={e => setLocationName(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例: Marina Bay Sands"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1 flex items-center gap-1"><Tag size={12}/> カテゴリー</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              {categories.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit"
            className="w-full py-3 mt-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-transform"
          >
            スケジュールに追加
          </button>
        </form>
      </div>
    </div>
  );
}
