
import { ClockPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function FabButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/create-task");
  };

  return (
    <Button
      onClick={handleClick}
      variant="brand"
      size="icon"
      className="fixed bottom-6 right-6 w-14 h-14 z-[9999] shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 sm:bottom-4 sm:right-4 sm:w-12 sm:h-12"
      aria-label="Create new task"
    >
      <ClockPlus 
        size={24} 
        className="stroke-white stroke-2 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]" 
      />
    </Button>
  );
}
