import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { HeroCard } from './HeroCard';
import { StatsCards } from './StatsCards';
import { RoadmapSection } from './RoadmapSection';
import { TodaysPlan } from './TodaysPlan';
import { AITutor } from './AITutor';
import { PracticeCards } from './PracticeCards';

export function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto p-6 space-y-6">
          <Header />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <HeroCard />
              <StatsCards />
              <RoadmapSection />
              <PracticeCards />
            </div>
            
            {/* Right Column - Sidebar Content */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-900/40 to-purple-950/40 rounded-2xl p-6 border border-purple-800/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Continue Learning</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">N5 Vocabulary - Unit 12</span>
                      <span className="text-sm text-gray-400">68%</span>
                    </div>
                    <div className="h-2 bg-purple-950/50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-[68%]"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span>👨‍👩‍👧‍👦</span>
                      <span className="text-gray-300">Relationships</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span>🍱</span>
                      <span className="text-gray-300">food</span>
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 py-3 rounded-xl font-medium transition-all">
                    Continue →
                  </button>
                </div>
              </div>
              
              <TodaysPlan />
              <AITutor />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
