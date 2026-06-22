export interface Emotion {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  gradientFrom: string;
  gradientTo: string;
  tips: string;
  copingMethods: { icon: string; text: string }[];
}

export interface Situation {
  id: string;
  title: string;
  emoji: string;
  description: string;
  correctEmotions: string[];
  knowledge: string;
  bgGradient: string;
}

export interface DiaryEntry {
  date: string;
  emotionId: string;
  drawing: string;
  note: string;
}

export interface BreathingStats {
  totalStars: number;
  completedSessions: number;
}

export const EMOTIONS: Emotion[] = [
  {
    id: 'happy',
    name: '开心',
    emoji: '😄',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    gradientFrom: 'from-yellow-300',
    gradientTo: 'to-orange-300',
    tips: '开心是一种非常棒的感觉！和家人朋友分享你的快乐吧！',
    copingMethods: [
      { icon: '🎉', text: '和朋友分享快乐' },
      { icon: '📝', text: '记录开心的事情' },
      { icon: '🎵', text: '唱首快乐的歌' }
    ]
  },
  {
    id: 'sad',
    name: '难过',
    emoji: '😢',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    gradientFrom: 'from-blue-300',
    gradientTo: 'to-indigo-300',
    tips: '难过是正常的，想哭就哭出来，告诉爸爸妈妈你的感受。',
    copingMethods: [
      { icon: '💬', text: '告诉大人你的感受' },
      { icon: '🤗', text: '抱抱喜欢的玩具' },
      { icon: '🐻', text: '找好朋友倾诉' }
    ]
  },
  {
    id: 'angry',
    name: '生气',
    emoji: '😠',
    color: '#EF4444',
    bgColor: '#FEE2E2',
    gradientFrom: 'from-red-300',
    gradientTo: 'to-pink-300',
    tips: '生气的时候先深呼吸，让自己平静下来再说话。',
    copingMethods: [
      { icon: '🌬️', text: '深呼吸三次' },
      { icon: '🔢', text: '从1数到10' },
      { icon: '👨‍👩‍👧', text: '找大人帮忙' }
    ]
  },
  {
    id: 'scared',
    name: '害怕',
    emoji: '😨',
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    gradientFrom: 'from-purple-300',
    gradientTo: 'to-violet-300',
    tips: '害怕的时候可以深呼吸，告诉自己：我很勇敢！',
    copingMethods: [
      { icon: '💪', text: '告诉自己我很勇敢' },
      { icon: '🏠', text: '找大人陪着你' },
      { icon: '⭐', text: '想想开心的事情' }
    ]
  },
  {
    id: 'surprised',
    name: '惊讶',
    emoji: '😮',
    color: '#06B6D4',
    bgColor: '#CFFAFE',
    gradientFrom: 'from-cyan-300',
    gradientTo: 'to-teal-300',
    tips: '惊讶的时候说明有新事情发生，保持好奇心去探索吧！',
    copingMethods: [
      { icon: '🤔', text: '仔细观察一下' },
      { icon: '❓', text: '问问爸爸妈妈' },
      { icon: '🔍', text: '慢慢地去了解' }
    ]
  },
  {
    id: 'calm',
    name: '平静',
    emoji: '😊',
    color: '#10B981',
    bgColor: '#D1FAE5',
    gradientFrom: 'from-green-300',
    gradientTo: 'to-emerald-300',
    tips: '平静的感觉真好！享受这份安宁，读一本书或听音乐吧。',
    copingMethods: [
      { icon: '📚', text: '读一本喜欢的书' },
      { icon: '🎶', text: '听听轻音乐' },
      { icon: '🌳', text: '去户外走走' }
    ]
  }
];

export const SITUATIONS: Situation[] = [
  {
    id: 'stolen-toy',
    title: '玩具被抢了',
    emoji: '🧸',
    description: '小朋友正在玩你最喜欢的玩具，没有经过你的同意就拿走了...',
    correctEmotions: ['angry', 'sad'],
    knowledge: '玩具被抢时，感到生气或难过都是正常的！你可以告诉对方："这是我的玩具，请还给我"，或者请大人帮忙。记住：用语言表达比用行动更好哦！',
    bgGradient: 'from-red-100 to-orange-100'
  },
  {
    id: 'received-gift',
    title: '收到礼物',
    emoji: '🎁',
    description: '生日那天，爸爸妈妈送给你一个特别的礼物，打开一看是你想要很久的玩具...',
    correctEmotions: ['happy', 'surprised'],
    knowledge: '收到喜欢的礼物时，感到开心和惊讶是很自然的！记得对送你礼物的人说声"谢谢"，你的感谢会让他们也很开心！',
    bgGradient: 'from-yellow-100 to-pink-100'
  },
  {
    id: 'alone-at-home',
    title: '独自在家',
    emoji: '🏠',
    description: '爸爸妈妈出门了，你一个人待在家里，天色渐渐暗了下来...',
    correctEmotions: ['scared'],
    knowledge: '独自在家时感到害怕是很正常的！可以打开灯，做些自己喜欢的事情，比如画画或听故事。如果真的很害怕，可以给爸爸妈妈打电话。',
    bgGradient: 'from-purple-100 to-indigo-100'
  },
  {
    id: 'made-mistake',
    title: '做错事情了',
    emoji: '😰',
    description: '你不小心打碎了家里的花瓶，爸爸妈妈还不知道...',
    correctEmotions: ['scared', 'sad'],
    knowledge: '做错事情时感到害怕或难过是正常的！勇敢地告诉爸爸妈妈事情的经过，他们会帮助你的。每个人都会犯错，重要的是从错误中学习。',
    bgGradient: 'from-blue-100 to-purple-100'
  },
  {
    id: 'lost-game',
    title: '输掉了比赛',
    emoji: '🏆',
    description: '你和小伙伴比赛跑步，结果你输了...',
    correctEmotions: ['sad', 'angry'],
    knowledge: '比赛输了会感到难过，这完全可以理解！但记住：参与比输赢更重要。下次再努力练习，一定会有进步！给获胜的小伙伴鼓掌也是很棒的哦。',
    bgGradient: 'from-gray-100 to-blue-100'
  },
  {
    id: 'new-school',
    title: '第一天去新学校',
    emoji: '🎒',
    description: '今天是你去新学校的第一天，周围都是不认识的同学...',
    correctEmotions: ['scared', 'surprised'],
    knowledge: '到新环境感到紧张是正常的！试着对同学微笑，主动打招呼。你会发现，大家都很想和你交朋友。深呼吸，勇敢地迈出第一步！',
    bgGradient: 'from-teal-100 to-cyan-100'
  },
  {
    id: 'shared-snack',
    title: '分享零食',
    emoji: '🍪',
    description: '你把自己最喜欢的零食分给了朋友，朋友开心地说谢谢...',
    correctEmotions: ['happy', 'calm'],
    knowledge: '分享会让我们感到快乐！当你把好东西分给别人时，不仅别人开心，你自己也会获得满满的幸福感。这就是"给予的快乐"！',
    bgGradient: 'from-green-100 to-yellow-100'
  },
  {
    id: 'quiet-time',
    title: '安静的午后',
    emoji: '🌤️',
    description: '午后阳光正好，你坐在窗边静静地看书，世界很安静...',
    correctEmotions: ['calm', 'happy'],
    knowledge: '感到平静的时候很珍贵！这种感觉能帮助我们恢复精力。可以试着做些安静的活动，比如画画、看书或听音乐，享受这份宁静。',
    bgGradient: 'from-green-100 to-blue-100'
  }
];

export const BREATHING_PHASES = [
  { name: '吸气', duration: 4000, scale: 1.5, instruction: '慢慢吸气...' },
  { name: '屏息', duration: 2000, scale: 1.5, instruction: '屏住呼吸...' },
  { name: '呼气', duration: 6000, scale: 1, instruction: '慢慢呼气...' }
];
