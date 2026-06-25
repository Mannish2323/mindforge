import { Search, Flame, Zap, Bell } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          Good morning, Ramaa! 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">Your Japanese journey continues today</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-purple-950/40 border border-purple-800/30 rounded-xl pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        {/* Stats Icons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-purple-950/40 border border-purple-800/30 rounded-xl px-3 py-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold">23</span>
          </div>
          <div className="flex items-center gap-2 bg-purple-950/40 border border-purple-800/30 rounded-xl px-3 py-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-semibold">1.2K</span>
            <span className="text-xs text-gray-400">Gems</span>
          </div>
          <button className="relative bg-purple-950/40 border border-purple-800/30 rounded-xl p-2 hover:bg-purple-900/40 transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
              3
            </span>
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center cursor-pointer">
            <span className="text-white font-semibold">R</span>
          </div>
        </div>
      </div>
    </header>
  );
}
