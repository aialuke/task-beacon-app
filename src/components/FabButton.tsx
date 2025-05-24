
import { Plus } from "lucide-react";

interface FabButtonProps {
  onClick: () => void;
}

export function FabButton({ onClick }: FabButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 z-[9999] flex items-center justify-center transition-all duration-200 ease-in-out bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-full border-none shadow-lg hover:shadow-xl cursor-pointer hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2 focus-visible:shadow-[0_0_0_4px_rgba(79,109,225,0.2)] sm:bottom-4 sm:right-4 sm:w-12 sm:h-12"
    >
      <Plus 
        size={24} 
        className="stroke-white stroke-2 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]" 
      />
    </button>
  );
}
