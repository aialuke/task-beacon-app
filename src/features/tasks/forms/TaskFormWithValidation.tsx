
import { useFormWithValidation } from "@/features/tasks/hooks/useFormWithValidation";
import { createTaskSchema, CreateTaskInput } from "@/features/tasks/schemas/taskSchema";
import { Form } from "@/components/ui/form";
import { FormField } from "@/components/ui/form";
import { FormItem } from "@/components/ui/form";
import { FormLabel } from "@/components/ui/form";
import { FormControl } from "@/components/ui/form";
import { FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerField } from "@/components/form/DatePickerField";
import { PhotoUploadField } from "@/components/form/PhotoUploadField";
import { FormActions } from "@/components/form/FormActions";
import { UserSearchField } from "@/components/form/UserSearchField";
import { useState } from "react";

interface TaskFormProps {
  onSubmit: (data: CreateTaskInput & { photo: File | null }) => Promise<void>;
  onClose?: () => void;
}

export default function TaskFormWithValidation({ onSubmit, onClose }: TaskFormProps) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const form = useFormWithValidation<CreateTaskInput>({
    schema: createTaskSchema,
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      url: "",
      pinned: false,
      assigneeId: "",
    },
    onSubmit: async (data) => {
      await onSubmit({ ...data, photo });
    },
    successMessage: "Task created successfully",
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const preview = URL.createObjectURL(file);
      setPhotoPreview(preview);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit()} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Task title" {...field} maxLength={22} />
              </FormControl>
              <div className="flex justify-end">
                <span className={`text-xs ${field.value.length > 22 ? "text-destructive" : "text-muted-foreground"}`}>
                  {field.value.length}/22
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Task description" {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <DatePickerField value={field.value} onChange={(e) => field.onChange(e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} type="url" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <FormLabel>Photo</FormLabel>
          <PhotoUploadField
            onChange={handlePhotoChange}
            preview={photoPreview}
          />
        </div>
        
        <FormField
          control={form.control}
          name="assigneeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignee</FormLabel>
              <FormControl>
                <UserSearchField
                  value={field.value}
                  onChange={field.onChange}
                  disabled={form.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormActions
          onCancel={onClose}
          isSubmitting={form.isSubmitting}
        />
      </form>
    </Form>
  );
}
