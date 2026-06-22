import { useState, useEffect, useRef, useCallback } from 'react';
import NavBar from '@/components/NavBar';
import { BREATHING_PHASES } from '@/data/constants';
import { useEmotionStore } from '@/store/useEmotionStore';
import { cn } from '@/lib/utils';

const phaseGradients: Record<string, string> = {
  '吸气': 'from-sky-300 via-blue-400 to-indigo-400',
  '屏息': 'from-indigo-300 via-purple-400 to-violet-400',
  '呼气': 'from-emerald-300 via-teal-400 to-cyan-400',
};

const phaseBallColors: Record<string, string> = {
  '吸气': 'bg-gradient-to-br from-sky-200 to-blue-400',
  '屏息': 'bg-gradient-to-br from-indigo-200 to-purple-400',
  '呼气': 'bg-gradient-to-br from-emerald-200 to-teal-400',
};

export default function BreathingExercise() {
  const breathingStats = useEmotionStore((state) => state.breathingStats);
  const incrementBreathingStar = useEmotionStore((state) => state.incrementBreathingStar);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [showStar, setShowStar] = useState(false);
  const [starKey, setStarKey] = useState(0);

  const phaseTimerRef = useRef<number | null>(null);
  const countdownTimerRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (phaseTimerRef.current) {
      window.clearTimeout(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }
    if (countdownTimerRef.current) {
      window.clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, []);

  const runPhase = useCallback((phaseIndex: number) => {
    if (!isRunningRef.current) return;

    const phase = BREATHING_PHASES[phaseIndex];
    setCurrentPhaseIndex(phaseIndex);
    setCountdown(Math.ceil(phase.duration / 1000));

    let remainingMs = phase.duration;
    countdownTimerRef.current = window.setInterval(() => {
      remainingMs -= 1000;
      if (remainingMs > 0) {
        setCountdown(Math.ceil(remainingMs / 1000));
      }
    }, 1000);

    phaseTimerRef.current = window.setTimeout(() => {
      if (countdownTimerRef.current) {
        window.clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }

      if (!isRunningRef.current) return;

      const nextPhaseIndex = (phaseIndex + 1) % BREATHING_PHASES.length;

      if (nextPhaseIndex === 0) {
        incrementBreathingStar();
        setStarKey((k) => k + 1);
        setShowStar(true);
        window.setTimeout(() => setShowStar(false), 800);
      }

      runPhase(nextPhaseIndex);
    }, phase.duration);
  }, [incrementBreathingStar]);

  const handleStart = () => {
    clearTimers();
    isRunningRef.current = true;
    setIsRunning(true);
    runPhase(0);
  };

  const handleStop = () => {
    isRunningRef.current = false;
    clearTimers();
    setIsRunning(false);
    setCountdown(0);
  };

  useEffect(() => {
    return () => {
      isRunningRef.current = false;
      clearTimers();
    };
  }, [clearTimers]);

  const currentPhase = BREATHING_PHASES[currentPhaseIndex];
  const gradientClass = isRunning
    ? phaseGradients[currentPhase.name]
    : 'from-pink-100 via-yellow-100 to-sky-100';
  const ballColorClass = isRunning
    ? phaseBallColors[currentPhase.name]
    : 'bg-gradient-to-br from-pink-200 to-blue-200';

  return (
    <div
      className={cn(
        'min-h-screen w-full flex flex-col bg-gradient-to-br transition-all duration-1000 ease-in-out',
        gradientClass
      )}
    >
      <NavBar title="呼吸练习" />

      <div className="flex flex-col items-center px-6 pb-8 flex-1">
        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-5 py-2 shadow-md mb-4">
          <span className="text-2xl">⭐</span>
          <span className="text-xl font-bold text-amber-600 font-cute">
            {breathingStats.totalStars}
          </span>
        </div>

        <p className="text-lg text-gray-700 mb-8 font-cute animate-fade-in">
          跟着小球一起呼吸吧~
        </p>

        <div className="relative flex items-center justify-center my-8">
          {showStar && (
            <div
              key={starKey}
              className="absolute -top-16 text-6xl animate-star-burst z-20"
            >
              ⭐
            </div>
          )}

          <div
            className={cn(
              'w-56 h-56 md:w-72 md:h-72 rounded-full shadow-2xl flex flex-col items-center justify-center',
              ballColorClass
            )}
            style={{
              transform: `scale(${isRunning ? currentPhase.scale : 1})`,
              transition: 'transform 1s ease-in-out',
            }}
          >
            {isRunning ? (
              <>
                <span className="text-2xl md:text-3xl font-bold text-white drop-shadow-md font-cute mb-1">
                  {currentPhase.name}
                </span>
                <span className="text-6xl md:text-7xl font-bold text-white drop-shadow-lg font-cute">
                  {countdown}
                </span>
              </>
            ) : (
              <span className="text-xl md:text-2xl font-bold text-white/90 drop-shadow-md font-cute">
                准备好了吗？
              </span>
            )}
          </div>
        </div>

        <div className="mt-auto mb-4 w-full max-w-sm">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="btn-cute w-full bg-gradient-to-r from-pink-400 to-rose-500 text-xl"
            >
              🌟 开始练习
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="btn-cute w-full bg-gradient-to-r from-gray-400 to-gray-500 text-xl"
            >
              ✋ 停止
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
