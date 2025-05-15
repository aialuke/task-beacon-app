
import { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { getDaysRemaining, getTimerColor } from "@/lib/utils";
import { TaskStatus } from "@/lib/types";

interface CountdownTimerProps {
  dueDate: string;
  status: TaskStatus;
  size?: number;
}

export default function CountdownTimer({ dueDate, status, size = 48 }: CountdownTimerProps) {
  // Calculate circle properties
  const radius = size / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  
  const [daysLeft, setDaysLeft] = useState<number>(getDaysRemaining(dueDate));
  const timerColor = getTimerColor(status);
  
  // Calculate the stroke dashoffset percentage
  const calculateOffset = () => {
    if (status === "complete") return 0;
    if (status === "overdue") return circumference;
    
    // For pending tasks, calculate remaining time percentage
    const totalDays = 14; // Assuming tasks typically have a two-week timeline
    const remainingPercentage = Math.min(Math.max(daysLeft / totalDays, 0), 1);
    return circumference * (1 - remainingPercentage);
  };
  
  // Set up the spring animation
  const { strokeDashoffset } = useSpring({
    from: { strokeDashoffset: circumference },
    to: { strokeDashoffset: calculateOffset() },
    config: { tension: 120, friction: 14 },
  });

  // Update days left when the component mounts and when the due date changes
  useEffect(() => {
    const updateDaysLeft = () => {
      setDaysLeft(getDaysRemaining(dueDate));
    };
    
    updateDaysLeft();
    
    // Update every day
    const interval = setInterval(updateDaysLeft, 86400000);
    return () => clearInterval(interval);
  }, [dueDate]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth="2"
          stroke="#E5EDFF"
        />
        
        {/* Progress circle */}
        <animated.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth="3"
          stroke={timerColor}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Text in center of circle */}
      <div 
        className="absolute inset-0 flex items-center justify-center font-medium"
        style={{ fontSize: '8px' }}
      >
        {status === "complete" ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : status === "overdue" ? (
          <span className="text-destructive">{Math.abs(daysLeft)}d</span>
        ) : (
          <span>{daysLeft}d</span>
        )}
      </div>
    </div>
  );
}
