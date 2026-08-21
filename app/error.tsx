'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-4 text-center font-sans">
      <h2 className="text-xl font-bold text-neutral-900 mb-2">エラーが発生しました</h2>
      <p className="text-sm text-neutral-500 mb-6">画面の読み込み中に問題が発生しました。</p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors"
      >
        再読み込み
      </button>
    </div>
  );
}
