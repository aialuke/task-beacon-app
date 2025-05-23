
import { Input } from "@/components/ui/input";

interface PhotoUploadFieldProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  preview: string | null;
}

export function PhotoUploadField({ onChange, preview }: PhotoUploadFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <Input
          id="photo"
          type="file"
          accept="image/*"
          onChange={onChange}
          className="cursor-pointer w-full sm:w-auto"
          aria-label="Attach File"
        />
      </div>
      {preview && (
        <div className="mt-2">
          <img
            src={preview}
            alt="Preview"
            className="h-20 w-20 object-cover rounded-xl"
          />
        </div>
      )}
    </div>
  );
}
