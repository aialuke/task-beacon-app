
import { Input } from "@/components/ui/input";
import { ImagePlus } from "lucide-react";

interface PhotoUploadFieldProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  preview: string | null;
}

export function PhotoUploadField({ onChange, preview }: PhotoUploadFieldProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          id="photo"
          type="file"
          accept="image/*"
          onChange={onChange}
          className="cursor-pointer bg-background/70 border-border/60 rounded-xl h-12 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-accent/80 file:text-accent-foreground file:font-medium file:transition-all file:duration-200 hover:file:bg-accent transition-all duration-200 focus:shadow-lg focus:bg-background [&::-webkit-file-upload-button]:hidden file:hidden"
          aria-label="Attach File"
          placeholder="Choose file..."
        />
        <ImagePlus className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground/70 pointer-events-none">
          Choose file...
        </span>
      </div>
      {preview && (
        <div className="animate-fade-in">
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="h-20 w-20 object-cover rounded-xl shadow-md border border-border/30 hover:shadow-lg transition-all duration-200"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl pointer-events-none"></div>
          </div>
        </div>
      )}
    </div>
  );
}
