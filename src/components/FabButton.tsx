import { ClockPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FabButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/create-task');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-[9999] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-none bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg transition-all duration-200 ease-in-out hover:scale-105 hover:from-blue-500 hover:to-blue-600 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 focus-visible:ring-4 focus-visible:ring-blue-600/20 active:scale-95 sm:bottom-4 sm:right-4 sm:h-12 sm:w-12"
    >
      <ClockPlus size={24} className="stroke-white stroke-2 drop-shadow-sm" />
    </button>
  );
}
