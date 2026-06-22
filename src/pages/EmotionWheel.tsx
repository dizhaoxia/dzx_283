import { useState, useRef, useCallback, useMemo } from 'react';
import NavBar from '@/components/NavBar';
import {
  EMOTIONS,
  EMOTION_COPING_BY_INTENSITY,
  type Emotion,
  type CopingMethodByIntensity,
} from '@/data/constants';
import { speakText } from '@/utils';
import { cn } from '@/lib/utils';
import { useEmotionStore } from '@/store/useEmotionStore';

const WHEEL_SIZE = 300;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = WHEEL_SIZE / 2 - 10;
const SECTOR_ANGLE = 360 / EMOTIONS.length;

type Intensity = 'mild' | 'moderate' | 'intense';

const INTENSITY_LABELS: Record<Intensity, { label: string; emoji: string; desc: string }> = {
  mild: { label: '有点', emoji: '🙂', desc: '淡淡的感觉' },
  moderate: { label: '比较', emoji: '😐', desc: '明显的感觉' },
  intense: { label: '非常', emoji: '😤', desc: '强烈的感觉' },
};

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

function getIntensityFromValue(value: number): Intensity {
  if (value <= 33) return 'mild';
  if (value <= 66) return 'moderate';
  return 'intense';
}

export default function EmotionWheel() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [intensityValue, setIntensityValue] = useState<number>(50);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, boolean | undefined>>({});
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addMethodFeedback = useEmotionStore((s) => s.addMethodFeedback);
  const getRecommendedMethods = useEmotionStore((s) => s.getRecommendedMethods);

  const intensity: Intensity = getIntensityFromValue(intensityValue);

  const copingData: CopingMethodByIntensity | undefined = selectedEmotion
    ? EMOTION_COPING_BY_INTENSITY[selectedEmotion.id]
    : undefined;

  const currentMethods = useMemo(() => {
    return copingData ? copingData[intensity] : [];
  }, [copingData, intensity]);

  const orderedMethodIndices = useMemo(() => {
    if (!selectedEmotion) return [];
    const recommended = getRecommendedMethods(selectedEmotion.id, intensity);
    const all = currentMethods.map((_, i) => i);
    const rest = all.filter((i) => !recommended.includes(i));
    return [...recommended, ...rest];
  }, [selectedEmotion, intensity, getRecommendedMethods, currentMethods]);

  const handleSpin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedEmotion(null);
    setIntensityValue(50);
    setFeedbackMap({});

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

  const handleMethodFeedback = (methodIndex: number, isUseful: boolean) => {
    if (!selectedEmotion) return;
    const key = `${intensity}-${methodIndex}`;
    if (feedbackMap[key] !== undefined) return;
    setFeedbackMap((prev) => ({ ...prev, [key]: isUseful }));
    addMethodFeedback(selectedEmotion.id, intensity, methodIndex, isUseful);
    speakText(isUseful ? '太好了，这个方法对你有用！' : '好的，下次试试别的方法');
  };

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
                className="text-3xl font-bold mb-2"
                style={{ color: selectedEmotion.color }}
              >
                {selectedEmotion.name}
              </h2>
              <p className="text-gray-600 text-sm max-w-xs mx-auto">{selectedEmotion.tips}</p>
            </div>
          ) : (
            <h2 className="text-xl text-gray-500">点击下方按钮开始转盘吧！</h2>
          )}
        </div>

        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className={cn(
            'mt-6 px-10 py-4 rounded-full text-white text-lg font-bold shadow-lg transition-all active:scale-95',
            isSpinning
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 hover:shadow-xl'
          )}
        >
          {isSpinning ? '旋转中...' : selectedEmotion ? '再转一次' : '开始旋转'}
        </button>

        {selectedEmotion && (
          <div className="mt-8 w-full max-w-md space-y-6 animate-slide-up">
            <div className="rounded-3xl bg-white p-5 shadow-md border-2 border-white">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📊</span>
                <h3 className="text-lg font-bold text-gray-800">
                  情绪有多强烈？
                </h3>
              </div>

              <div className="mb-3">
                <div className="flex justify-between items-center mb-3">
                  {(['mild', 'moderate', 'intense'] as Intensity[]).map((level) => {
                    const isActive = intensity === level;
                    return (
                      <div
                        key={level}
                        className={cn(
                          'flex-1 mx-1 text-center rounded-xl py-2 px-1 transition-all',
                          isActive
                            ? 'bg-gradient-to-br from-purple-100 to-pink-100 border-2 scale-105'
                            : 'bg-gray-50 border border-gray-100 opacity-60'
                        )}
                        style={isActive ? { borderColor: selectedEmotion.color } : {}}
                      >
                        <div className="text-2xl mb-1">
                          {level === 'mild'
                            ? selectedEmotion.emoji
                            : level === 'moderate'
                            ? selectedEmotion.emoji
                            : selectedEmotion.emoji}
                        </div>
                        <div
                          className="text-xs font-bold"
                          style={isActive ? { color: selectedEmotion.color } : {}}
                        >
                          {INTENSITY_LABELS[level].label}
                          {selectedEmotion.name.replace('的', '')}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {INTENSITY_LABELS[level].desc}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="relative px-2">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>{INTENSITY_LABELS.mild.emoji} 有点</span>
                    <span>{INTENSITY_LABELS.moderate.emoji} 中等</span>
                    <span>{INTENSITY_LABELS.intense.emoji} 非常</span>
                  </div>
                  <div className="relative h-4 rounded-full overflow-hidden bg-gradient-to-r from-green-200 via-yellow-200 to-red-300">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={intensityValue}
                      onChange={(e) => setIntensityValue(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-lg border-4 transition-all pointer-events-none"
                      style={{
                        left: `calc(${intensityValue}% - 12px)`,
                        borderColor: selectedEmotion.color,
                      }}
                    />
                  </div>
                  <div className="text-center mt-2">
                    <span
                      className="text-sm font-bold"
                      style={{ color: selectedEmotion.color }}
                    >
                      当前强度：{INTENSITY_LABELS[intensity].label}
                      {selectedEmotion.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-md border-2 border-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  <h3 className="text-lg font-bold text-gray-800">
                    {intensity === 'mild'
                      ? '轻度情绪小妙招'
                      : intensity === 'moderate'
                      ? '中度情绪好方法'
                      : '强烈情绪应对法'}
                  </h3>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded-full font-bold"
                  style={{
                    backgroundColor: selectedEmotion.bgColor,
                    color: selectedEmotion.color,
                  }}
                >
                  {INTENSITY_LABELS[intensity].emoji} {INTENSITY_LABELS[intensity].label}
                </span>
              </div>

              <div className="space-y-3">
                {orderedMethodIndices.length > 0 &&
                  orderedMethodIndices.map((originalIdx, displayIdx) => {
                    const method = currentMethods[originalIdx];
                    if (!method) return null;
                    const key = `${intensity}-${originalIdx}`;
                    const feedback = feedbackMap[key];
                    const isRecommended = displayIdx < orderedMethodIndices.length && 
                      getRecommendedMethods(selectedEmotion.id, intensity).includes(originalIdx);

                    return (
                      <div
                        key={key}
                        className="rounded-2xl p-4 border-2 transition-all animate-fade-in"
                        style={{
                          borderColor: selectedEmotion.bgColor,
                          backgroundColor: selectedEmotion.bgColor + '60',
                          animationDelay: `${displayIdx * 80}ms`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                            style={{ backgroundColor: selectedEmotion.bgColor }}
                          >
                            {method.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-gray-700 font-medium">{method.text}</p>
                              {isRecommended && (
                                <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">
                                  ⭐ 推荐
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-dashed" style={{ borderColor: selectedEmotion.color + '40' }}>
                          <p className="text-xs text-gray-500 mb-2 text-center">
                            这个方法对你有用吗？
                          </p>
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => handleMethodFeedback(originalIdx, true)}
                              disabled={feedback !== undefined}
                              className={cn(
                                'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95',
                                feedback === true
                                  ? 'bg-green-500 text-white shadow-md scale-105'
                                  : feedback === false
                                  ? 'bg-gray-100 text-gray-400'
                                  : 'bg-green-50 text-green-600 border-2 border-green-200 hover:bg-green-100 hover:border-green-300'
                              )}
                            >
                              <span>👍</span>
                              <span>有用</span>
                              {feedback === true && <span>✓</span>}
                            </button>
                            <button
                              onClick={() => handleMethodFeedback(originalIdx, false)}
                              disabled={feedback !== undefined}
                              className={cn(
                                'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95',
                                feedback === false
                                  ? 'bg-gray-500 text-white shadow-md scale-105'
                                  : feedback === true
                                  ? 'bg-gray-100 text-gray-400'
                                  : 'bg-red-50 text-red-500 border-2 border-red-200 hover:bg-red-100 hover:border-red-300'
                              )}
                            >
                              <span>👎</span>
                              <span>没用</span>
                              {feedback === false && <span>✓</span>}
                            </button>
                          </div>
                          {feedback !== undefined && (
                            <p className="text-xs text-gray-400 mt-2 text-center animate-fade-in">
                              {feedback
                                ? '💖 好的！下次会优先推荐这个方法~'
                                : '💡 收到，下次试试其他方法吧！'}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="mt-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-3 border border-blue-100">
                <div className="flex items-start gap-2">
                  <span className="text-xl flex-shrink-0">💡</span>
                  <div>
                    <p className="text-xs font-bold text-gray-700 mb-1">小贴士</p>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      每个人应对情绪的方法不同，多试试几种，找到最适合自己的！
                      你标记"有用"的方法，下次会优先推荐给你哦~
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
