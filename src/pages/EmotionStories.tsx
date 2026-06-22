import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import {
  STORIES,
  EMOTIONS,
  type Story,
  type StoryNode,
  type StoryChoice,
} from '@/data/constants';
import { useEmotionStore } from '@/store/useEmotionStore';
import { cn } from '@/lib/utils';
import { speakText } from '@/utils';
import { useNavigate } from 'react-router-dom';

type ViewState = 'list' | 'reading' | 'review';

function getEmotionById(id: string) {
  return EMOTIONS.find((e) => e.id === id);
}

export default function EmotionStories() {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewState>('list');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string>('');
  const [encounteredEmotions, setEncounteredEmotions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{
    choice: StoryChoice;
    isCorrect: boolean;
  } | null>(null);
  const completedStoryIds = useEmotionStore((s) => s.completedStoryIds);
  const markStoryCompleted = useEmotionStore((s) => s.markStoryCompleted);

  const currentNode: StoryNode | undefined = selectedStory?.nodes.find(
    (n) => n.id === currentNodeId
  );

  useEffect(() => {
    if (view === 'reading' && currentNode?.text) {
      speakText(currentNode.text);
    }
  }, [view, currentNodeId, currentNode?.text]);

  const startStory = (story: Story) => {
    setSelectedStory(story);
    setCurrentNodeId(story.nodes[0].id);
    setEncounteredEmotions([]);
    setFeedback(null);
    setView('reading');
  };

  const goNext = () => {
    setFeedback(null);
    if (currentNode?.nextNodeId) {
      setCurrentNodeId(currentNode.nextNodeId);
    }
  };

  const handleChoice = (choice: StoryChoice) => {
    if (feedback) return;
    if (choice.emotionId && !encounteredEmotions.includes(choice.emotionId)) {
      setEncounteredEmotions((prev) => [...prev, choice.emotionId]);
    }
    setFeedback({ choice, isCorrect: choice.isCorrect });
    speakText(choice.feedback);

    if (choice.isCorrect && currentNode?.nextNodeId) {
      setTimeout(() => {
        setFeedback(null);
        setCurrentNodeId(currentNode.nextNodeId!);
      }, 2000);
    }
  };

  const handleEnd = () => {
    if (selectedStory) {
      markStoryCompleted(selectedStory.id);
      if (currentNode?.emotionPoints) {
        currentNode.emotionPoints.forEach((e) => {
          if (!encounteredEmotions.includes(e)) {
            setEncounteredEmotions((prev) => [...prev, e]);
          }
        });
      }
      setView('review');
    }
  };

  const backToList = () => {
    setView('list');
    setSelectedStory(null);
    setCurrentNodeId('');
    setEncounteredEmotions([]);
    setFeedback(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-orange-50 to-pink-50">
      <NavBar title="情绪故事" />

      {view === 'list' && (
        <StoryList stories={STORIES} onStart={startStory} completedIds={completedStoryIds} />
      )}

      {view === 'reading' && selectedStory && currentNode && (
        <ReadingView
          story={selectedStory}
          node={currentNode}
          feedback={feedback}
          onChoice={handleChoice}
          onNext={goNext}
          onEnd={handleEnd}
        />
      )}

      {view === 'review' && selectedStory && (
        <ReviewView
          story={selectedStory}
          emotions={encounteredEmotions}
          onBack={backToList}
          onReadAgain={() => startStory(selectedStory)}
          onGoHome={() => navigate('/')}
        />
      )}
    </div>
  );
}

function StoryList({
  stories,
  onStart,
  completedIds,
}: {
  stories: Story[];
  onStart: (s: Story) => void;
  completedIds: string[];
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-10 pt-4">
      <div className="mb-6 rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-sm border border-white text-center">
        <div className="text-5xl mb-2">📖</div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">一起来读情绪故事吧！</h2>
        <p className="text-sm text-gray-500">
          在故事中认识不同的情绪，帮助小主角找到正确的心情~
        </p>
      </div>

      <div className="space-y-4">
        {stories.map((story) => {
          const isCompleted = completedIds.includes(story.id);
          return (
            <button
              key={story.id}
              onClick={() => onStart(story)}
              className={cn(
                'w-full rounded-3xl p-5 shadow-md border-2 border-white text-left transition-all hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]',
                `bg-gradient-to-br ${story.bgGradient}`
              )}
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl flex-shrink-0">{story.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-800">{story.title}</h3>
                    {isCompleted && (
                      <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                        ✓ 已读
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{story.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {story.emotions.map((eid) => {
                      const e = getEmotionById(eid);
                      return e ? (
                        <span
                          key={eid}
                          className="inline-flex items-center gap-1 bg-white/70 rounded-full px-2 py-0.5 text-xs"
                          style={{ color: e.color }}
                        >
                          <span>{e.emoji}</span>
                          <span>{e.name}</span>
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ReadingView({
  story,
  node,
  feedback,
  onChoice,
  onNext,
  onEnd,
}: {
  story: Story;
  node: StoryNode;
  feedback: { choice: StoryChoice; isCorrect: boolean } | null;
  onChoice: (c: StoryChoice) => void;
  onNext: () => void;
  onEnd: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-10 pt-4">
      <div className="rounded-3xl bg-white shadow-xl overflow-hidden border-4 border-white">
        <div
          className={cn(
            'p-4 text-center bg-gradient-to-r',
            story.bgGradient
          )}
        >
          <span className="text-3xl mr-2">{story.emoji}</span>
          <span className="font-bold text-gray-800">{story.title}</span>
        </div>

        <div className="p-6">
          <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
            {node.text}
          </p>
        </div>
      </div>

      {node.choices && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🤔</span>
            <p className="text-base font-bold text-gray-700">
              你觉得小主角现在是什么心情？
            </p>
          </div>
          {node.choices.map((choice) => {
            const isSelected = feedback?.choice.id === choice.id;
            let borderColor = 'border-gray-200';
            let bgClass = 'bg-white';
            if (isSelected) {
              if (feedback?.isCorrect) {
                borderColor = 'border-green-400';
                bgClass = 'bg-green-50';
              } else {
                borderColor = 'border-red-400';
                bgClass = 'bg-red-50';
              }
            }
            return (
              <button
                key={choice.id}
                onClick={() => onChoice(choice)}
                disabled={!!feedback && feedback?.choice.id === choice.id && feedback?.isCorrect}
                className={cn(
                  'w-full rounded-2xl p-4 text-left border-2 transition-all shadow-md active:scale-[0.98]',
                  bgClass,
                  borderColor,
                  !feedback && 'hover:bg-gray-50 hover:border-gray-300',
                  feedback && !isSelected && 'opacity-60'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{choice.text.split(' ').pop() || '😊'}</span>
                  <span className="text-base text-gray-700 flex-1">{choice.text}</span>
                  {isSelected && (
                    <span className="text-2xl">
                      {feedback?.isCorrect ? '✅' : '❌'}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {feedback && (
        <div
          className={cn(
            'mt-5 rounded-2xl p-4 border-2 animate-fade-in',
            feedback.isCorrect
              ? 'bg-green-50 border-green-300'
              : 'bg-yellow-50 border-yellow-300'
          )}
        >
          <div className="flex items-start gap-3">
            <span className="text-3xl">{feedback.isCorrect ? '🎉' : '💡'}</span>
            <div>
              <p
                className={cn(
                  'font-bold mb-1',
                  feedback.isCorrect ? 'text-green-700' : 'text-yellow-700'
                )}
              >
                {feedback.isCorrect ? '答对了！' : '再想想~'}
              </p>
              <p className="text-sm text-gray-600">{feedback.choice.feedback}</p>
              {!feedback.isCorrect && (
                <p className="text-xs text-gray-400 mt-2">点击其他选项再试试吧~</p>
              )}
            </div>
          </div>
        </div>
      )}

      {!node.choices && !node.isEnd && (
        <button
          onClick={onNext}
          className="mt-6 w-full rounded-full py-4 bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold text-lg shadow-lg transition-all hover:from-orange-500 hover:to-pink-500 hover:shadow-xl active:scale-[0.98]"
        >
          继续 →
        </button>
      )}

      {node.isEnd && (
        <button
          onClick={onEnd}
          className="mt-6 w-full rounded-full py-4 bg-gradient-to-r from-green-400 to-teal-400 text-white font-bold text-lg shadow-lg transition-all hover:from-green-500 hover:to-teal-500 hover:shadow-xl active:scale-[0.98]"
        >
          🌟 完成阅读
        </button>
      )}
    </div>
  );
}

function ReviewView({
  story,
  emotions,
  onBack,
  onReadAgain,
  onGoHome,
}: {
  story: Story;
  emotions: string[];
  onBack: () => void;
  onReadAgain: () => void;
  onGoHome: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-10 pt-4">
      <div className="rounded-3xl bg-white shadow-xl overflow-hidden border-4 border-white animate-fade-in">
        <div
          className={cn(
            'p-8 text-center bg-gradient-to-br',
            story.bgGradient
          )}
        >
          <div className="text-6xl mb-3 animate-bounce">🎊</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">太棒了！</h2>
          <p className="text-gray-600">你读完了《{story.title}》</p>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🌈</span>
            <h3 className="text-lg font-bold text-gray-800">
              故事中出现了这些情绪：
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {emotions.length > 0 ? (
              emotions.map((eid) => {
                const e = getEmotionById(eid);
                if (!e) return null;
                return (
                  <div
                    key={eid}
                    className="rounded-2xl p-4 flex flex-col items-center border-2"
                    style={{
                      backgroundColor: e.bgColor,
                      borderColor: e.color,
                    }}
                  >
                    <div className="text-4xl mb-2">{e.emoji}</div>
                    <div
                      className="font-bold text-base"
                      style={{ color: e.color }}
                    >
                      {e.name}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 text-center text-gray-400 py-4">
                暂无情绪记录
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-blue-50 p-4 border-2 border-blue-200 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="font-bold text-blue-700 mb-1">小知识</p>
                <p className="text-sm text-gray-600">
                  每种情绪都是正常的，没有好坏之分。认识它们，才能更好地表达自己！
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onReadAgain}
              className="w-full rounded-full py-3 bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold shadow-lg transition-all hover:from-orange-500 hover:to-pink-500 active:scale-[0.98]"
            >
              📖 再读一遍
            </button>
            <button
              onClick={onBack}
              className="w-full rounded-full py-3 bg-white text-gray-700 font-bold border-2 border-gray-200 transition-all hover:bg-gray-50 active:scale-[0.98]"
            >
              📚 选择其他故事
            </button>
            <button
              onClick={onGoHome}
              className="w-full rounded-full py-3 bg-white text-gray-500 font-bold border border-gray-100 transition-all hover:bg-gray-50 active:scale-[0.98]"
            >
              🏠 返回首页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
