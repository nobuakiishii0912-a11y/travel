'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-4 text-center font-sans">
        <h2 className="text-xl font-bold text-neutral-900 mb-2">システムエラーが発生しました</h2>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors"
        >
          再試行
        </button>
      </body>
    </html>
  );
}
