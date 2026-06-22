import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  EMOTIONS,
  DiaryEntry,
  STORIES,
  SITUATIONS,
} from '@/data/constants';
import NavBar from '@/components/NavBar';
import { useEmotionStore } from '@/store/useEmotionStore';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const WEEKDAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const RANK_BADGES = ['🥇', '🥈', '🥉'];

const EMOTION_SCORE: Record<string, number> = {
  happy: 5,
  calm: 4,
  surprised: 3,
  sad: 2,
  scared: 1,
  angry: 0,
};

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

function computeEmotions(diaryEntries: DiaryEntry[], days: number) {
  const result: { date: string; emotionId: string }[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const entry = diaryEntries.find((e) => e.date === dateStr);
    result.push({
      date: dateStr,
      emotionId: entry?.emotionId || '',
    });
  }
  return result;
}

function formatDateShort(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export default function ParentDashboard() {
  const diaryEntries = useEmotionStore((state) => state.diaryEntries);
  const emotionTriggerRecords = useEmotionStore((s) => s.emotionTriggerRecords);
  const breathingStats = useEmotionStore((s) => s.breathingStats);
  const quizStats = useEmotionStore((s) => s.quizStats);
  const completedStoryIds = useEmotionStore((s) => s.completedStoryIds);
  const getWeeklySummary = useEmotionStore((s) => s.getWeeklySummary);

  const weeklyEmotions = useMemo(
    () => computeEmotions(diaryEntries, 7),
    [diaryEntries]
  );
  const day30Emotions = useMemo(
    () => computeEmotions(diaryEntries, 30),
    [diaryEntries]
  );

  const todayEntry = useMemo(() => {
    const todayStr = getTodayStr();
    return diaryEntries.find((e) => e.date === todayStr);
  }, [diaryEntries]);

  const weeklySummary = useMemo(() => getWeeklySummary(), [getWeeklySummary]);

  const weeklyChartOption = useMemo(() => {
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
        stack: undefined,
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
        bottom: '18%',
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
          formatter: (v: number) => (v === 1 ? '✓' : ''),
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

  const trend30ChartOption = useMemo(() => {
    const dates = day30Emotions.map((item) => formatDateShort(item.date));
    const scores = day30Emotions.map((item) =>
      item.emotionId ? EMOTION_SCORE[item.emotionId] ?? 3 : null
    );

    const trendData = scores.map((s, i) => (s === null ? null : [i, s]));
    const validScores = scores.filter((s): s is number => s !== null);
    const avg =
      validScores.length > 0
        ? validScores.reduce((a, b) => a + b, 0) / validScores.length
        : 3;

    return {
      tooltip: {
        trigger: 'axis',
        formatter: (params: unknown) => {
          const arr = params as Array<{ dataIndex: number; value: unknown }>;
          const p = arr[0];
          const valArr = p.value as number[] | null | undefined;
          if (valArr === null || valArr === undefined) {
            return `${dates[p.dataIndex]}<br/>未记录`;
          }
          const score = valArr[1];
          const emotion = Object.entries(EMOTION_SCORE).find(
            ([, v]) => v === score
          )?.[0];
          const e = getEmotionById(emotion || '');
          return `${dates[p.dataIndex]}<br/>${e?.emoji || ''} ${e?.name || '未知'}`;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '12%',
        top: '12%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLine: {
          lineStyle: { color: '#E5E7EB' },
        },
        axisLabel: {
          color: '#9CA3AF',
          fontSize: 10,
          interval: 4,
        },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        min: -0.5,
        max: 5.5,
        interval: 1,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#9CA3AF',
          fontSize: 11,
          formatter: (val: number) => {
            const mapping: Record<number, string> = {
              0: '😠',
              1: '😨',
              2: '😢',
              3: '😮',
              4: '😊',
              5: '😄',
            };
            return mapping[val] || '';
          },
        },
        splitLine: {
          lineStyle: {
            color: '#F3F4F6',
            type: 'dashed',
          },
        },
      },
      series: [
        {
          type: 'line',
          data: trendData,
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            color: '#8B5CF6',
            width: 3,
          },
          itemStyle: {
            color: '#8B5CF6',
            borderColor: '#fff',
            borderWidth: 2,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(139, 92, 246, 0.25)' },
                { offset: 1, color: 'rgba(139, 92, 246, 0.02)' },
              ],
            },
          },
          connectNulls: false,
        },
        {
          type: 'line',
          data: scores.map(() => avg),
          symbol: 'none',
          lineStyle: {
            color: '#F59E0B',
            width: 2,
            type: 'dashed',
          },
          markLine: undefined,
          name: '平均',
        },
      ],
      graphic: {
        elements: [
          {
            type: 'text',
            right: 20,
            top: 10,
            style: {
              text: `平均水平: ${(() => {
                const rounded = Math.round(avg);
                const e = Object.entries(EMOTION_SCORE).find(
                  ([, v]) => v === rounded
                )?.[0];
                const emotion = getEmotionById(e || '');
                return `${emotion?.emoji || ''} ${emotion?.name || '-'}`;
              })()}`,
              fontSize: 12,
              fill: '#F59E0B',
            },
          },
        ],
      },
    };
  }, [day30Emotions]);

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

  const topTriggers = useMemo(() => {
    const countMap = new Map<string, { count: number; emotionId: string }>();
    emotionTriggerRecords.forEach((r) => {
      const key = r.situationId;
      const curr = countMap.get(key) || { count: 0, emotionId: r.emotionId };
      curr.count += 1;
      curr.emotionId = r.emotionId;
      countMap.set(key, curr);
    });
    return Array.from(countMap.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([situationId, data]) => {
        const situation = SITUATIONS.find((s) => s.id === situationId);
        const emotion = getEmotionById(data.emotionId);
        return {
          situationId,
          title: situation?.title || situationId,
          emoji: situation?.emoji || '🎭',
          count: data.count,
          emotion,
        };
      });
  }, [emotionTriggerRecords]);

  const weeklyReport = useMemo(() => {
    const { emotionCounts, diaryDays, topTriggers: weeklyTriggers } = weeklySummary;
    const total = Object.values(emotionCounts).reduce((a, b) => a + b, 0);
    const emotionNameMap: Record<string, string> = {
      happy: '开心',
      sad: '难过',
      angry: '生气',
      scared: '害怕',
      surprised: '惊讶',
      calm: '平静',
    };

    let text = `这周宝贝记录了 ${diaryDays} 天的心情。`;
    if (total > 0) {
      const parts = Object.entries(emotionCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([eid, c]) => `有 ${c} 天感到${emotionNameMap[eid] || eid}`);
      text += ` ${parts.join('，')}。`;
    }
    if (weeklyTriggers.length > 0) {
      text += ` 本周最常触发的场景是"${weeklyTriggers[0].situationTitle}"，常伴随${weeklyTriggers[0].emotionName}的情绪。`;
    }
    return text;
  }, [weeklySummary]);

  const recommendedContent = useMemo(() => {
    const items: {
      type: 'story' | 'breathing';
      title: string;
      emoji: string;
      desc: string;
      path: string;
      gradient: string;
    }[] = [];

    if (weeklySummary.recommendedStoryId) {
      const story = STORIES.find((s) => s.id === weeklySummary.recommendedStoryId);
      if (story) {
        items.push({
          type: 'story',
          title: story.title,
          emoji: story.emoji,
          desc: '通过故事认识情绪',
          path: '/emotion-stories',
          gradient: 'from-orange-300 to-pink-300',
        });
      }
    }

    if (weeklySummary.shouldPracticeBreathing) {
      items.push({
        type: 'breathing',
        title: '深呼吸练习',
        emoji: '🌬️',
        desc: '帮助平静心情',
        path: '/breathing',
        gradient: 'from-teal-300 to-emerald-300',
      });
    }

    if (items.length === 0) {
      const unfinishedStories = STORIES.filter(
        (s) => !completedStoryIds.includes(s.id)
      );
      if (unfinishedStories.length > 0) {
        const s = unfinishedStories[0];
        items.push({
          type: 'story',
          title: s.title,
          emoji: s.emoji,
          desc: '一起来读新故事吧~',
          path: '/emotion-stories',
          gradient: 'from-orange-300 to-pink-300',
        });
      }
    }
    return items;
  }, [weeklySummary, completedStoryIds]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-violet-50 to-pink-50">
      <NavBar title="家长看板" />

      <div className="mx-auto max-w-2xl px-4 pb-10 pt-4 space-y-5">
        <section className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-sm border border-white">
          <div className="grid grid-cols-4 gap-2 text-center">
            <StatCard
              emoji="📔"
              value={diaryEntries.length}
              label="日记"
              color="text-blue-500"
            />
            <StatCard
              emoji="🌬️"
              value={breathingStats.completedSessions}
              label="呼吸练习"
              color="text-teal-500"
            />
            <StatCard
              emoji="🧠"
              value={quizStats.correctAnswers}
              label="答题正确"
              color="text-cyan-500"
            />
            <StatCard
              emoji="📖"
              value={completedStoryIds.length}
              label="读完故事"
              color="text-orange-500"
            />
          </div>
        </section>

        <section className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-sm border border-white">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">📈</span>
            <div>
              <h2 className="text-base font-bold text-gray-800">近30天情绪趋势</h2>
              <p className="text-xs text-gray-400">折线越高代表情绪越积极</p>
            </div>
          </div>
          <ReactECharts
            option={trend30ChartOption}
            style={{ height: 240 }}
            opts={{ renderer: 'canvas' }}
          />
        </section>

        <section className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-sm border border-white">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <h2 className="text-base font-bold text-gray-800">近7天情绪分布</h2>
          </div>
          <ReactECharts
            option={weeklyChartOption}
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
            <span className="text-2xl">🎯</span>
            <div>
              <h2 className="text-base font-bold text-gray-800">高频触发点分析</h2>
              <p className="text-xs text-gray-400">情境模拟中最常触发的场景</p>
            </div>
          </div>
          {topTriggers.length > 0 ? (
            <div className="space-y-2">
              {topTriggers.map((t, idx) => {
                const max = topTriggers[0]?.count || 1;
                const pct = Math.round((t.count / max) * 100);
                return (
                  <div
                    key={t.situationId}
                    className="rounded-xl p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-100"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl w-9 text-center">{t.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-700 truncate">
                            {t.title}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            #{idx + 1}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          {t.emotion && (
                            <>
                              <span className="text-sm">{t.emotion.emoji}</span>
                              <span
                                className="text-xs font-medium"
                                style={{ color: t.emotion.color }}
                              >
                                {t.emotion.name}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-500 flex-shrink-0">
                        × {t.count}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: t.emotion?.color || '#8B5CF6',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-gray-400">
              <div className="text-4xl mb-2">🎭</div>
              去"情境模拟"玩一玩，就会有触发点数据啦~
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-sm border border-white">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <div>
              <h2 className="text-base font-bold text-gray-800">本周情绪小结</h2>
              <p className="text-xs text-gray-400">
                {weeklySummary.startDate} ~ {weeklySummary.endDate}
              </p>
            </div>
          </div>
          <div className="rounded-2xl p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🌈</span>
              <div>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  {weeklyReport}
                </p>
                {Object.keys(weeklySummary.emotionCounts).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(weeklySummary.emotionCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([eid, count]) => {
                        const e = getEmotionById(eid);
                        if (!e) return null;
                        return (
                          <span
                            key={eid}
                            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold"
                            style={{
                              backgroundColor: e.bgColor,
                              color: e.color,
                            }}
                          >
                            <span>{e.emoji}</span>
                            <span>{count}天</span>
                          </span>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-sm border border-white">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <h2 className="text-base font-bold text-gray-800">本周重点练习</h2>
          </div>
          {recommendedContent.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recommendedContent.map((item) => (
                <Link
                  key={item.path + item.title}
                  to={item.path}
                  className={cn(
                    'block rounded-2xl p-4 bg-gradient-to-br text-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]',
                    item.gradient
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-base mb-0.5">{item.title}</div>
                      <div className="text-xs text-white/90">{item.desc}</div>
                    </div>
                    <span className="text-xl opacity-80">→</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-sm text-gray-400">
              <div className="text-4xl mb-2">🎉</div>
              本周表现很棒，暂无特别推荐~
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
              <Link
                to="/diary"
                className="inline-block mt-4 px-5 py-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                去记录心情 📔
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  emoji,
  value,
  label,
  color,
}: {
  emoji: string;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl p-3 bg-white border border-gray-100 shadow-sm">
      <div className="text-2xl mb-1">{emoji}</div>
      <div className={cn('text-xl font-bold', color)}>{value}</div>
      <div className="text-[10px] text-gray-400">{label}</div>
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
