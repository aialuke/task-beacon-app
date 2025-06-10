
import { ClockPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function FabButton() {
  const navigate = useNavigate();

  return (
    <button
      className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary fixed bottom-7 right-7 z-[9999] flex size-[52px] items-center justify-center rounded-full shadow-lg transition-all duration-200 ease-in-out hover:scale-105 focus:ring-2 focus:ring-offset-2 active:scale-95 sm:bottom-6 sm:right-6"
      onClick={() => { navigate("/create-task"); }}
      aria-label="Create new task"
    >
      <ClockPlus size={25} strokeWidth={2.5} className="text-primary-foreground" />
    </button>
  );
}
