
import { ImageUp, X, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface EnhancedPhotoUploadProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  preview: string | null;
}

export function EnhancedPhotoUpload({ onChange, preview }: EnhancedPhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const hasValue = !!preview || !!selectedFile;
  const isFloating = isFocused || hasValue;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file ? file.name : "");
    onChange(e);
  };

  const clearPreview = () => {
    setSelectedFile("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    const syntheticEvent = {
      target: { files: null, value: "" }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      const file = files[0];
      setSelectedFile(file.name);
      
      // Create a synthetic event
      const syntheticEvent = {
        target: { files: files }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  return (
    <div className="relative group">
      <div className="flex items-center gap-3">
        {/* Main upload area */}
        <div 
          className={cn(
            "flex-1 relative transition-all duration-300 rounded-2xl",
            "bg-background/60 backdrop-blur-sm border-2 border-dashed border-border/40",
            "hover:bg-background/70 hover:border-primary/50",
            isDragOver && "border-primary bg-primary/5 scale-102",
            isFocused && "border-primary/60 bg-background/80 shadow-lg shadow-primary/10"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label
            htmlFor="photo"
            className="flex items-center justify-center h-14 cursor-pointer group/label"
          >
            <div className="flex items-center gap-3 px-4">
              <div className={cn(
                "transition-all duration-300",
                isFloating ? "text-primary scale-95" : "text-muted-foreground",
                isDragOver && "text-primary scale-110"
              )}>
                {isDragOver ? (
                  <Upload className="h-4 w-4" />
                ) : (
                  <ImageUp className="h-4 w-4" />
                )}
              </div>
              
              <div className="flex flex-col">
                <div className={cn(
                  "transition-all duration-300 pointer-events-none select-none font-medium",
                  isFloating
                    ? "text-xs text-primary -mb-1"
                    : "text-sm text-muted-foreground"
                )}>
                  Photo
                </div>
                
                {(selectedFile || isDragOver) && (
                  <div className={cn(
                    "text-sm font-medium transition-all duration-300",
                    isDragOver ? "text-primary" : "text-foreground"
                  )}>
                    {isDragOver ? "Drop image here" : selectedFile}
                  </div>
                )}
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="sr-only"
              aria-label="Upload Image"
            />
          </label>

          {/* Enhanced focus ring */}
          <div className={cn(
            "absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none",
            (isFocused || isDragOver) && "ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
          )} />
        </div>
        
        {/* Preview thumbnail with enhanced styling */}
        {preview && (
          <div className="relative group/preview">
            <div className="relative overflow-hidden rounded-xl bg-background/80 backdrop-blur-sm border border-border/40 shadow-md hover:shadow-lg transition-all duration-300">
              <img
                src={preview}
                alt="Preview"
                className="h-14 w-14 object-cover transition-transform duration-300 group-hover/preview:scale-110"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover/preview:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <button
                  type="button"
                  onClick={clearPreview}
                  className={cn(
                    "absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-lg",
                    "opacity-0 group-hover/preview:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
                  )}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
