'use client';

import React, { useEffect, useState } from 'react';
import DashboardContent from './DashboardContent';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Client Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#e5e5e5] flex items-center justify-center p-4 font-sans text-neutral-900">
          <div className="max-w-md w-full bg-white p-8 rounded-[32px] shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle size={32} />
            </div>
            <h1 className="text-xl font-bold text-neutral-900 mb-2">読み込みエラー</h1>
            <p className="text-sm text-neutral-500 mb-8">
              画面の表示中に問題が発生しました。通信環境が不安定な場合や、データが破損している可能性があります。
            </p>
            <button
              onClick={() => {
                if ('indexedDB' in window) {
                  try {
                    window.indexedDB.deleteDatabase('SingaporeTravelDB');
                  } catch (e) {
                    console.error(e);
                  }
                }
                if ('caches' in window) {
                  try {
                    caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
                  } catch (e) {
                    console.error(e);
                  }
                }
                window.location.href = window.location.origin + window.location.pathname + '?t=' + Date.now();
              }}
              className="w-full px-6 py-3 bg-neutral-900 text-white font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-neutral-800 transition-colors"
            >
              <RefreshCcw size={16} /> データをリセットして再試行
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function ClientDashboard({ tripDates }: { tripDates: string[] }) {
  return (
    <ErrorBoundary>
      <DashboardContent tripDates={tripDates} id="main" />
    </ErrorBoundary>
  );
}
