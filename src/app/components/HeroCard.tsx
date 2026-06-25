import { ImageWithFallback } from './figma/ImageWithFallback';

export function HeroCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl h-[320px] bg-gradient-to-br from-purple-900/60 to-pink-900/60">
      <ImageWithFallback
        src="https://images.unsplash.com/photo-1764071288946-da85ee08ad8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHRvcmlpJTIwZ2F0ZSUyMHN1bnNldCUyMHNpbGhvdWV0dGV8ZW58MXx8fHwxNzgyMzcxNDY0fDA&ixlib=rb-4.1.0&q=80&w=1080"
        alt="Japanese torii gate at sunset"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-purple-950 via-purple-950/50 to-transparent"></div>
      
      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        <div>
          <div className="text-2xl font-bold mb-2">"每日少しずつ</div>
          <div className="text-2xl font-bold mb-2">大きな成果に。"</div>
          <div className="text-gray-300 mt-4">"Little by little,</div>
          <div className="text-gray-300">one goes a long way."</div>
          <div className="text-sm text-gray-400 mt-2">- Japanese Proverb</div>
        </div>
      </div>
    </div>
  );
}
