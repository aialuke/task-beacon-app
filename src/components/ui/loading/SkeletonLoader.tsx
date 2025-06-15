/**
 * Skeleton Loader Components - Phase 2 UX Optimization
 * 
 * Provides skeleton loading states for better perceived performance
 */

import React from 'react';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'circle' | 'rounded';
}

export function Skeleton({ className, variant = 'default' }: SkeletonProps) {
  const variantClasses = {
    default: 'rounded',
    circle: 'rounded-full',
    rounded: 'rounded-lg',
  };

  return (
    <div 
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        variantClasses[variant],
        className
      )}
      aria-label="Loading..."
    />
  );
}

// Task Card Skeleton
export function TaskCardSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border bg-white p-4 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton variant="circle" className="size-8" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-5 w-20" variant="rounded" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

// Form Skeleton
export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-20 w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-18 h-4" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-20" variant="rounded" />
        <Skeleton className="h-10 w-24" variant="rounded" />
      </div>
    </div>
  );
}

// User List Skeleton
export function UserListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="flex items-center space-x-3 p-2">
          <Skeleton variant="circle" className="size-8" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Modal Content Skeleton
export function ModalContentSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton variant="circle" className="size-6" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="pt-4">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

// Quick Action Bar Skeleton
export function QuickActionBarSkeleton() {
  return (
    <div className="flex items-center gap-2 border-t p-2">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton 
          key={i} 
          variant="circle" 
          className="size-8" 
        />
      ))}
    </div>
  );
}

// Image Gallery Skeleton
export function ImageGallerySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton 
          key={i} 
          className="aspect-square w-full" 
          variant="rounded"
        />
      ))}
    </div>
  );
}

// Navigation Skeleton
export function NavigationSkeleton() {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-4">
        <Skeleton variant="circle" className="size-8" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton variant="circle" className="size-8" />
        <Skeleton variant="circle" className="size-8" />
      </div>
    </div>
  );
}

// Page Loading Skeleton (for entire page loading states)
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationSkeleton />
      <div className="container mx-auto space-y-6 px-4 py-8">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6">
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
        </div>
      </div>
    </div>
  );
}