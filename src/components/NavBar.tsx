import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavBarProps {
  title: string;
  showBack?: boolean;
  className?: string;
}

export default function NavBar({ title, showBack = true, className }: NavBarProps) {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        'sticky top-0 z-50 flex items-center justify-center px-4 py-4 bg-white/80 backdrop-blur-md shadow-sm',
        className
      )}
    >
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <span className="text-2xl">←</span>
        </button>
      )}
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
    </div>
  );
}
