import { BookOpen, Award, MessageCircle, Mic } from 'lucide-react';

const tasks = [
  { icon: BookOpen, label: '10 Vocabulary', time: '10/10', progress: 100, color: 'text-blue-400' },
  { icon: Award, label: '10 Kanji Practice', time: '8/10', progress: 80, color: 'text-purple-400' },
  { icon: MessageCircle, label: '5 Grammar Points', time: '0/5', progress: 0, color: 'text-pink-400' },
  { icon: Mic, label: 'Speaking Practice', time: '0/1', progress: 0, color: 'text-green-400' },
];

export function TodaysPlan() {
  return (
    <div className="bg-gradient-to-br from-purple-950/40 to-purple-900/30 border border-purple-800/30 rounded-2xl p-6">
      <h3 className="text-lg font-bold mb-4">Today's Plan</h3>
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg bg-purple-900/50 flex items-center justify-center ${task.color}`}>
              <task.icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{task.label}</span>
                <span className="text-xs text-gray-400">{task.time}</span>
              </div>
              <div className="h-1.5 bg-purple-950/50 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${task.progress === 100 ? 'from-green-500 to-green-600' : 'from-purple-500 to-purple-600'}`}
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
