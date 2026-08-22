import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-4 text-center font-sans">
      <h2 className="text-2xl font-bold text-neutral-900 mb-2">ページが見つかりません</h2>
      <p className="text-neutral-500 mb-6">お探しのページは存在しないか、移動した可能性があります。</p>
      <Link
        href="/"
        className="px-6 py-3 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors"
      >
        ホームに戻る
      </Link>
    </div>
  );
}

