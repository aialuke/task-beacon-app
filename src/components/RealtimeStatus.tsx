
import { memo } from 'react';
import { useTaskRealtime } from '@/hooks/useTaskRealtime';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * Component to show real-time connection status
 */
function RealtimeStatus() {
  const { isSubscribed } = useTaskRealtime();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge 
          variant={isSubscribed ? "default" : "secondary"}
          className={`
            h-6 px-2 text-xs font-medium transition-all duration-300
            ${isSubscribed 
              ? 'bg-green-100 text-green-800 border-green-200' 
              : 'bg-gray-100 text-gray-600 border-gray-200'
            }
          `}
        >
          <div className={`
            w-2 h-2 rounded-full mr-1.5 transition-all duration-300
            ${isSubscribed 
              ? 'bg-green-500 animate-pulse' 
              : 'bg-gray-400'
            }
          `} />
          {isSubscribed ? 'Live' : 'Offline'}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {isSubscribed 
            ? 'Real-time updates active' 
            : 'Real-time updates disconnected'
          }
        </p>
      </TooltipContent>
    </Tooltip>
  );
}

export default memo(RealtimeStatus);
