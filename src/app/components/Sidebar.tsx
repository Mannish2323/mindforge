import { Home, Map, BookOpen, Award, Headphones, BookOpenCheck, Pencil, Sparkles, Users, BarChart3, Bookmark, TrendingUp, Settings } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: Map, label: 'JLPT Roadmap' },
  { icon: BookOpen, label: 'Vocabulary' },
  { icon: Award, label: 'Kanji' },
  { icon: BookOpenCheck, label: 'Grammar' },
  { icon: Headphones, label: 'Speaking' },
  { icon: Headphones, label: 'Listening' },
  { icon: BookOpen, label: 'Reading' },
  { icon: Pencil, label: 'Writing' },
  { icon: Sparkles, label: 'AI Tutor' },
  { icon: Users, label: 'Community' },
  { icon: BarChart3, label: 'Leaderboard' },
  { icon: Award, label: 'Achievements' },
  { icon: Bookmark, label: 'Bookmarks' },
  { icon: TrendingUp, label: 'Progress' },
  { icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-gradient-to-b from-purple-950/50 to-purple-900/30 border-r border-purple-800/30 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">✦</span>
          </div>
          <span className="text-xl font-bold">Velmorth</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item, index) => (
            <li key={index}>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  item.active
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                    : 'text-gray-300 hover:bg-purple-900/30 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-purple-800/30">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-900/30 cursor-pointer transition-all">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">R</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">Ramaa</div>
            <div className="text-xs text-gray-400">Level 24</div>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-400 px-2">8,450 XP</div>
      </div>
    </aside>
  );
}
