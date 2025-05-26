
import React from "react";
import { Link, ExternalLink } from "lucide-react";

interface ReferenceCardProps {
  title: string;
  description?: string | null;
  url?: string | null;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export function ReferenceCard({ 
  title, 
  description, 
  url, 
  label, 
  icon,
  className = ""
}: ReferenceCardProps) {
  return (
    <div className={`p-4 bg-accent/30 backdrop-blur-sm rounded-xl border border-accent/40 shadow-sm ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-accent/50 rounded-lg mt-0.5">
          {icon || <Link className="h-4 w-4 text-accent-foreground" />}
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
            {label}
          </p>
          <h4 className="font-semibold text-sm text-foreground leading-relaxed">
            {title}
          </h4>
          {description && (
            <p className="text-xs text-muted-foreground/80 line-clamp-2">
              {description}
            </p>
          )}
          {url && (
            <div className="pt-2">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                <span className="truncate max-w-[200px]">
                  {url}
                </span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
