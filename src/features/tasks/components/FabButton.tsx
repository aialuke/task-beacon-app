
import { ClockPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function FabButton() {
  const navigate = useNavigate();

  return (
    <Button
      variant="default"
      size="icon"
      className="fixed bottom-6 right-6 z-[9999] h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 sm:bottom-4 sm:right-4"
      onClick={() => navigate("/create-task")}
      aria-label="Create new task"
    >
      <ClockPlus className="h-6 w-6 stroke-2 drop-shadow-sm" />
    </Button>
  );
}
