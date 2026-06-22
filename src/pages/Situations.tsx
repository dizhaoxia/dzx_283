import { useState } from 'react';
import NavBar from '@/components/NavBar';
import { SITUATIONS, EMOTIONS } from '@/data/constants';
import { cn } from '@/lib/utils';

export default function Situations() {
  const [currentSituationId, setCurrentSituationId] = useState(SITUATIONS[0].id);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  const currentSituation = SITUATIONS.find((s) => s.id === currentSituationId) || SITUATIONS[0];

  const handleSituationClick = (id: string) => {
    setCurrentSituationId(id);
    setSelectedEmotion(null);
  };

  const handleEmotionClick = (emotionId: string) => {
    setSelectedEmotion(emotionId);
  };

  const handleRandomSituation = () => {
    const otherSituations = SITUATIONS.filter((s) => s.id !== currentSituationId);
    const randomSituation = otherSituations[Math.floor(Math.random() * otherSituations.length)];
    setCurrentSituationId(randomSituation.id);
    setSelectedEmotion(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
      <NavBar title="情境模拟" />

      <div className="px-4 py-4">
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {SITUATIONS.map((situation) => (
            <button
              key={situation.id}
              onClick={() => handleSituationClick(situation.id)}
              className={cn(
                'flex-shrink-0 flex flex-col items-center justify-center',
                'w-16 h-20 rounded-2xl transition-all duration-300',
                'bg-white border-2 shadow-md hover:shadow-lg active:scale-95',
                currentSituationId === situation.id
                  ? 'border-pink-400 scale-105 shadow-pink-200'
                  : 'border-gray-200'
              )}
            >
              <span className="text-2xl mb-1">{situation.emoji}</span>
              <span className="text-[10px] text-gray-600 font-cute text-center leading-tight px-1">
                {situation.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-8">
        <div
          className={cn(
            'rounded-3xl p-6 shadow-xl mb-6 bg-gradient-to-br',
            currentSituation.bgGradient,
            'border-4 border-white'
          )}
        >
          <div className="flex flex-col items-center text-center">
            <div className="text-7xl mb-4 animate-float">
              {currentSituation.emoji}
            </div>
            <h2 className="text-2xl font-bold text-purple-700 font-cute mb-3">
              {currentSituation.title}
            </h2>
            <p className="text-gray-700 font-cute leading-relaxed text-base">
              {currentSituation.description}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-purple-600 font-cute mb-3 text-center">
            你现在是什么心情呢？🤔
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {EMOTIONS.map((emotion) => (
              <button
                key={emotion.id}
                onClick={() => handleEmotionClick(emotion.id)}
                className={cn(
                  'flex flex-col items-center justify-center py-3 px-2 rounded-2xl',
                  'border-3 transition-all duration-300 active:scale-95',
                  'shadow-md hover:shadow-lg',
                  selectedEmotion === emotion.id
                    ? 'border-purple-400 scale-105 ring-4 ring-purple-200'
                    : 'border-white',
                  'bg-gradient-to-br',
                  emotion.gradientFrom,
                  emotion.gradientTo
                )}
              >
                <span className="text-3xl mb-1">{emotion.emoji}</span>
                <span className="text-sm font-cute font-bold text-white drop-shadow">
                  {emotion.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {selectedEmotion && (
          <div className="animate-slide-up">
            <div className="bg-white rounded-3xl p-5 shadow-xl border-4 border-yellow-200 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl animate-star-burst">🌟</span>
                <h3 className="text-lg font-bold text-pink-500 font-cute">
                  你选的情绪很合理！
                </h3>
              </div>
              <p className="text-gray-700 font-cute leading-relaxed text-sm">
                {currentSituation.knowledge}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleRandomSituation}
          className={cn(
            'w-full py-4 rounded-2xl font-bold text-lg font-cute',
            'bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400',
            'text-white shadow-lg hover:shadow-xl active:scale-98 transition-all',
            'border-4 border-white'
          )}
        >
          🎲 换一个场景
        </button>
      </div>
    </div>
  );
}
