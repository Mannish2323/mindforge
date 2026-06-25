import { Lock, CheckCircle2, ArrowRight } from 'lucide-react';

const roadmapLevels = [
  { level: 'N5', score: 800, target: 1500, completed: true, color: 'from-green-500 to-green-600' },
  { level: 'N4', score: 1500, target: 3500, completed: true, color: 'from-blue-500 to-blue-600' },
  { level: 'N3', score: 3500, target: 6000, current: true, color: 'from-purple-500 to-purple-600' },
  { level: 'N2', score: 6000, target: 10000, locked: true, color: 'from-pink-500 to-pink-600' },
  { level: 'N1', score: 10000, target: '', locked: true, color: 'from-orange-500 to-orange-600' },
];

export function RoadmapSection() {
  return (
    <div className="bg-gradient-to-br from-purple-950/40 to-purple-900/30 border border-purple-800/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">JLPT Roadmap</h3>
      </div>

      <div className="flex items-center justify-between mb-6">
        {roadmapLevels.map((level, index) => (
          <div key={index} className="flex items-center">
            <div className="relative">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${
                  level.locked
                    ? 'bg-gray-800 border-gray-700'
                    : `bg-gradient-to-br ${level.color} border-purple-950`
                } ${level.current ? 'ring-4 ring-purple-500/30' : ''}`}
              >
                {level.locked ? (
                  <Lock className="w-6 h-6 text-gray-500" />
                ) : level.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-white" />
                ) : (
                  <span className="text-xl font-bold text-white">{level.level}</span>
                )}
              </div>
              {!level.locked && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center w-20">
                  <div className="text-xs font-bold text-white">{level.level}</div>
                  <div className="text-xs text-gray-400">{level.score}{level.target && `/${level.target}`}</div>
                </div>
              )}
            </div>
            {index < roadmapLevels.length - 1 && (
              <div className={`w-12 h-1 mx-2 ${level.completed ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-gray-700'}`}></div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 pt-4 border-t border-purple-800/30">
        <button className="w-full flex items-center justify-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
          <span className="text-sm font-medium">View Full Roadmap</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
