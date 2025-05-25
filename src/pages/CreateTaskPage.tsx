
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
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Create New Task</h1>
        </div>
        
        <CreateTaskForm onClose={handleClose} />
      </div>
    </div>
  );
}
