
import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface RealtimeUpdateIndicatorProps {
  show: boolean;
  type?: 'updated' | 'created' | 'deleted';
  label?: string;
  duration?: number;
}

/**
 * Simplified visual indicator for real-time updates
 */
function RealtimeUpdateIndicator({ 
  show, 
  type = 'updated', 
  label,
  duration = 3000 
}: RealtimeUpdateIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  const getConfig = () => {
    const configs = {
      created: { label: 'New', className: 'bg-blue-100 text-blue-800 border-blue-200' },
      updated: { label: 'Updated', className: 'bg-amber-100 text-amber-800 border-amber-200' },
      deleted: { label: 'Deleted', className: 'bg-red-100 text-red-800 border-red-200' },
    };
    return configs[type];
  };

  const config = getConfig();
  const displayLabel = label || config.label;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute top-2 right-2 z-10"
        >
          <Badge className={`h-6 px-2 text-xs font-medium shadow-sm ${config.className}`}>
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-current mr-1"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            {displayLabel}
          </Badge>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(RealtimeUpdateIndicator);
