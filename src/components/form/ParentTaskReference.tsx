
import React from "react";
import { Task } from "@/lib/types";
import { Link, ExternalLink } from "lucide-react";

interface ParentTaskReferenceProps {
  parentTask: Task;
}

export function ParentTaskReference({ parentTask }: ParentTaskReferenceProps) {
  return (
    <div className="p-4 bg-accent/30 backdrop-blur-sm rounded-xl border border-accent/40 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-accent/50 rounded-lg mt-0.5">
          <Link className="h-4 w-4 text-accent-foreground" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
            Following up on
          </p>
          <h4 className="font-semibold text-sm text-foreground leading-relaxed">
            {parentTask.title}
          </h4>
          {parentTask.description && (
            <p className="text-xs text-muted-foreground/80 line-clamp-2">
              {parentTask.description}
            </p>
          )}
          {parentTask.url_link && (
            <div className="pt-2">
              <a
                href={parentTask.url_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                <span className="truncate max-w-[200px]">
                  {parentTask.url_link}
                </span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
