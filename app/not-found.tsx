import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d0d18] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-[120px] leading-none font-black text-purple-500/10 font-jp select-none">404</div>
        <h1 className="text-2xl font-bold text-white -mt-4 mb-2">Page not found</h1>
        <p className="text-purple-300/50 mb-6 text-sm">このページは見つかりませんでした。</p>
        <Link
          href="/home"
          className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
