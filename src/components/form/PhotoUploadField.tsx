
import { Input } from "@/components/ui/input";
import { ImagePlus } from "lucide-react";
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
      <div className="relative">
        <Input
          id="photo"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="cursor-pointer bg-background/70 border border-border/60 rounded-xl h-12 text-transparent file:hidden [&::-webkit-file-upload-button]:hidden"
          aria-label="Attach File"
        />
        <ImagePlus className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground/70 pointer-events-none truncate pr-12">
          {selectedFile || "Choose file..."}
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
