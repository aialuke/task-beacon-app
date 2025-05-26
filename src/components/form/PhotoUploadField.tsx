
import { Input } from "@/components/ui/input";
import { ImageUp } from "lucide-react";
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

  return (
    <div className="space-y-3">
      <label
        htmlFor="photo"
        className="flex items-center justify-center gap-3 cursor-pointer bg-background border border-border/60 rounded-xl h-12 px-4 text-sm font-medium text-foreground hover:bg-accent/50 transition-all duration-200"
      >
        <ImageUp className="h-5 w-5 text-muted-foreground" />
        <span className="truncate">
          {selectedFile || "Add Image"}
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
