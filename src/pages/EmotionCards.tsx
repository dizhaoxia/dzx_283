import { useState } from 'react';
import NavBar from '@/components/NavBar';
import { EMOTIONS } from '@/data/constants';
import { speakText } from '@/utils';
import { cn } from '@/lib/utils';

export default function EmotionCards() {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const handleCardClick = (emotionId: string) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(emotionId)) {
        next.delete(emotionId);
      } else {
        next.add(emotionId);
      }
      return next;
    });
  };

  const handleSpeak = (emotionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const emotion = EMOTIONS.find((e) => e.id === emotionId);
    if (emotion) {
      speakText(`${emotion.name}。${emotion.tips}`);
    }
  };

  return (
    <div className="min-h-screen">
      <NavBar title="情绪卡片" />
      <div className="px-4 py-6">
        <div className="text-center mb-8">
          <p className="text-lg font-medium text-gray-600 bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-3 inline-block shadow-md">
            点一点卡片，翻过来看看小秘密吧~ ✨
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {EMOTIONS.map((emotion) => {
            const isFlipped = flippedCards.has(emotion.id);
            return (
              <div
                key={emotion.id}
                className={cn(
                  'card-3d h-72 cursor-pointer transition-transform duration-300 hover:-translate-y-2',
                  isFlipped && 'card-3d-flipped'
                )}
                onClick={() => handleCardClick(emotion.id)}
              >
                <div className="card-3d-inner">
                  <div
                    className={cn(
                      'card-3d-front bg-gradient-to-br',
                      emotion.gradientFrom,
                      emotion.gradientTo,
                      'flex flex-col items-center justify-center shadow-xl'
                    )}
                  >
                    <div className="emoji-big mb-4 drop-shadow-lg">
                      {emotion.emoji}
                    </div>
                    <h2 className="text-2xl font-bold text-white drop-shadow-md">
                      {emotion.name}
                    </h2>
                    <div className="absolute bottom-4 text-white/80 text-sm">
                      点击翻转 →
                    </div>
                  </div>
                  <div
                    className={cn(
                      'card-3d-back bg-gradient-to-br',
                      emotion.gradientFrom,
                      emotion.gradientTo,
                      'flex flex-col items-center justify-between p-6 shadow-xl'
                    )}
                  >
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-3xl">{emotion.emoji}</span>
                      <h3 className="text-xl font-bold drop-shadow-md">
                        {emotion.name}小贴士
                      </h3>
                    </div>
                    <p className="text-white text-center text-base leading-relaxed drop-shadow-md px-2">
                      {emotion.tips}
                    </p>
                    <button
                      onClick={(e) => handleSpeak(emotion.id, e)}
                      className={cn(
                        'btn-cute bg-white/90 text-gray-800 hover:bg-white',
                        'flex items-center gap-2'
                      )}
                    >
                      <span className="text-xl">🔊</span>
                      <span>读给我听</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
