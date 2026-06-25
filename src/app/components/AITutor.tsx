import { ImageWithFallback } from './figma/ImageWithFallback';
import { MessageCircle } from 'lucide-react';

export function AITutor() {
  return (
    <div className="bg-gradient-to-br from-purple-900/60 to-purple-950/60 border border-purple-800/30 rounded-2xl p-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1769874824744-1060f1f1a749?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNoYXJhY3RlciUyMHB1cnBsZSUyMGhhaXJ8ZW58MXx8fHwxNzgyMzcxNTEyfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="AI Tutor character"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">AI Tutor: Velmorth</h3>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        
        <div className="bg-purple-950/50 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-300 mb-2">Ask me anything in Japanese</p>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Ready to help you practice!</span>
          </div>
        </div>
        
        <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
          <MessageCircle className="w-4 h-4" />
          Start Conversation
        </button>
      </div>
    </div>
  );
}
