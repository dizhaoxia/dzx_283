import { Link } from 'react-router-dom';

interface MenuItem {
  title: string;
  emoji: string;
  path: string;
  gradient: string;
  shadow: string;
}

const menuItems: MenuItem[] = [
  {
    title: '情绪卡片',
    emoji: '😊',
    path: '/emotion-cards',
    gradient: 'from-pink-300 via-pink-400 to-rose-400',
    shadow: 'shadow-pink-200',
  },
  {
    title: '情境模拟',
    emoji: '🎭',
    path: '/situations',
    gradient: 'from-yellow-300 via-amber-400 to-orange-400',
    shadow: 'shadow-yellow-200',
  },
  {
    title: '情绪选择轮',
    emoji: '🎡',
    path: '/emotion-wheel',
    gradient: 'from-sky-300 via-blue-400 to-indigo-400',
    shadow: 'shadow-blue-200',
  },
  {
    title: '呼吸练习',
    emoji: '🌬️',
    path: '/breathing',
    gradient: 'from-teal-300 via-emerald-400 to-green-400',
    shadow: 'shadow-emerald-200',
  },
  {
    title: '心情日记',
    emoji: '📔',
    path: '/diary',
    gradient: 'from-purple-300 via-violet-400 to-fuchsia-400',
    shadow: 'shadow-purple-200',
  },
  {
    title: '家长看板',
    emoji: '📊',
    path: '/parent-dashboard',
    gradient: 'from-orange-300 via-red-400 to-pink-400',
    shadow: 'shadow-orange-200',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen px-4 pb-10 pt-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-4xl font-bold text-gray-800 md:text-5xl">
            🌈 情绪小乐园
          </h1>
          <p className="text-lg text-gray-600 md:text-xl">
            和小朋友一起认识情绪吧！
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br ${item.gradient} p-6 text-white shadow-xl ${item.shadow} transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl active:scale-95`}
            >
              <span className="mb-3 text-5xl transition-transform duration-300 group-hover:scale-125 md:text-6xl">
                {item.emoji}
              </span>
              <span className="text-base font-bold md:text-lg">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
