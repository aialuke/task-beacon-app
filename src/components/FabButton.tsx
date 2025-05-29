
import { ClockPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function FabButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/create-task");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 sm:bottom-4 sm:right-4 w-14 h-14 sm:w-12 sm:h-12 z-[9999] flex items-center justify-center transition-all duration-200 ease-in-out bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-full border-none shadow-lg hover:shadow-xl cursor-pointer hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2 focus-visible:ring-4 focus-visible:ring-blue-600/20"
    >
      <ClockPlus 
        size={24} 
        className="stroke-white stroke-2 drop-shadow-sm" 
      />
    </button>
  );
}
