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
      className={`rounded-xl border border-accent/40 bg-accent/30 p-4 shadow-sm backdrop-blur-sm ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-xl bg-accent/50 p-2">
          {icon ?? <Link className="size-4 text-accent-foreground" />}
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <h4 className="text-sm font-semibold leading-relaxed text-foreground">
            {title}
          </h4>
          {description && (
            <p className="line-clamp-2 text-xs text-muted-foreground/80">
              {description}
            </p>
          )}
          {url && (
            <div className="pt-2">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary transition-colors hover:text-primary/80"
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
