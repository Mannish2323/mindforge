import { Award, BookOpen, Target, Clock } from 'lucide-react';

const stats = [
  {
    icon: Award,
    label: 'JLPT',
    value: '8,450',
    subValue: '10,000',
    subtitle: 'Level 24',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: BookOpen,
    label: 'Lessons Completed',
    value: '142',
    subValue: '280',
    subtitle: 'This month',
    badge: '+23 today',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Target,
    label: 'Words Learned',
    value: '1,863',
    subtitle: 'Vocabulary',
    badge: '+23 today',
    color: 'from-pink-500 to-pink-600',
  },
  {
    icon: Target,
    label: 'Kanji Mastered',
    value: '219',
    subValue: '2,500',
    subtitle: 'N5 + N2',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Clock,
    label: 'Study Time',
    value: '5h 42m',
    subtitle: 'This week',
    color: 'from-purple-500 to-purple-600',
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-purple-950/40 to-purple-900/30 border border-purple-800/30 rounded-xl p-4 hover:border-purple-700/50 transition-all"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            {stat.badge && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                {stat.badge}
              </span>
            )}
          </div>
          <div className="space-y-1">
            <div className="text-sm text-gray-400">{stat.label}</div>
            <div className="text-2xl font-bold">
              {stat.value}
              {stat.subValue && (
                <span className="text-sm text-gray-400 font-normal">/{stat.subValue}</span>
              )}
            </div>
            <div className="text-xs text-gray-500">{stat.subtitle}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
