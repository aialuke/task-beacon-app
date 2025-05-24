
import { lazy, Suspense } from "react";
import { FabButton } from "@/components/FabButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CreateTaskForm = lazy(() => import("../forms/CreateTaskForm"));

interface CreateTaskDialogProps {
  isDialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

export default function CreateTaskDialog({ isDialogOpen, setDialogOpen }: CreateTaskDialogProps) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <FabButton onClick={() => setDialogOpen(true)} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create New Task</DialogTitle>
        </DialogHeader>
        <Suspense fallback={<div className="p-4 text-center">Loading form...</div>}>
          <CreateTaskForm onClose={() => setDialogOpen(false)} />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
