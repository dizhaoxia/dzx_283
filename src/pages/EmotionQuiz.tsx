import { useState, useMemo, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { QUIZ_QUESTIONS, type QuizQuestion } from '@/data/constants';
import { useEmotionStore } from '@/store/useEmotionStore';
import { cn } from '@/lib/utils';
import { speakText } from '@/utils';
import { Link } from 'react-router-dom';

type ViewState = 'menu' | 'quiz' | 'result';
type FilterType = 'all' | 'emotion' | 'situation';

export default function EmotionQuiz() {
  const [view, setView] = useState<ViewState>('menu');
  const [filter, setFilter] = useState<FilterType>('all');
  const [questionOrder, setQuestionOrder] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionAnswered, setSessionAnswered] = useState(0);
  const [animating, setAnimating] = useState(false);

  const quizStats = useEmotionStore((s) => s.quizStats);
  const addQuizResult = useEmotionStore((s) => s.addQuizResult);

  const availableQuestions = useMemo(() => {
    return QUIZ_QUESTIONS.filter((q) => {
      if (filter === 'all') return true;
      return q.type === filter;
    });
  }, [filter]);

  const currentQuestion: QuizQuestion | undefined = questionOrder.length > 0
    ? QUIZ_QUESTIONS.find((q) => q.id === questionOrder[currentIndex])
    : undefined;

  const startQuiz = () => {
    const shuffled = [...availableQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(5, availableQuestions.length))
      .map((q) => q.id);
    setQuestionOrder(shuffled);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setShowFeedback(false);
    setSessionCorrect(0);
    setSessionAnswered(0);
    setView('quiz');
  };

  const isCorrect = useMemo(() => {
    if (!currentQuestion || !selectedOptionId) return false;
    const opt = currentQuestion.options.find((o) => o.id === selectedOptionId);
    return opt?.isCorrect || false;
  }, [currentQuestion, selectedOptionId]);

  useEffect(() => {
    if (showFeedback && currentQuestion) {
      speakText(
        isCorrect ? '答对了！' + currentQuestion.explanation : currentQuestion.explanation
      );
    }
  }, [showFeedback, currentQuestion, isCorrect]);

  const handleOptionClick = (optionId: string) => {
    if (showFeedback) return;
    setSelectedOptionId(optionId);
    setShowFeedback(true);
    const opt = currentQuestion?.options.find((o) => o.id === optionId);
    const correct = opt?.isCorrect || false;
    if (correct) setSessionCorrect((c) => c + 1);
    setSessionAnswered((c) => c + 1);
    addQuizResult(currentQuestion!.id, correct);
  };

  const nextQuestion = () => {
    setAnimating(true);
    setTimeout(() => {
      if (currentIndex + 1 >= questionOrder.length) {
        setView('result');
      } else {
        setCurrentIndex((i) => i + 1);
        setSelectedOptionId(null);
        setShowFeedback(false);
      }
      setAnimating(false);
    }, 300);
  };

  const accuracy =
    quizStats.totalAnswered > 0
      ? Math.round((quizStats.correctAnswers / quizStats.totalAnswered) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-sky-50 to-indigo-50">
      <NavBar title="互动问答" />

      {view === 'menu' && (
        <QuizMenu
          filter={filter}
          setFilter={setFilter}
          availableQuestions={availableQuestions}
          totalAnswered={quizStats.totalAnswered}
          correctAnswers={quizStats.correctAnswers}
          accuracy={accuracy}
          onStart={startQuiz}
        />
      )}

      {view === 'quiz' && currentQuestion && (
        <QuizQuestionView
          question={currentQuestion}
          questionIndex={currentIndex + 1}
          totalQuestions={questionOrder.length}
          selectedOptionId={selectedOptionId}
          showFeedback={showFeedback}
          isCorrect={isCorrect}
          sessionCorrect={sessionCorrect}
          sessionAnswered={sessionAnswered}
          animating={animating}
          onOptionClick={handleOptionClick}
          onNext={nextQuestion}
        />
      )}

      {view === 'result' && (
        <QuizResult
          correct={sessionCorrect}
          total={sessionAnswered}
          totalAnswered={quizStats.totalAnswered}
          overallCorrect={quizStats.correctAnswers}
          accuracy={accuracy}
          onRetry={startQuiz}
          onBackToMenu={() => setView('menu')}
        />
      )}
    </div>
  );
}

function QuizMenu({
  filter,
  setFilter,
  availableQuestions,
  totalAnswered,
  correctAnswers,
  accuracy,
  onStart,
}: {
  filter: FilterType;
  setFilter: (f: FilterType) => void;
  availableQuestions: QuizQuestion[];
  totalAnswered: number;
  correctAnswers: number;
  accuracy: number;
  onStart: () => void;
}) {
  const filters: { id: FilterType; label: string; emoji: string }[] = [
    { id: 'all', label: '全部', emoji: '🎯' },
    { id: 'emotion', label: '情绪识别', emoji: '😊' },
    { id: 'situation', label: '情境应对', emoji: '🎭' },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 pb-10 pt-4">
      <div className="rounded-3xl bg-white/80 p-6 shadow-sm backdrop-blur-sm border border-white mb-5 text-center">
        <div className="text-5xl mb-3">🧠</div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">来做情绪小测试吧！</h2>
        <p className="text-sm text-gray-500">
          看看你对情绪了解多少，答对有鼓励哦~
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm border border-gray-100">
          <div className="text-3xl mb-1">📝</div>
          <div className="text-2xl font-bold text-blue-500">{totalAnswered}</div>
          <div className="text-xs text-gray-500">累计答题</div>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm border border-gray-100">
          <div className="text-3xl mb-1">✅</div>
          <div className="text-2xl font-bold text-green-500">{correctAnswers}</div>
          <div className="text-xs text-gray-500">答对</div>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm border border-gray-100">
          <div className="text-3xl mb-1">🏆</div>
          <div className="text-2xl font-bold text-orange-500">{accuracy}%</div>
          <div className="text-xs text-gray-500">正确率</div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100 mb-5">
        <p className="text-sm font-bold text-gray-700 mb-3">选择题目类型：</p>
        <div className="grid grid-cols-3 gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'rounded-2xl p-3 text-sm font-bold transition-all border-2',
                filter === f.id
                  ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white border-transparent shadow-md scale-[1.02]'
                  : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'
              )}
            >
              <div className="text-2xl mb-1">{f.emoji}</div>
              {f.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">
          当前筛选共 {availableQuestions.length} 道题目
        </p>
      </div>

      <button
        onClick={onStart}
        disabled={availableQuestions.length === 0}
        className={cn(
          'w-full rounded-full py-4 text-white font-bold text-lg shadow-lg transition-all active:scale-[0.98]',
          availableQuestions.length > 0
            ? 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 hover:shadow-xl'
            : 'bg-gray-300 cursor-not-allowed'
        )}
      >
        开始答题 🚀
      </button>
    </div>
  );
}

function QuizQuestionView({
  question,
  questionIndex,
  totalQuestions,
  selectedOptionId,
  showFeedback,
  isCorrect,
  sessionCorrect,
  sessionAnswered,
  animating,
  onOptionClick,
  onNext,
}: {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  selectedOptionId: string | null;
  showFeedback: boolean;
  isCorrect: boolean;
  sessionCorrect: number;
  sessionAnswered: number;
  animating: boolean;
  onOptionClick: (id: string) => void;
  onNext: () => void;
}) {
  const progress = (questionIndex / totalQuestions) * 100;

  return (
    <div className={cn(
      'mx-auto max-w-2xl px-4 pb-10 pt-4 transition-opacity duration-300',
      animating && 'opacity-0'
    )}>
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-gray-600">
            第 {questionIndex} / {totalQuestions} 题
          </span>
          <span className="text-sm text-green-600 font-bold">
            ✅ {sessionCorrect} / {sessionAnswered}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="rounded-3xl bg-white shadow-xl overflow-hidden border-4 border-white mb-5">
        <div
          className={cn(
            'p-4 text-center',
            question.type === 'emotion'
              ? 'bg-gradient-to-r from-yellow-100 to-pink-100'
              : 'bg-gradient-to-r from-cyan-100 to-purple-100'
          )}
        >
          <span className="text-xs px-3 py-1 rounded-full bg-white/70 font-bold text-gray-600">
            {question.type === 'emotion' ? '😊 情绪识别' : '🎭 情境应对'}
          </span>
        </div>
        <div className="p-6">
          {question.emoji && (
            <div className="text-center text-7xl mb-4 animate-bounce-slow">
              {question.emoji}
            </div>
          )}
          <p className="text-xl font-bold text-gray-800 text-center leading-relaxed">
            {question.question}
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-5">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          let borderColor = 'border-gray-200';
          let bgClass = 'bg-white';
          let extraEmoji = '';
          if (showFeedback && isSelected) {
            if (option.isCorrect) {
              borderColor = 'border-green-400';
              bgClass = 'bg-green-50';
              extraEmoji = '✅';
            } else {
              borderColor = 'border-red-400';
              bgClass = 'bg-red-50';
              extraEmoji = '❌';
            }
          } else if (showFeedback && option.isCorrect) {
            borderColor = 'border-green-300';
            bgClass = 'bg-green-50/50';
            extraEmoji = '💡';
          }
          return (
            <button
              key={option.id}
              onClick={() => onOptionClick(option.id)}
              disabled={showFeedback}
              className={cn(
                'w-full rounded-2xl p-4 text-left border-2 transition-all shadow-md active:scale-[0.98]',
                bgClass,
                borderColor,
                !showFeedback && 'hover:bg-gray-50 hover:border-gray-300',
                isSelected && !showFeedback && 'ring-4 ring-cyan-200 scale-[1.01]'
              )}
            >
              <div className="flex items-center gap-3">
                {option.emoji && (
                  <span className="text-3xl w-10 text-center">{option.emoji}</span>
                )}
                <span className="text-base text-gray-700 font-medium flex-1">
                  {option.text}
                </span>
                {extraEmoji && (
                  <span className="text-2xl animate-pop-in">{extraEmoji}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div
          className={cn(
            'rounded-2xl p-5 border-2 mb-5 animate-fade-in',
            isCorrect
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
              : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300'
          )}
        >
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'text-5xl animate-wiggle',
                isCorrect && 'animate-bounce-slow'
              )}
            >
              {isCorrect ? '🎉' : '💪'}
            </div>
            <div className="flex-1">
              <p
                className={cn(
                  'text-xl font-bold mb-2',
                  isCorrect ? 'text-green-700' : 'text-orange-700'
                )}
              >
                {isCorrect ? '太棒了！答对啦~' : '没关系，下次再加油！'}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {showFeedback && (
        <button
          onClick={onNext}
          className="w-full rounded-full py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold text-lg shadow-lg transition-all hover:from-cyan-500 hover:to-blue-600 hover:shadow-xl active:scale-[0.98]"
        >
          {questionIndex >= totalQuestions ? '查看成绩 🎊' : '下一题 →'}
        </button>
      )}
    </div>
  );
}

function QuizResult({
  correct,
  total,
  totalAnswered,
  overallCorrect,
  accuracy,
  onRetry,
  onBackToMenu,
}: {
  correct: number;
  total: number;
  totalAnswered: number;
  overallCorrect: number;
  accuracy: number;
  onRetry: () => void;
  onBackToMenu: () => void;
}) {
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  let medal = '🌟';
  let title = '继续努力！';
  let subtitle = '多练习几次就会越来越棒~';
  if (percentage >= 100) {
    medal = '🏆';
    title = '完美通关！';
    subtitle = '你是情绪小专家！太厉害了！';
  } else if (percentage >= 80) {
    medal = '🥇';
    title = '非常优秀！';
    subtitle = '你对情绪了解得很好~';
  } else if (percentage >= 60) {
    medal = '🥈';
    title = '做得不错！';
    subtitle = '再练一练会更厉害！';
  } else if (percentage >= 40) {
    medal = '🥉';
    title = '还可以哦！';
    subtitle = '继续学习，你会越来越棒的！';
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-10 pt-4">
      <div className="rounded-3xl bg-white shadow-xl overflow-hidden border-4 border-white animate-fade-in">
        <div className="bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 p-8 text-center text-white">
          <div className="text-7xl mb-4 animate-bounce">{medal}</div>
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <p className="text-white/90">{subtitle}</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl p-4 text-center bg-green-50 border-2 border-green-200">
              <div className="text-4xl mb-1">🎯</div>
              <div className="text-3xl font-bold text-green-600">
                {correct} / {total}
              </div>
              <div className="text-xs text-gray-500 mt-1">本轮答对</div>
            </div>
            <div className="rounded-2xl p-4 text-center bg-blue-50 border-2 border-blue-200">
              <div className="text-4xl mb-1">📊</div>
              <div className="text-3xl font-bold text-blue-600">{percentage}%</div>
              <div className="text-xs text-gray-500 mt-1">本轮正确率</div>
            </div>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 mb-6 border border-gray-100">
            <p className="text-xs text-gray-500 mb-2 text-center">📈 累计数据</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-lg font-bold text-gray-700">{totalAnswered}</div>
                <div className="text-xs text-gray-400">总答题</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">{overallCorrect}</div>
                <div className="text-xs text-gray-400">总正确</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-500">{accuracy}%</div>
                <div className="text-xs text-gray-400">总正确率</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onRetry}
              className="w-full rounded-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold shadow-lg transition-all hover:from-cyan-500 hover:to-blue-600 active:scale-[0.98]"
            >
              🔄 再来一组
            </button>
            <button
              onClick={onBackToMenu}
              className="w-full rounded-full py-3 bg-white text-gray-700 font-bold border-2 border-gray-200 transition-all hover:bg-gray-50 active:scale-[0.98]"
            >
              📋 返回菜单
            </button>
            <Link
              to="/"
              className="block w-full rounded-full py-3 bg-white text-gray-500 font-bold border border-gray-100 transition-all hover:bg-gray-50 active:scale-[0.98] text-center"
            >
              🏠 返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
