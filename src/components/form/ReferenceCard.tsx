
import { Link, ExternalLink } from 'lucide-react';

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
  className = '',
}: ReferenceCardProps) {
  return (
    <div
      className={`border-accent/40 bg-accent/30 rounded-xl border p-4 shadow-sm backdrop-blur-sm ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="bg-accent/50 mt-0.5 rounded-xl p-2">
          {icon ?? <Link className="text-accent-foreground size-4" />}
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            {label}
          </p>
          <h4 className="text-foreground text-sm font-semibold leading-relaxed">
            {title}
          </h4>
          {description && (
            <p className="text-muted-foreground/80 line-clamp-2 text-xs">
              {description}
            </p>
          )}
          {url && (
            <div className="pt-2">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 inline-flex items-center gap-1.5 text-xs transition-colors"
              >
                <ExternalLink className="size-3" />
                <span className="max-w-[200px] truncate">{url}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
