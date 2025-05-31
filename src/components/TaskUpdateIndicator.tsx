
import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface TaskUpdateIndicatorProps {
  taskId: string;
  show: boolean;
  type: 'updated' | 'created' | 'deleted';
}

/**
 * Visual indicator for real-time task updates
 */
function TaskUpdateIndicator({ taskId, show, type }: TaskUpdateIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  const getIndicatorConfig = () => {
    switch (type) {
      case 'created':
        return {
          label: 'New',
          className: 'bg-blue-100 text-blue-800 border-blue-200',
        };
      case 'updated':
        return {
          label: 'Updated',
          className: 'bg-amber-100 text-amber-800 border-amber-200',
        };
      case 'deleted':
        return {
          label: 'Deleted',
          className: 'bg-red-100 text-red-800 border-red-200',
        };
      default:
        return {
          label: 'Changed',
          className: 'bg-gray-100 text-gray-800 border-gray-200',
        };
    }
  };

  const config = getIndicatorConfig();

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
          <Badge 
            className={`
              h-6 px-2 text-xs font-medium shadow-sm
              ${config.className}
            `}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-current mr-1"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            {config.label}
          </Badge>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(TaskUpdateIndicator);
