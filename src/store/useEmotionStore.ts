import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  DiaryEntry,
  BreathingStats,
  QuizStats,
  EmotionTriggerRecord,
  MethodFeedbackRecord,
  SITUATIONS,
  STORIES,
} from '@/data/constants';

function getDateStr(date: Date): string {
  return date.toISOString().split('T')[0];
}

interface EmotionStore {
  diaryEntries: DiaryEntry[];
  breathingStats: BreathingStats;
  quizStats: QuizStats;
  emotionTriggerRecords: EmotionTriggerRecord[];
  methodFeedbackRecords: MethodFeedbackRecord[];
  completedStoryIds: string[];
  addDiaryEntry: (entry: DiaryEntry) => void;
  getDiaryEntry: (date: string) => DiaryEntry | undefined;
  incrementBreathingStar: () => void;
  getWeeklyEmotions: () => { date: string; emotionId: string }[];
  get30DayEmotions: () => { date: string; emotionId: string }[];
  addQuizResult: (questionId: string, isCorrect: boolean) => void;
  addEmotionTrigger: (situationId: string, emotionId: string) => void;
  addMethodFeedback: (
    emotionId: string,
    intensity: 'mild' | 'moderate' | 'intense',
    methodIndex: number,
    isUseful: boolean
  ) => void;
  getRecommendedMethods: (
    emotionId: string,
    intensity: 'mild' | 'moderate' | 'intense'
  ) => number[];
  markStoryCompleted: (storyId: string) => void;
  getWeeklySummary: () => {
    startDate: string;
    endDate: string;
    emotionCounts: Record<string, number>;
    totalDays: number;
    diaryDays: number;
    topTriggers: { situationTitle: string; emotionName: string; count: number }[];
    recommendedStoryId: string | null;
    shouldPracticeBreathing: boolean;
  };
}

export const useEmotionStore = create<EmotionStore>()(
  persist(
    (set, get) => ({
      diaryEntries: [],
      breathingStats: {
        totalStars: 0,
        completedSessions: 0,
      },
      quizStats: {
        totalAnswered: 0,
        correctAnswers: 0,
        answeredQuestionIds: [],
      },
      emotionTriggerRecords: [],
      methodFeedbackRecords: [],
      completedStoryIds: [],
      addDiaryEntry: (entry) => {
        const existingIndex = get().diaryEntries.findIndex(
          (e) => e.date === entry.date
        );
        if (existingIndex >= 0) {
          const updated = [...get().diaryEntries];
          updated[existingIndex] = entry;
          set({ diaryEntries: updated });
        } else {
          set({ diaryEntries: [...get().diaryEntries, entry] });
        }
      },
      getDiaryEntry: (date) => {
        return get().diaryEntries.find((e) => e.date === date);
      },
      incrementBreathingStar: () => {
        set({
          breathingStats: {
            totalStars: get().breathingStats.totalStars + 1,
            completedSessions: get().breathingStats.completedSessions + 1,
          },
        });
      },
      getWeeklyEmotions: () => {
        const result: { date: string; emotionId: string }[] = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = getDateStr(date);
          const entry = get().getDiaryEntry(dateStr);
          result.push({
            date: dateStr,
            emotionId: entry?.emotionId || '',
          });
        }
        return result;
      },
      get30DayEmotions: () => {
        const result: { date: string; emotionId: string }[] = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = getDateStr(date);
          const entry = get().getDiaryEntry(dateStr);
          result.push({
            date: dateStr,
            emotionId: entry?.emotionId || '',
          });
        }
        return result;
      },
      addQuizResult: (questionId, isCorrect) => {
        const { quizStats } = get();
        if (quizStats.answeredQuestionIds.includes(questionId)) return;
        set({
          quizStats: {
            totalAnswered: quizStats.totalAnswered + 1,
            correctAnswers: quizStats.correctAnswers + (isCorrect ? 1 : 0),
            answeredQuestionIds: [...quizStats.answeredQuestionIds, questionId],
          },
        });
      },
      addEmotionTrigger: (situationId, emotionId) => {
        set({
          emotionTriggerRecords: [
            ...get().emotionTriggerRecords,
            { situationId, emotionId, timestamp: Date.now() },
          ],
        });
      },
      addMethodFeedback: (emotionId, intensity, methodIndex, isUseful) => {
        set({
          methodFeedbackRecords: [
            ...get().methodFeedbackRecords,
            {
              emotionId,
              intensity,
              methodIndex,
              isUseful,
              timestamp: Date.now(),
            },
          ],
        });
      },
      getRecommendedMethods: (emotionId, intensity) => {
        const { methodFeedbackRecords } = get();
        const relevant = methodFeedbackRecords.filter(
          (r) => r.emotionId === emotionId && r.intensity === intensity
        );
        const usefulness = new Map<number, { useful: number; total: number }>();
        relevant.forEach((r) => {
          const curr = usefulness.get(r.methodIndex) || { useful: 0, total: 0 };
          curr.total += 1;
          if (r.isUseful) curr.useful += 1;
          usefulness.set(r.methodIndex, curr);
        });
        const scored = Array.from(usefulness.entries())
          .map(([idx, data]) => ({
            idx,
            score: data.total > 0 ? data.useful / data.total : 0.5,
          }))
          .sort((a, b) => b.score - a.score);
        return scored.length > 0 ? scored.map((s) => s.idx) : [];
      },
      markStoryCompleted: (storyId) => {
        const { completedStoryIds } = get();
        if (!completedStoryIds.includes(storyId)) {
          set({ completedStoryIds: [...completedStoryIds, storyId] });
        }
      },
      getWeeklySummary: () => {
        const { diaryEntries, emotionTriggerRecords, completedStoryIds, breathingStats } = get();
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - 6);
        const startDate = getDateStr(weekStart);
        const endDate = getDateStr(today);

        const emotionCounts: Record<string, number> = {};
        let diaryDays = 0;
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = getDateStr(date);
          const entry = diaryEntries.find((e) => e.date === dateStr);
          if (entry && entry.emotionId) {
            diaryDays += 1;
            emotionCounts[entry.emotionId] = (emotionCounts[entry.emotionId] || 0) + 1;
          }
        }

        const weekStartTime = weekStart.getTime();
        const weekTriggers = emotionTriggerRecords.filter(
          (r) => r.timestamp >= weekStartTime
        );
        const triggerCountMap = new Map<string, { count: number; emotionId: string }>();
        weekTriggers.forEach((r) => {
          const key = r.situationId;
          const curr = triggerCountMap.get(key) || { count: 0, emotionId: r.emotionId };
          curr.count += 1;
          triggerCountMap.set(key, curr);
        });
        const topTriggers = Array.from(triggerCountMap.entries())
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 3)
          .map(([situationId, data]) => {
            const situation = SITUATIONS.find((s) => s.id === situationId);
            const emotionMap: Record<string, string> = {
              happy: '开心', sad: '难过', angry: '生气',
              scared: '害怕', surprised: '惊讶', calm: '平静',
            };
            return {
              situationTitle: situation?.title || situationId,
              emotionName: emotionMap[data.emotionId] || data.emotionId,
              count: data.count,
            };
          });

        const uncompletedStories = STORIES.filter(
          (s) => !completedStoryIds.includes(s.id)
        );
        const negativeEmotions = ['sad', 'angry', 'scared'];
        const hasNegative = Object.keys(emotionCounts).some((e) =>
          negativeEmotions.includes(e)
        );
        const recommendedStoryId = hasNegative
          ? uncompletedStories.find((s) =>
              s.emotions.some((e) => negativeEmotions.includes(e))
            )?.id || uncompletedStories[0]?.id || null
          : uncompletedStories[0]?.id || null;

        const shouldPracticeBreathing =
          (emotionCounts['angry'] || 0) + (emotionCounts['scared'] || 0) >= 2 &&
          breathingStats.completedSessions < 3;

        return {
          startDate,
          endDate,
          emotionCounts,
          totalDays: 7,
          diaryDays,
          topTriggers,
          recommendedStoryId,
          shouldPracticeBreathing,
        };
      },
    }),
    {
      name: 'emotion-app-storage',
    }
  )
);
