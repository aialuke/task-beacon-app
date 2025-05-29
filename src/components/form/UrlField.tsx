import React from 'react';
import { Input } from '@/components/ui/input';

interface UrlFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UrlField({ value, onChange }: UrlFieldProps) {
  return (
    <div className="space-y-2">
      <Input
        id="url"
        type="url"
        value={value}
        onChange={onChange}
        placeholder="https://example.com"
        className="text-foreground"
      />
    </div>
  );
}
