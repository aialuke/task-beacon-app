import { Input } from '@/components/ui/input';
import { ImageUp, X } from 'lucide-react';
import { useState } from 'react';

interface PhotoUploadFieldProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  preview: string | null;
}

export function PhotoUploadField({ onChange, preview }: PhotoUploadFieldProps) {
  const [selectedFile, setSelectedFile] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file ? file.name : '');
    onChange(e);
  };

  const clearPreview = () => {
    setSelectedFile('');
    // Create a synthetic event to clear the file
    const syntheticEvent = {
      target: { files: null, value: '' },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="photo"
        className="group flex h-8 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/60 bg-background/80 px-3 text-xs font-medium text-foreground transition-all duration-200 hover:border-primary/50 hover:bg-accent/50"
      >
        <ImageUp className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
        <span className="truncate transition-colors group-hover:text-primary">
          {selectedFile || 'Image'}
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
        <div className="group relative">
          <img
            src={preview}
            alt="Preview"
            className="h-8 w-8 rounded-lg border border-border/30 object-cover shadow-sm transition-all duration-200 hover:shadow-md"
          />
          <button
            type="button"
            onClick={clearPreview}
            className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground opacity-0 shadow-sm transition-all duration-200 hover:scale-110 group-hover:opacity-100"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </div>
      )}
    </div>
  );
}
