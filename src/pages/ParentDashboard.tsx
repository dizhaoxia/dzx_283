import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { EMOTIONS, DiaryEntry } from '@/data/constants';
import NavBar from '@/components/NavBar';
import { useEmotionStore } from '@/store/useEmotionStore';

const WEEKDAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const RANK_BADGES = ['🥇', '🥈', '🥉'];

function getWeekday(dateStr: string) {
  const date = new Date(dateStr);
  return WEEKDAY_NAMES[date.getDay()];
}

function getEmotionById(emotionId: string) {
  return EMOTIONS.find((e) => e.id === emotionId);
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export default function ParentDashboard() {
  const weeklyEmotions = useEmotionStore((s) => s.getWeeklyEmotions());
  const diaryEntries = useEmotionStore((s) => s.diaryEntries);
  const getDiaryEntry = useEmotionStore((s) => s.getDiaryEntry);

  const todayEntry = getDiaryEntry(getTodayStr());

  const chartOption = useMemo(() => {
    const categories = weeklyEmotions.map((item) => getWeekday(item.date));

    const series = EMOTIONS.map((emotion) => {
      const data = weeklyEmotions.map((item) =>
        item.emotionId === emotion.id ? 1 : 0
      );
      return {
        name: emotion.name,
        type: 'bar',
        data,
        itemStyle: {
          color: emotion.color,
          borderRadius: [6, 6, 0, 0],
        },
        barWidth: 12,
      };
    });

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: EMOTIONS.map((e) => e.name),
        bottom: 0,
        itemWidth: 12,
        itemHeight: 12,
        textStyle: {
          fontSize: 12,
          color: '#6B7280',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '8%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLine: {
          lineStyle: {
            color: '#E5E7EB',
          },
        },
        axisLabel: {
          color: '#6B7280',
          fontSize: 12,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        max: 1,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#9CA3AF',
          fontSize: 12,
        },
        splitLine: {
          lineStyle: {
            color: '#F3F4F6',
            type: 'dashed',
          },
        },
      },
      series,
    };
  }, [weeklyEmotions]);

  const topEmotions = useMemo(() => {
    const countMap = new Map<string, number>();
    diaryEntries.forEach((entry) => {
      if (entry.emotionId) {
        countMap.set(entry.emotionId, (countMap.get(entry.emotionId) || 0) + 1);
      }
    });
    const sorted = Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([emotionId, count]) => ({
        emotion: getEmotionById(emotionId),
        count,
      }));
    return sorted;
  }, [diaryEntries]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-violet-50 to-pink-50">
      <NavBar title="家长看板" />

      <div className="mx-auto max-w-2xl px-4 pb-10 pt-4 space-y-5">
        <section className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-sm border border-white">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <h2 className="text-base font-bold text-gray-800">近7天情绪分布</h2>
          </div>
          <ReactECharts
            option={chartOption}
            style={{ height: 260 }}
            opts={{ renderer: 'canvas' }}
          />
        </section>

        <section className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-sm border border-white">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <h2 className="text-base font-bold text-gray-800">高频情绪 Top3</h2>
          </div>
          {topEmotions.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {topEmotions.map((item, index) => {
                const emotion = item.emotion;
                if (!emotion) return null;
                return (
                  <div
                    key={emotion.id}
                    className="flex flex-col items-center rounded-2xl p-4 border border-white shadow-sm"
                    style={{ backgroundColor: emotion.bgColor }}
                  >
                    <div className="text-2xl mb-1">{RANK_BADGES[index]}</div>
                    <div className="text-4xl mb-1">{emotion.emoji}</div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: emotion.color }}
                    >
                      {emotion.name}
                    </div>
                    <div className="mt-1 rounded-full bg-white/80 px-3 py-0.5 text-xs text-gray-600">
                      {item.count} 次
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-gray-400">
              暂无情绪记录哦~
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-sm border border-white">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <h2 className="text-base font-bold text-gray-800">今日情绪记录</h2>
          </div>
          {todayEntry ? (
            <TodayRecord entry={todayEntry} />
          ) : (
            <div className="py-8 text-center">
              <div className="text-5xl mb-2">🌤️</div>
              <div className="text-sm text-gray-400">今天还没有记录哦~</div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function TodayRecord({ entry }: { entry: DiaryEntry }) {
  const emotion = getEmotionById(entry.emotionId);

  return (
    <div className="flex gap-4">
      <div
        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-5xl"
        style={{ backgroundColor: emotion?.bgColor || '#F3F4F6' }}
      >
        {emotion?.emoji || '😐'}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          {emotion && (
            <span
              className="text-sm font-semibold"
              style={{ color: emotion.color }}
            >
              {emotion.name}
            </span>
          )}
        </div>
        {entry.note ? (
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{entry.note}</p>
        ) : null}
        {entry.drawing ? (
          <div className="rounded-xl overflow-hidden w-24 h-24 bg-gray-50 border border-gray-100">
            <img
              src={entry.drawing}
              alt="绘画"
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
