export const speakText = (text: string): void => {
  if (!('speechSynthesis' in window)) {
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.9;
  utterance.pitch = 1.1;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getTodayStr = (): string => {
  return formatDate(new Date());
};

export const getWeekdayName = (dateStr: string): string => {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const date = new Date(dateStr);
  return weekdays[date.getDay()];
};

export const getMonthDays = (year: number, month: number): (string | null)[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startWeekday = firstDay.getDay();
  
  const result: (string | null)[] = [];
  for (let i = 0; i < startWeekday; i++) {
    result.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    result.push(formatDate(date));
  }
  return result;
};
