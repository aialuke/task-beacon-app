
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import CreateTaskForm from "@/features/tasks/forms/CreateTaskForm";

export default function CreateTaskPage() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 animate-fade-in">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-6 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="p-3 hover:bg-accent/80 transition-all duration-200 hover:scale-105 rounded-full shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Create New Task</h1>
            <p className="text-muted-foreground text-sm">Fill in the details to create your task</p>
          </div>
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CreateTaskForm onClose={handleClose} />
        </div>
      </div>
    </div>
  );
}
