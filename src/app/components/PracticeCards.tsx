import { Volume2, CheckCircle2 } from 'lucide-react';

export function PracticeCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Grammar Practice */}
      <div className="bg-gradient-to-br from-purple-950/40 to-purple-900/30 border border-purple-800/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Grammar</h3>
          <button className="text-purple-400 hover:text-purple-300">
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-purple-950/50 rounded-xl p-4">
            <div className="text-xs text-gray-400 mb-2">〜ない (nai)</div>
            <div className="text-sm mb-2">私は日本へ行きません。</div>
            <div className="text-xs text-gray-400">Watashi wa Nihon e ikimasen desu.</div>
          </div>
          
          <div className="text-xs text-gray-400">I won't go to Japan.</div>
          
          <div className="space-y-2">
            <div className="text-xs font-semibold text-purple-300 mb-2">Examples</div>
            {/* Example items would go here */}
          </div>
          
          <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 py-2.5 rounded-xl text-sm font-medium transition-all">
            Practice →
          </button>
        </div>
      </div>

      {/* Speaking Practice */}
      <div className="bg-gradient-to-br from-purple-950/40 to-purple-900/30 border border-purple-800/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Speaking Practice</h3>
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">AI Conversation</span>
        </div>
        
        <div className="space-y-4">
          <div className="bg-purple-950/50 rounded-xl p-4">
            <div className="text-sm mb-2">こんにちは！</div>
            <div className="text-sm mb-2">元気ですか？</div>
            <div className="text-xs text-gray-400 mt-2">Hello! How are you?</div>
          </div>
          
          <div className="text-xs text-gray-400">いいえ、元気です！</div>
          
          <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2">
            <Volume2 className="w-4 h-4" />
            Tap to speak
          </button>
        </div>
      </div>

      {/* Writing Practice */}
      <div className="bg-gradient-to-br from-purple-950/40 to-purple-900/30 border border-purple-800/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Writing Practice</h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-purple-950/50 rounded-xl p-8 flex items-center justify-center">
            <div className="text-6xl font-bold text-purple-300">あ</div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Accuracy</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-500">★</span>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>98%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
