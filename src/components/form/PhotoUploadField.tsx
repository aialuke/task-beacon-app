
import { Input } from "@/components/ui/input";
import { ImageUp, X } from "lucide-react";
import { useState } from "react";

interface PhotoUploadFieldProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  preview: string | null;
}

export function PhotoUploadField({ onChange, preview }: PhotoUploadFieldProps) {
  const [selectedFile, setSelectedFile] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file ? file.name : "");
    onChange(e);
  };

  const clearPreview = () => {
    setSelectedFile("");
    // Create a synthetic event to clear the file
    const syntheticEvent = {
      target: { files: null, value: "" }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  return (
    <div className="space-y-4">
      <label
        htmlFor="photo"
        className="flex items-center justify-center gap-3 cursor-pointer bg-background/80 border-2 border-dashed border-border/60 rounded-2xl h-14 px-4 text-base font-medium text-foreground hover:bg-accent/50 hover:border-primary/50 transition-all duration-300 group"
      >
        <ImageUp className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        <span className="truncate group-hover:text-primary transition-colors">
          {selectedFile || "Choose Image"}
        </span>
        
        <Input
          id="photo"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only"
          aria-label="Add Image"
        />
      </label>
      
      {preview && (
        <div className="animate-fade-in">
          <div className="relative inline-block group">
            <img
              src={preview}
              alt="Preview"
              className="h-24 w-24 object-cover rounded-2xl shadow-lg border-2 border-border/30 hover:shadow-xl transition-all duration-300"
            />
            <button
              type="button"
              onClick={clearPreview}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl pointer-events-none"></div>
          </div>
        </div>
      )}
    </div>
  );
}
