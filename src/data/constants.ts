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

export interface StoryChoice {
  id: string;
  text: string;
  emotionId: string;
  isCorrect: boolean;
  feedback: string;
}

export interface StoryNode {
  id: string;
  text: string;
  image?: string;
  choices?: StoryChoice[];
  nextNodeId?: string;
  isEnd?: boolean;
  emotionPoints?: string[];
}

export interface Story {
  id: string;
  title: string;
  emoji: string;
  description: string;
  emotions: string[];
  bgGradient: string;
  nodes: StoryNode[];
}

export const STORIES: Story[] = [
  {
    id: 'lost-kitten',
    title: '迷路的小猫',
    emoji: '🐱',
    description: '小猫咪咪在公园迷路了，它能找到回家的路吗？',
    emotions: ['scared', 'sad', 'happy'],
    bgGradient: 'from-orange-100 to-pink-100',
    nodes: [
      {
        id: 's1-n1',
        text: '阳光明媚的一天，小猫咪咪跟着妈妈去公园散步。公园里有好多漂亮的花和蝴蝶，咪咪看得入迷了...',
        nextNodeId: 's1-n2',
        emotionPoints: [],
      },
      {
        id: 's1-n2',
        text: '咪咪追着一只漂亮的蝴蝶跑啊跑，等它停下来的时候，发现妈妈不见了！周围都是不认识的人...',
        choices: [
          {
            id: 'c1',
            text: '咪咪感到害怕，想哭 😨',
            emotionId: 'scared',
            isCorrect: true,
            feedback: '对啦！在陌生的地方找不到妈妈，感到害怕是很正常的~',
          },
          {
            id: 'c2',
            text: '咪咪很开心，因为可以自己玩了 😄',
            emotionId: 'happy',
            isCorrect: false,
            feedback: '再想想~ 找不到妈妈的时候，小猫会是什么心情呢？',
          },
          {
            id: 'c3',
            text: '咪咪很惊讶，因为蝴蝶飞走了 😮',
            emotionId: 'surprised',
            isCorrect: false,
            feedback: '不是哦~ 找不到妈妈才是最让咪咪担心的事情呢。',
          },
        ],
        emotionPoints: ['scared'],
      },
      {
        id: 's1-n3',
        text: '咪咪坐在路边，想起妈妈说过：如果迷路了，就在原地等，或者找穿制服的叔叔阿姨帮忙。',
        nextNodeId: 's1-n4',
        emotionPoints: [],
      },
      {
        id: 's1-n4',
        text: '这时，一位保安叔叔走了过来，问咪咪怎么了。咪咪鼓起勇气告诉叔叔自己迷路了...',
        choices: [
          {
            id: 'c4',
            text: '咪咪感到难过，因为它想妈妈了 😢',
            emotionId: 'sad',
            isCorrect: true,
            feedback: '说得对！想念妈妈的时候，心里会酸酸的，这就是难过的感觉。',
          },
          {
            id: 'c5',
            text: '咪咪很生气，因为蝴蝶害它迷路了 😠',
            emotionId: 'angry',
            isCorrect: false,
            feedback: '再想想~ 咪咪现在最想的是什么呢？',
          },
          {
            id: 'c6',
            text: '咪咪很平静，因为有叔叔帮忙 😊',
            emotionId: 'calm',
            isCorrect: false,
            feedback: '有叔叔帮忙确实让人安心，但咪咪心里还是想念妈妈哦~',
          },
        ],
        emotionPoints: ['sad'],
      },
      {
        id: 's1-n5',
        text: '保安叔叔带着咪咪找到了公园的广播室，用大喇叭喊："请咪咪的妈妈快来广播室！"',
        nextNodeId: 's1-n6',
        emotionPoints: [],
      },
      {
        id: 's1-n6',
        text: '不一会儿，妈妈就跑来了！咪咪扑进妈妈的怀里，妈妈紧紧地抱住了它。',
        choices: [
          {
            id: 'c7',
            text: '咪咪感到非常开心！😄',
            emotionId: 'happy',
            isCorrect: true,
            feedback: '太棒了！和妈妈团聚的感觉真开心！你答对了~',
          },
          {
            id: 'c8',
            text: '咪咪感到惊讶，因为妈妈来得太快了 😮',
            emotionId: 'surprised',
            isCorrect: false,
            feedback: '妈妈确实来得很快，但咪咪现在最主要的心情是...？',
          },
          {
            id: 'c9',
            text: '咪咪感到害怕，因为妈妈会骂它 😨',
            emotionId: 'scared',
            isCorrect: false,
            feedback: '不会的~ 妈妈看到咪咪安全，只会开心，不会骂它的。',
          },
        ],
        emotionPoints: ['happy'],
      },
      {
        id: 's1-n7',
        text: '回家的路上，妈妈告诉咪咪："下次出门要拉好妈妈的手哦。不过你今天很勇敢，知道找大人帮忙！" 咪咪开心地点点头。',
        isEnd: true,
        emotionPoints: ['happy'],
      },
    ],
  },
  {
    id: 'birthday-gift',
    title: '特别的生日礼物',
    emoji: '🎁',
    description: '小明期待已久的生日礼物，会是什么呢？',
    emotions: ['surprised', 'happy', 'sad'],
    bgGradient: 'from-yellow-100 to-purple-100',
    nodes: [
      {
        id: 's2-n1',
        text: '明天就是小明的生日了！小明一直想要一辆新的滑板车，他盼啊盼，希望能收到这个礼物。',
        nextNodeId: 's2-n2',
        emotionPoints: [],
      },
      {
        id: 's2-n2',
        text: '生日当天，爸爸妈妈拿出一个大大的礼物盒，小明兴奋地打开...',
        choices: [
          {
            id: 'c10',
            text: '小明感到很惊讶，因为盒子好大！😮',
            emotionId: 'surprised',
            isCorrect: true,
            feedback: '没错！看到这么大的礼物盒，小明眼睛都睁大了，这就是惊讶的表情~',
          },
          {
            id: 'c11',
            text: '小明很平静，因为他早就知道了 😊',
            emotionId: 'calm',
            isCorrect: false,
            feedback: '再想想~ 收到生日礼物的时候，通常是什么心情呢？',
          },
          {
            id: 'c12',
            text: '小明很生气，因为包装太难看了 😠',
            emotionId: 'angry',
            isCorrect: false,
            feedback: '不会的~ 生日礼物都是用心准备的，小明不会因为包装生气的。',
          },
        ],
        emotionPoints: ['surprised'],
      },
      {
        id: 's2-n3',
        text: '打开盒子，里面是一套积木！不是滑板车。小明看着积木，心里有点闷闷的...',
        choices: [
          {
            id: 'c13',
            text: '小明感到有点难过 😢',
            emotionId: 'sad',
            isCorrect: true,
            feedback: '对呀~ 没有收到想要的礼物，会感到有点失落和难过，这是正常的。',
          },
          {
            id: 'c14',
            text: '小明很开心，因为积木也很好玩 😄',
            emotionId: 'happy',
            isCorrect: false,
            feedback: '虽然积木也很好玩，但没有收到最想要的滑板车，小明心里会是什么感觉呢？',
          },
          {
            id: 'c15',
            text: '小明很害怕，因为积木太多了 😨',
            emotionId: 'scared',
            isCorrect: false,
            feedback: '积木不会让小明害怕的~ 再想想看。',
          },
        ],
        emotionPoints: ['sad'],
      },
      {
        id: 's2-n4',
        text: '爸爸好像看出了小明的心思，说："我们一起来拼积木吧，可以拼出你想要的滑板车哦！"',
        nextNodeId: 's2-n5',
        emotionPoints: [],
      },
      {
        id: 's2-n5',
        text: '小明和爸爸一起拼啊拼，拼出了一辆超级酷的积木滑板车！比真的滑板车还有意思呢！',
        choices: [
          {
            id: 'c16',
            text: '小明感到很开心！😄',
            emotionId: 'happy',
            isCorrect: true,
            feedback: '完全正确！和爸爸一起做出来的东西，比买的还要开心呢！',
          },
          {
            id: 'c17',
            text: '小明很惊讶，因为积木真的能拼出滑板车 😮',
            emotionId: 'surprised',
            isCorrect: false,
            feedback: '是有点惊讶，但小明现在最重要的心情是...？',
          },
          {
            id: 'c18',
            text: '小明很平静，因为他早就知道了 😊',
            emotionId: 'calm',
            isCorrect: false,
            feedback: '再想想~ 通过自己努力拼出滑板车，是什么感觉呢？',
          },
        ],
        emotionPoints: ['happy'],
      },
      {
        id: 's2-n6',
        text: '那天晚上，小明想："原来不是只有想要的东西才能让人开心，和家人一起做事情也很快乐！" 他抱着积木滑板车，甜甜地睡着了。',
        isEnd: true,
        emotionPoints: ['happy'],
      },
    ],
  },
  {
    id: 'brave-little-bird',
    title: '勇敢的小小鸟',
    emoji: '🐦',
    description: '小小鸟要学习飞翔了，它能克服恐惧吗？',
    emotions: ['scared', 'angry', 'happy', 'surprised'],
    bgGradient: 'from-sky-100 to-green-100',
    nodes: [
      {
        id: 's3-n1',
        text: '在一棵高高的大树上，住着小小鸟一家。小小鸟的哥哥姐姐都已经会飞了，只有它还不敢飞出鸟巢。',
        nextNodeId: 's3-n2',
        emotionPoints: [],
      },
      {
        id: 's3-n2',
        text: '妈妈说："小小鸟，来试试飞吧，很有趣的！" 小小鸟探出头往下看，好高啊...',
        choices: [
          {
            id: 'c19',
            text: '小小鸟感到害怕，不敢飞 😨',
            emotionId: 'scared',
            isCorrect: true,
            feedback: '对的！站在高高的地方往下看，感到害怕是很正常的，每个人都会有害怕的事情。',
          },
          {
            id: 'c20',
            text: '小小鸟很开心，因为终于可以飞了 😄',
            emotionId: 'happy',
            isCorrect: false,
            feedback: '再想想~ 还不会飞的小鸟，看着高高的树，会是什么感觉呢？',
          },
          {
            id: 'c21',
            text: '小小鸟很生气，因为妈妈催它 😠',
            emotionId: 'angry',
            isCorrect: false,
            feedback: '妈妈只是在鼓励小小鸟，没有催它哦~ 再想想。',
          },
        ],
        emotionPoints: ['scared'],
      },
      {
        id: 's3-n3',
        text: '哥哥姐姐们在下面喊："快下来呀！下面有好多好吃的果子！" 小小鸟还是摇摇头，退回了鸟巢里。',
        nextNodeId: 's3-n4',
        emotionPoints: [],
      },
      {
        id: 's3-n4',
        text: '突然，一阵风吹过来，把鸟巢吹得晃了晃！小小鸟站不稳，一下子掉了下去！',
        choices: [
          {
            id: 'c22',
            text: '小小鸟非常害怕，翅膀都软了 😨',
            emotionId: 'scared',
            isCorrect: true,
            feedback: '说得对！突然掉下去，小小鸟肯定吓坏了！',
          },
          {
            id: 'c23',
            text: '小小鸟很生气，都是风的错！😠',
            emotionId: 'angry',
            isCorrect: false,
            feedback: '虽然风确实不对，但小小鸟现在最主要的心情是什么呢？',
          },
          {
            id: 'c24',
            text: '小小鸟很惊讶，怎么突然掉下去了 😮',
            emotionId: 'surprised',
            isCorrect: false,
            feedback: '是很突然，但比惊讶更强烈的感觉是什么呢？',
          },
        ],
        emotionPoints: ['scared'],
      },
      {
        id: 's3-n5',
        text: '"快拍翅膀！" 妈妈在下面喊。小小鸟用力拍动翅膀... 咦？它没有掉得更快，反而慢下来了！',
        choices: [
          {
            id: 'c25',
            text: '小小鸟很惊讶，原来自己可以飞！😮',
            emotionId: 'surprised',
            isCorrect: true,
            feedback: '太棒了！发现自己居然会飞，小小鸟又惊讶又开心！',
          },
          {
            id: 'c26',
            text: '小小鸟很生气，为什么才发现 😠',
            emotionId: 'angry',
            isCorrect: false,
            feedback: '不会的~ 小小鸟现在应该是惊喜的感觉。',
          },
          {
            id: 'c27',
            text: '小小鸟很害怕，还是会掉下去 😨',
            emotionId: 'scared',
            isCorrect: false,
            feedback: '小小鸟已经在飞了，不会掉下去啦~ 再想想它的心情。',
          },
        ],
        emotionPoints: ['surprised', 'happy'],
      },
      {
        id: 's3-n6',
        text: '小小鸟越飞越熟练，它飞过草地，飞过小河，看到了好多美丽的风景。原来飞翔这么有趣！',
        nextNodeId: 's3-n7',
        emotionPoints: ['happy'],
      },
      {
        id: 's3-n7',
        text: '晚上回到家，小小鸟骄傲地说："我会飞啦！" 妈妈笑着说："你看，只要勇敢尝试，就能发现自己有多棒！"',
        isEnd: true,
        emotionPoints: ['happy'],
      },
    ],
  },
  {
    id: 'sharing-toys',
    title: '分享的快乐',
    emoji: '🧸',
    description: '乐乐有了新玩具，他愿意和朋友分享吗？',
    emotions: ['angry', 'sad', 'happy', 'surprised'],
    bgGradient: 'from-pink-100 to-yellow-100',
    nodes: [
      {
        id: 's4-n1',
        text: '乐乐过生日，收到了一个超级酷的变形金刚玩具！这是他盼了好久的礼物，他开心极了。',
        nextNodeId: 's4-n2',
        emotionPoints: ['happy'],
      },
      {
        id: 's4-n2',
        text: '第二天，邻居小明来家里玩。小明看到了变形金刚，眼睛都亮了："哇！好酷！能借我玩一下吗？"',
        choices: [
          {
            id: 'c28',
            text: '乐乐有点不开心，不想借给别人 😠',
            emotionId: 'angry',
            isCorrect: true,
            feedback: '对呀~ 这是乐乐的新玩具，他还没玩够呢，不想借给别人是很正常的。',
          },
          {
            id: 'c29',
            text: '乐乐很开心，马上借给小明 😄',
            emotionId: 'happy',
            isCorrect: false,
            feedback: '虽然分享是好事，但新玩具舍不得也是正常的~ 再想想。',
          },
          {
            id: 'c30',
            text: '乐乐很惊讶，小明也喜欢这个玩具 😮',
            emotionId: 'surprised',
            isCorrect: false,
            feedback: '小明喜欢是正常的，但乐乐的心情是什么呢？',
          },
        ],
        emotionPoints: ['angry'],
      },
      {
        id: 's4-n3',
        text: '乐乐皱着眉头，把玩具抱在怀里。小明看到了，有点失落地低下头...',
        choices: [
          {
            id: 'c31',
            text: '乐乐看到小明难过，心里也有点不舒服 😢',
            emotionId: 'sad',
            isCorrect: true,
            feedback: '说得好！看到好朋友不开心，自己心里也会不好受，这就是共情的能力~',
          },
          {
            id: 'c32',
            text: '乐乐很开心，玩具是自己的 😄',
            emotionId: 'happy',
            isCorrect: false,
            feedback: '再想想~ 看到好朋友不开心，乐乐会是什么感觉？',
          },
          {
            id: 'c33',
            text: '乐乐很生气，小明真讨厌 😠',
            emotionId: 'angry',
            isCorrect: false,
            feedback: '小明只是想玩玩具，不是讨厌的人哦~',
          },
        ],
        emotionPoints: ['sad'],
      },
      {
        id: 's4-n4',
        text: '乐乐想了想，走到小明身边说："我们一起玩吧！你当汽车人，我当霸天虎！"',
        nextNodeId: 's4-n5',
        emotionPoints: [],
      },
      {
        id: 's4-n5',
        text: '两个人一起玩变形金刚，你变飞机我变汽车，比一个人玩有意思多了！',
        choices: [
          {
            id: 'c34',
            text: '乐乐感到很开心，原来分享这么好玩！😄',
            emotionId: 'happy',
            isCorrect: true,
            feedback: '完全正确！和朋友一起分享，快乐会变成两倍呢！',
          },
          {
            id: 'c35',
            text: '乐乐很惊讶，两个人玩这么有意思 😮',
            emotionId: 'surprised',
            isCorrect: false,
            feedback: '是有点惊讶，但最主要的心情是什么呢？',
          },
          {
            id: 'c36',
            text: '乐乐很生气，小明玩得比自己好 😠',
            emotionId: 'angry',
            isCorrect: false,
            feedback: '一起玩是很开心的，不会生气的~',
          },
        ],
        emotionPoints: ['happy'],
      },
      {
        id: 's4-n6',
        text: '从那以后，乐乐经常和小明分享玩具。他发现：分享不是失去，而是得到更多的快乐！',
        isEnd: true,
        emotionPoints: ['happy'],
      },
    ],
  },
];

export interface QuizQuestion {
  id: string;
  type: 'emotion' | 'situation';
  question: string;
  emoji?: string;
  options: {
    id: string;
    text: string;
    emoji?: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'emotion',
    question: '图中这个表情是什么情绪？',
    emoji: '😄',
    options: [
      { id: 'q1-a', text: '难过', emoji: '😢', isCorrect: false },
      { id: 'q1-b', text: '开心', emoji: '😄', isCorrect: true },
      { id: 'q1-c', text: '生气', emoji: '😠', isCorrect: false },
      { id: 'q1-d', text: '害怕', emoji: '😨', isCorrect: false },
    ],
    explanation: '嘴角上扬，眼睛弯成月牙，这就是开心的表情！',
  },
  {
    id: 'q2',
    type: 'emotion',
    question: '这个表情是什么意思呢？',
    emoji: '😢',
    options: [
      { id: 'q2-a', text: '开心', emoji: '😄', isCorrect: false },
      { id: 'q2-b', text: '惊讶', emoji: '😮', isCorrect: false },
      { id: 'q2-c', text: '难过', emoji: '😢', isCorrect: true },
      { id: 'q2-d', text: '平静', emoji: '😊', isCorrect: false },
    ],
    explanation: '眼泪汪汪，嘴角往下，这是难过的表情。难过是正常的，哭出来会好一些~',
  },
  {
    id: 'q3',
    type: 'emotion',
    question: '看看这个表情，代表什么情绪？',
    emoji: '😠',
    options: [
      { id: 'q3-a', text: '害怕', emoji: '😨', isCorrect: false },
      { id: 'q3-b', text: '开心', emoji: '😄', isCorrect: false },
      { id: 'q3-c', text: '平静', emoji: '😊', isCorrect: false },
      { id: 'q3-d', text: '生气', emoji: '😠', isCorrect: true },
    ],
    explanation: '眉毛皱起来，嘴巴抿成一条线，这是生气的样子。生气的时候可以深呼吸！',
  },
  {
    id: 'q4',
    type: 'emotion',
    question: '这个表情是什么情绪呢？',
    emoji: '😨',
    options: [
      { id: 'q4-a', text: '害怕', emoji: '😨', isCorrect: true },
      { id: 'q4-b', text: '生气', emoji: '😠', isCorrect: false },
      { id: 'q4-c', text: '开心', emoji: '😄', isCorrect: false },
      { id: 'q4-d', text: '惊讶', emoji: '😮', isCorrect: false },
    ],
    explanation: '眼睛睁得大大的，身体有点发抖，这是害怕的感觉。害怕的时候可以找大人陪着你。',
  },
  {
    id: 'q5',
    type: 'emotion',
    question: '这个表情是什么意思？',
    emoji: '😮',
    options: [
      { id: 'q5-a', text: '难过', emoji: '😢', isCorrect: false },
      { id: 'q5-b', text: '惊讶', emoji: '😮', isCorrect: true },
      { id: 'q5-c', text: '开心', emoji: '😄', isCorrect: false },
      { id: 'q5-d', text: '平静', emoji: '😊', isCorrect: false },
    ],
    explanation: '眼睛和嘴巴都张得圆圆的，这是惊讶的表情！遇到意想不到的事情时会这样~',
  },
  {
    id: 'q6',
    type: 'emotion',
    question: '这个表情代表什么呢？',
    emoji: '😊',
    options: [
      { id: 'q6-a', text: '生气', emoji: '😠', isCorrect: false },
      { id: 'q6-b', text: '害怕', emoji: '😨', isCorrect: false },
      { id: 'q6-c', text: '平静', emoji: '😊', isCorrect: true },
      { id: 'q6-d', text: '惊讶', emoji: '😮', isCorrect: false },
    ],
    explanation: '面带微笑，神情放松，这是平静的感觉。平静的时候最舒服啦！',
  },
  {
    id: 'q7',
    type: 'situation',
    question: '好朋友哭了，你会怎么做？',
    emoji: '😢',
    options: [
      { id: 'q7-a', text: '不理他，自己玩', emoji: '🙈', isCorrect: false },
      { id: 'q7-b', text: '拍拍他，问他怎么了', emoji: '🤗', isCorrect: true },
      { id: 'q7-c', text: '笑话他爱哭', emoji: '😂', isCorrect: false },
      { id: 'q7-d', text: '告诉老师他在哭', emoji: '👩‍🏫', isCorrect: false },
    ],
    explanation: '好朋友难过的时候，陪伴和关心是最好的安慰。拍拍他、问问他需要什么帮助吧！',
  },
  {
    id: 'q8',
    type: 'situation',
    question: '你很生气，想要打人的时候，应该怎么做？',
    emoji: '😠',
    options: [
      { id: 'q8-a', text: '直接打出去', emoji: '👊', isCorrect: false },
      { id: 'q8-b', text: '深呼吸，从1数到10', emoji: '🌬️', isCorrect: true },
      { id: 'q8-c', text: '摔东西出气', emoji: '💥', isCorrect: false },
      { id: 'q8-d', text: '对着别人大喊大叫', emoji: '📢', isCorrect: false },
    ],
    explanation: '生气的时候，先让自己冷静下来。深呼吸、数数，或者找大人聊聊，都是好办法！',
  },
  {
    id: 'q9',
    type: 'situation',
    question: '看到同学摔倒了，你会怎么做？',
    emoji: '🤕',
    options: [
      { id: 'q9-a', text: '扶起来，问问疼不疼', emoji: '🤝', isCorrect: true },
      { id: 'q9-b', text: '假装没看见', emoji: '🙈', isCorrect: false },
      { id: 'q9-c', text: '哈哈大笑', emoji: '😂', isCorrect: false },
      { id: 'q9-d', text: '也假装摔倒', emoji: '🤡', isCorrect: false },
    ],
    explanation: '看到别人受伤了，伸出援手是最棒的！这就是关心和善良。',
  },
  {
    id: 'q10',
    type: 'situation',
    question: '你很害怕一个人睡觉，应该怎么办？',
    emoji: '🌙',
    options: [
      { id: 'q10-a', text: '偷偷哭，不让别人知道', emoji: '😭', isCorrect: false },
      { id: 'q10-b', text: '告诉爸爸妈妈你的感受', emoji: '👨‍👩‍👧', isCorrect: true },
      { id: 'q10-c', text: '把灯开一整夜', emoji: '💡', isCorrect: false },
      { id: 'q10-d', text: '跑去和爸爸妈妈睡', emoji: '🏃', isCorrect: false },
    ],
    explanation: '害怕的时候，告诉爸爸妈妈你的感受，他们会帮助你的。也可以抱抱喜欢的玩具熊~',
  },
  {
    id: 'q11',
    type: 'situation',
    question: '考试没考好，你会怎么想？',
    emoji: '📝',
    options: [
      { id: 'q11-a', text: '我太笨了，什么都不会', emoji: '😢', isCorrect: false },
      { id: 'q11-b', text: '这次没考好，下次努力', emoji: '💪', isCorrect: true },
      { id: 'q11-c', text: '都是老师出的题太难', emoji: '😠', isCorrect: false },
      { id: 'q11-d', text: '把试卷藏起来不让爸妈看', emoji: '🙈', isCorrect: false },
    ],
    explanation: '一次没考好没关系，重要的是找到没考好的原因，下次努力。每个人都有不擅长的事情！',
  },
  {
    id: 'q12',
    type: 'situation',
    question: '你想玩的玩具被别人拿走了，怎么办？',
    emoji: '🧸',
    options: [
      { id: 'q12-a', text: '大声哭闹', emoji: '😭', isCorrect: false },
      { id: 'q12-b', text: '用力抢回来', emoji: '💪', isCorrect: false },
      { id: 'q12-c', text: '好好说："能给我玩一会儿吗？"', emoji: '💬', isCorrect: true },
      { id: 'q12-d', text: '去告诉老师', emoji: '👩‍🏫', isCorrect: false },
    ],
    explanation: '用语言好好表达是最好的办法！可以商量轮流玩，或者一起玩。',
  },
];

export interface CopingMethodByIntensity {
  mild: { icon: string; text: string }[];
  moderate: { icon: string; text: string }[];
  intense: { icon: string; text: string }[];
}

export const EMOTION_COPING_BY_INTENSITY: Record<string, CopingMethodByIntensity> = {
  happy: {
    mild: [
      { icon: '😊', text: '微笑一下，享受这份快乐' },
      { icon: '✨', text: '在心里默默开心' },
    ],
    moderate: [
      { icon: '🎉', text: '和身边的人分享' },
      { icon: '📝', text: '记在小本子上' },
      { icon: '🎵', text: '哼一首快乐的歌' },
    ],
    intense: [
      { icon: '💃', text: '跳一支欢快的舞蹈' },
      { icon: '🎨', text: '画一幅开心的画' },
      { icon: '👨‍👩‍👧', text: '和家人一起庆祝' },
    ],
  },
  sad: {
    mild: [
      { icon: '💭', text: '想想开心的事情' },
      { icon: '🌸', text: '看看窗外的风景' },
    ],
    moderate: [
      { icon: '💬', text: '告诉好朋友你的感受' },
      { icon: '🧸', text: '抱抱喜欢的玩具' },
      { icon: '🎶', text: '听一首温柔的歌' },
    ],
    intense: [
      { icon: '😭', text: '哭出来没关系的' },
      { icon: '👨‍👩‍👧', text: '找爸爸妈妈抱抱' },
      { icon: '📖', text: '让大人读个故事给你听' },
    ],
  },
  angry: {
    mild: [
      { icon: '🌬️', text: '深呼吸三次' },
      { icon: '🔢', text: '从1数到10' },
    ],
    moderate: [
      { icon: '🏃', text: '去跑一跑跳一跳' },
      { icon: '📝', text: '画一画生气的样子' },
      { icon: '💧', text: '洗个冷水脸' },
    ],
    intense: [
      { icon: '🥊', text: '打枕头出气' },
      { icon: '👨‍👩‍👧', text: '找大人帮忙解决' },
      { icon: '🎧', text: '听听喜欢的音乐' },
    ],
  },
  scared: {
    mild: [
      { icon: '💪', text: '告诉自己：我很勇敢' },
      { icon: '✨', text: '想想开心的事情' },
    ],
    moderate: [
      { icon: '🧸', text: '抱着喜欢的玩具' },
      { icon: '💡', text: '把灯开亮一点' },
      { icon: '📖', text: '读一本有趣的书' },
    ],
    intense: [
      { icon: '👨‍👩‍👧', text: '马上找大人陪着你' },
      { icon: '📞', text: '给爸爸妈妈打电话' },
      { icon: '🤗', text: '让大人紧紧抱抱你' },
    ],
  },
  surprised: {
    mild: [
      { icon: '😯', text: '哇！真的吗？' },
      { icon: '👀', text: '再仔细看看' },
    ],
    moderate: [
      { icon: '❓', text: '问问为什么' },
      { icon: '🔍', text: '多了解一下' },
      { icon: '💬', text: '和朋友说说你的惊讶' },
    ],
    intense: [
      { icon: '🎉', text: '庆祝一下这个惊喜' },
      { icon: '📸', text: '把它记录下来' },
      { icon: '👨‍👩‍👧', text: '告诉家人这个好消息' },
    ],
  },
  calm: {
    mild: [
      { icon: '😊', text: '享受这份平静' },
      { icon: '🌿', text: '静静地待一会儿' },
    ],
    moderate: [
      { icon: '📚', text: '读一本喜欢的书' },
      { icon: '🎶', text: '听听轻音乐' },
      { icon: '🌳', text: '去户外走走' },
    ],
    intense: [
      { icon: '🧘', text: '做几个深呼吸' },
      { icon: '🎨', text: '画一幅安静的画' },
      { icon: '☕', text: '喝一杯温水' },
    ],
  },
};

export interface EmotionTriggerRecord {
  situationId: string;
  emotionId: string;
  timestamp: number;
}

export interface QuizStats {
  totalAnswered: number;
  correctAnswers: number;
  answeredQuestionIds: string[];
}

export interface MethodFeedbackRecord {
  emotionId: string;
  intensity: 'mild' | 'moderate' | 'intense';
  methodIndex: number;
  isUseful: boolean;
  timestamp: number;
}

export interface WeeklySummary {
  startDate: string;
  endDate: string;
  emotionCounts: Record<string, number>;
  totalDays: number;
  diaryDays: number;
}

