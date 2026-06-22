import { useState, useRef, useCallback } from 'react';
import NavBar from '@/components/NavBar';
import { EMOTIONS, type Emotion } from '@/data/constants';
import { speakText } from '@/utils';
import { cn } from '@/lib/utils';

const WHEEL_SIZE = 300;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = WHEEL_SIZE / 2 - 10;
const SECTOR_ANGLE = 360 / EMOTIONS.length;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeSector(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
}

export default function EmotionWheel() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSpin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedEmotion(null);

    const randomIndex = Math.floor(Math.random() * EMOTIONS.length);
    const spins = 5 + Math.floor(Math.random() * 3);
    const targetAngle = 360 - (randomIndex * SECTOR_ANGLE + SECTOR_ANGLE / 2);
    const newRotation = rotation + spins * 360 + targetAngle - (rotation % 360);

    setRotation(newRotation);

    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
    }
    spinTimeoutRef.current = setTimeout(() => {
      const emotion = EMOTIONS[randomIndex];
      setSelectedEmotion(emotion);
      setIsSpinning(false);
      speakText(emotion.name);
    }, 4000);
  }, [isSpinning, rotation]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 flex flex-col">
      <NavBar title="情绪选择轮" />

      <div className="flex-1 flex flex-col items-center px-4 py-6">
        <div className="relative">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
            <div className="relative">
              <div
                className="w-0 h-0 border-l-[16px] border-r-[16px] border-t-[28px] border-l-transparent border-r-transparent"
                style={{ borderTopColor: '#EF4444' }}
              />
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[14px] border-l-transparent border-r-transparent"
                style={{ borderTopColor: '#FCA5A5' }}
              />
            </div>
          </div>

          <div
            className="relative rounded-full shadow-2xl"
            style={{
              width: WHEEL_SIZE,
              height: WHEEL_SIZE,
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
                : 'none',
            }}
          >
            <svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
              {EMOTIONS.map((emotion, index) => {
                const startAngle = index * SECTOR_ANGLE;
                const endAngle = startAngle + SECTOR_ANGLE;
                const midAngle = startAngle + SECTOR_ANGLE / 2;
                const emojiPos = polarToCartesian(CENTER, CENTER, RADIUS * 0.65, midAngle);

                return (
                  <g key={emotion.id}>
                    <path
                      d={describeSector(CENTER, CENTER, RADIUS, startAngle, endAngle)}
                      fill={emotion.color}
                      stroke="white"
                      strokeWidth="3"
                    />
                    <text
                      x={emojiPos.x}
                      y={emojiPos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="32"
                      style={{
                        transform: `rotate(${midAngle}deg)`,
                        transformOrigin: `${emojiPos.x}px ${emojiPos.y}px`,
                      }}
                    >
                      {emotion.emoji}
                    </text>
                  </g>
                );
              })}
              <circle cx={CENTER} cy={CENTER} r="38" fill="white" stroke="#E5E7EB" strokeWidth="3" />
            </svg>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <div
              className={cn(
                'w-16 h-16 rounded-full bg-white flex items-center justify-center text-4xl shadow-lg border-4',
                selectedEmotion && 'animate-pop-in'
              )}
              style={{ borderColor: selectedEmotion?.color || '#E5E7EB' }}
            >
              {selectedEmotion ? selectedEmotion.emoji : '🎯'}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          {selectedEmotion ? (
            <div className="animate-fade-in">
              <h2
                className="text-3xl font-bold font-cute mb-2"
                style={{ color: selectedEmotion.color }}
              >
                {selectedEmotion.name}
              </h2>
              <p className="text-gray-600 text-sm max-w-xs mx-auto">{selectedEmotion.tips}</p>
            </div>
          ) : (
            <h2 className="text-xl text-gray-500 font-cute">点击下方按钮开始转盘吧！</h2>
          )}
        </div>

        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className={cn(
            'mt-6 px-10 py-4 rounded-full text-white text-lg font-bold font-cute shadow-lg transition-all active:scale-95',
            isSpinning
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 hover:shadow-xl'
          )}
        >
          {isSpinning ? '旋转中...' : selectedEmotion ? '再转一次' : '开始旋转'}
        </button>

        {selectedEmotion && (
          <div className="mt-8 w-full max-w-md animate-slide-up">
            <h3 className="text-lg font-bold text-gray-700 font-cute mb-4 text-center">
              ✨ 应对小妙招 ✨
            </h3>
            <div className="space-y-3">
              {selectedEmotion.copingMethods.map((method, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-md border-2"
                  style={{
                    borderColor: selectedEmotion.bgColor,
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: selectedEmotion.bgColor }}
                  >
                    {method.icon}
                  </div>
                  <p className="text-gray-700 font-cute text-base">{method.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
