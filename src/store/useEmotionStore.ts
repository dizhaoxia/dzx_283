import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DiaryEntry, BreathingStats } from '@/data/constants';

interface EmotionStore {
  diaryEntries: DiaryEntry[];
  breathingStats: BreathingStats;
  addDiaryEntry: (entry: DiaryEntry) => void;
  getDiaryEntry: (date: string) => DiaryEntry | undefined;
  incrementBreathingStar: () => void;
  getWeeklyEmotions: () => { date: string; emotionId: string }[];
}

export const useEmotionStore = create<EmotionStore>()(
  persist(
    (set, get) => ({
      diaryEntries: [],
      breathingStats: {
        totalStars: 0,
        completedSessions: 0,
      },
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
          const dateStr = date.toISOString().split('T')[0];
          const entry = get().getDiaryEntry(dateStr);
          result.push({
            date: dateStr,
            emotionId: entry?.emotionId || '',
          });
        }
        return result;
      },
    }),
    {
      name: 'emotion-app-storage',
    }
  )
);
