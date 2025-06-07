
import { ClockPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function FabButton() {
  const navigate = useNavigate();

  return (
    <Button
      variant="default"
      size="icon"
      className="fixed bottom-8 right-8 z-[9999] h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6"
      onClick={() => navigate("/create-task")}
      aria-label="Create new task"
    >
      <ClockPlus className="h-8 w-8 stroke-[2.5] drop-shadow-sm" />
    </Button>
  );
}
