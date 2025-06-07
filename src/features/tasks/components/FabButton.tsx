
import { ClockPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function FabButton() {
  const navigate = useNavigate();

  return (
    <button
      className="fixed bottom-10 right-10 z-[9999] h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 sm:bottom-8 sm:right-8 flex items-center justify-center"
      onClick={() => navigate("/create-task")}
      aria-label="Create new task"
    >
      <ClockPlus size={32} strokeWidth={2.5} className="text-primary-foreground" />
    </button>
  );
}
