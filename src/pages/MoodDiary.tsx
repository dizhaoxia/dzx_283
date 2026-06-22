import { useState, useRef, useEffect } from 'react';
import { EMOTIONS, DiaryEntry } from '@/data/constants';
import NavBar from '@/components/NavBar';
import { useEmotionStore } from '@/store/useEmotionStore';
import { getTodayStr, getMonthDays, formatDate } from '@/utils';
import { cn } from '@/lib/utils';

const COLORS = ['#F472B6', '#FB923C', '#FACC15', '#4ADE80', '#38BDF8', '#A78BFA', '#F87171', '#1F2937'];
const BRUSH_SIZES = [3, 6, 10, 16];

export default function MoodDiary() {
  const [activeTab, setActiveTab] = useState<'write' | 'history'>('write');

  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [note, setNote] = useState('');
  const [brushColor, setBrushColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(BRUSH_SIZES[1]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const { addDiaryEntry, getDiaryEntry, diaryEntries } = useEmotionStore();

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawingRef.current = true;
    lastPosRef.current = getCanvasPos(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawingRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const pos = getCanvasPos(e);
    const lastPos = lastPosRef.current;
    if (lastPos) {
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    lastPosRef.current = pos;
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
  };

  const handleSave = () => {
    if (!selectedEmotion) {
      alert('请先选择今日心情哦~');
      return;
    }
    const canvas = canvasRef.current;
    const drawing = canvas ? canvas.toDataURL() : '';
    const entry: DiaryEntry = {
      date: getTodayStr(),
      emotionId: selectedEmotion,
      drawing,
      note,
    };
    addDiaryEntry(entry);
    alert('日记保存成功！✨');
    setNote('');
    clearCanvas();
    setSelectedEmotion('');
  };

  const days = getMonthDays(viewYear, viewMonth);
  const selectedEntry = getDiaryEntry(selectedDate);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const getEmotionById = (id: string) => EMOTIONS.find((e) => e.id === id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
      <NavBar title="心情日记" />

      <div className="flex mx-4 mt-4 rounded-2xl bg-white shadow-lg overflow-hidden">
        <button
          onClick={() => setActiveTab('write')}
          className={cn(
            'flex-1 py-3 text-center font-bold transition-all font-cute',
            activeTab === 'write'
              ? 'bg-gradient-to-r from-pink-300 to-purple-300 text-white'
              : 'text-gray-500 hover:bg-pink-50'
          )}
        >
          ✏️ 写日记
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            'flex-1 py-3 text-center font-bold transition-all font-cute',
            activeTab === 'history'
              ? 'bg-gradient-to-r from-blue-300 to-cyan-300 text-white'
              : 'text-gray-500 hover:bg-blue-50'
          )}
        >
          📅 看历史
        </button>
      </div>

      {activeTab === 'write' ? (
        <div className="p-4 space-y-5 animate-fade-in">
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <h3 className="text-base font-bold text-purple-700 mb-3 font-cute">🌈 今天的心情是？</h3>
            <div className="grid grid-cols-6 gap-2">
              {EMOTIONS.map((emotion) => (
                <button
                  key={emotion.id}
                  onClick={() => setSelectedEmotion(emotion.id)}
                  className={cn(
                    'flex flex-col items-center py-3 rounded-xl transition-all active:scale-95',
                    selectedEmotion === emotion.id
                      ? 'bg-gradient-to-b from-purple-100 to-pink-100 ring-2 ring-purple-400 shadow-md scale-105'
                      : 'bg-gray-50 hover:bg-purple-50'
                  )}
                >
                  <span className="text-2xl">{emotion.emoji}</span>
                  <span className="text-xs mt-1 text-gray-600 font-cute">{emotion.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md">
            <h3 className="text-base font-bold text-purple-700 mb-3 font-cute">🎨 画下你的心情</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600 font-cute">颜色:</span>
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setBrushColor(color)}
                    className={cn(
                      'w-8 h-8 rounded-full transition-all',
                      brushColor === color ? 'ring-2 ring-offset-2 ring-purple-400 scale-110' : ''
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 font-cute">粗细:</span>
                {BRUSH_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setBrushSize(size)}
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-lg transition-all',
                      brushSize === size ? 'bg-purple-200 ring-2 ring-purple-400' : 'bg-gray-100 hover:bg-purple-100'
                    )}
                  >
                    <div
                      className="rounded-full bg-gray-700"
                      style={{ width: size * 1.5, height: size * 1.5 }}
                    />
                  </button>
                ))}
                <button
                  onClick={clearCanvas}
                  className="ml-auto px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl text-sm font-bold transition-all active:scale-95 font-cute"
                >
                  🗑️ 清空
                </button>
              </div>
              <div className="border-2 border-dashed border-purple-200 rounded-xl overflow-hidden bg-white">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-48 touch-none cursor-crosshair"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md">
            <h3 className="text-base font-bold text-purple-700 mb-3 font-cute">📝 写点什么吧</h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="今天发生了什么有趣的事情呢？"
              className="w-full h-28 p-3 border-2 border-purple-100 rounded-xl resize-none focus:outline-none focus:border-purple-300 bg-purple-50/30 font-cute"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full py-4 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all font-cute"
          >
            💾 保存日记
          </button>
        </div>
      ) : (
        <div className="p-4 space-y-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 hover:bg-purple-200 active:scale-95 transition-all"
              >
                <span className="text-lg">←</span>
              </button>
              <h3 className="text-lg font-bold text-purple-700 font-cute">
                {viewYear}年{viewMonth + 1}月
              </h3>
              <button
                onClick={nextMonth}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 hover:bg-purple-200 active:scale-95 transition-all"
              >
                <span className="text-lg">→</span>
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
                <div key={day} className="py-2 text-sm font-bold text-gray-400 font-cute">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((dateStr, idx) => {
                if (!dateStr) {
                  return <div key={idx} className="aspect-square" />;
                }
                const entry = getDiaryEntry(dateStr);
                const emotion = entry ? getEmotionById(entry.emotionId) : null;
                const isSelected = dateStr === selectedDate;
                const isToday = dateStr === getTodayStr();
                const dayNum = new Date(dateStr).getDate();
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(dateStr)}
                    className={cn(
                      'aspect-square flex flex-col items-center justify-center rounded-xl transition-all active:scale-95',
                      isSelected
                        ? 'bg-gradient-to-b from-purple-200 to-pink-200 ring-2 ring-purple-400 shadow-md'
                        : emotion
                        ? 'bg-purple-50 hover:bg-purple-100'
                        : 'hover:bg-gray-50',
                      isToday && !isSelected ? 'ring-1 ring-pink-300' : ''
                    )}
                  >
                    <span className={cn(
                      'text-sm font-cute',
                      isSelected ? 'text-purple-800 font-bold' : 'text-gray-600'
                    )}>
                      {dayNum}
                    </span>
                    {emotion && <span className="text-lg">{emotion.emoji}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md">
            <h3 className="text-base font-bold text-purple-700 mb-3 font-cute">
              📖 {formatDate(new Date(selectedDate))} 的日记
            </h3>
            {selectedEntry ? (
              <div className="space-y-4 animate-slide-up">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50">
                  <span className="text-4xl">{getEmotionById(selectedEntry.emotionId)?.emoji}</span>
                  <div>
                    <p className="font-bold text-purple-700 font-cute">
                      {getEmotionById(selectedEntry.emotionId)?.name}
                    </p>
                    <p className="text-sm text-gray-500 font-cute">今天的心情</p>
                  </div>
                </div>
                {selectedEntry.drawing && (
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-2 font-cute">🎨 心情涂鸦</p>
                    <img
                      src={selectedEntry.drawing}
                      alt="drawing"
                      className="w-full rounded-xl border-2 border-dashed border-purple-200 bg-white max-h-48 object-contain"
                    />
                  </div>
                )}
                {selectedEntry.note && (
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-2 font-cute">📝 心情笔记</p>
                    <p className="p-3 bg-purple-50/50 rounded-xl text-gray-700 leading-relaxed font-cute whitespace-pre-wrap">
                      {selectedEntry.note}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-10 text-center">
                <span className="text-5xl">🌱</span>
                <p className="mt-3 text-gray-400 font-cute">这一天还没有记录哦~</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
